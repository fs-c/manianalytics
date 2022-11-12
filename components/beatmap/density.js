import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';
import { eventsToActions } from 'src/utils';

export const BeatmapDensityVisualisation = ({ beatmap, facet = false }) => {
    const actions = eventsToActions(beatmap.events);

    const containerRef = useRef();

    useEffect(() => {
        const { width } = containerRef.current.getBoundingClientRect();

        const chart = Plot.plot({
            facet: facet ? {
                data: actions,
                y: 'key',
            } : undefined,
            width,
            grid: true,
            style: {
                background: 'transparent',
            },
            y: {
                label: '↑ Number of Actions',
            },
            x: {
                label: 'Seconds →',
                transform: f => f / 1000, // ms to s
            },
            marks: [
                Plot.lineY(actions, Plot.binX({
                    y: 'count', filter: null, thresholds: 90,
                }, { x: 'time' })),
                Plot.areaY(actions, Plot.binX({
                    y: 'count', filter: null, thresholds: 90,
                }, { x: 'time', fill: colors.gray[500], fillOpacity: .5 })),
                Plot.frame(),
            ]
        });

        containerRef.current.append(chart);

        return () => {
            chart.remove()
        };
    }, [ facet, actions, containerRef ]);

    return (<>
        <div ref={containerRef} className={'text-gray-200'} />
    </>);
};
