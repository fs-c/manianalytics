import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';
import { eventsToActions, getActionsOffsets } from 'src/utils';

export const ReplayErrorVisualisation = ({ beatmap, replay }) => {
    const replayActions = eventsToActions(replay.events);
    const beatmapActions = eventsToActions(beatmap.events);

    const offsets = getActionsOffsets(replayActions, beatmapActions);

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

    return (<>
        <div ref={containerRef} className={'text-gray-200'} />
    </>);
};
