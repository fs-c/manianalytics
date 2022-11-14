import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';
import { getEventsOffsets } from 'src/utils';

export const ReplayErrorVisualisation = ({ beatmap, replay }) => {
    const offsets = getEventsOffsets(beatmap.events, replay.events);

    const containerRef = useRef();

    useEffect(() => {
        const { width } = containerRef.current.getBoundingClientRect();

        const chart = Plot.plot({
            width,
            grid: true,
            style: {
                background: 'transparent',
            },
            y: {
                label: '↑ Mean error in ms',
            },
            x: {
                label: 'Seconds →',
                transform: f => f / 1000, // ms to s
            },
            marks: [
                Plot.lineY(offsets.absolute, Plot.binX({
                    y: 'mean', filter: null, thresholds: 90,
                }, { x: 'time', y: 'offset' })),
                Plot.areaY(offsets.absolute, Plot.binX({
                    y: 'mean', filter: null, thresholds: 90,
                }, { x: 'time', y: 'offset', fill: colors.gray[500], fillOpacity: .5 })),
                Plot.frame(),
            ]
        });

        containerRef.current.append(chart);

        return () => {
            chart.remove()
        };
    }, [ offsets, containerRef ]);

    const meanError = offsets.absolute.reduce((a, c) => a + c.offset, 0)
        / offsets.absolute.length;
    const stdDev = Math.sqrt(
        offsets.absolute.reduce((a, c) => a + Math.pow(c.offset - meanError, 2), 0)
            / offsets.absolute.length
    );

    return (<>
        <p>
            Mean absolute error {meanError.toFixed(3)}ms with standard 
            deviation {stdDev.toFixed(3)}.
        </p>

        <div ref={containerRef} className={'text-gray-200'} />
    </>);
};
