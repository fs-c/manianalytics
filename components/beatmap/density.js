import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from 'react';

const eventsToActions = (events) => {
    const actions = [];

    for (const event of events) {
        actions.push(event.startTime);
        actions.push(event.endTime);
    }

    return actions;
};

export const BeatmapDensityVisualisation = ({ beatmap }) => {
    const actions = eventsToActions(beatmap.events);

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
                label: '↑ Number of Actions',
            },
            x: {
                label: 'Seconds →',
                transform: f => f / 1000, // ms to s
            },
            marks: [
                Plot.rectY(actions, Plot.binX({
                    y: 'count', thresholds: 50
                })),
            ]
        });

        containerRef.current.append(chart);

        return () => chart.remove();
    }, [ actions, containerRef ]);

    return (<>
        <div ref={containerRef} className={'text-gray-200'} />
    </>);
};
