import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import colors from 'tailwindcss/colors';

const maxTapTime = 200;

export const TapTimeVisualization = ({ replay }) => {
    const tapEvents = replay.events.filter((e) => e && (e.endTime - e.startTime) < maxTapTime)
        .map((e) => { e.duration = e.endTime - e.startTime; return e; });
    
    const containerRef = useRef();

    useEffect(() => {
        const { width } = containerRef.current.getBoundingClientRect();

        console.log(tapEvents);

        const chart = Plot.plot({
            width,
            grid: true,
            style: {
                background: 'transparent',
            },
            x: {
                label: 'Tap duration in ms →',
            },
            marks: [
                Plot.lineY(tapEvents, Plot.binX({
                    y: 'count', filter: null, thresholds: 90
                }, { x: 'duration' })),
                Plot.areaY(tapEvents, Plot.binX({
                    y: 'count', filter: null, thresholds: 90
                }, { x: 'duration', fill: colors.gray[500], fillOpacity: .5 })),
                Plot.frame(),
            ],
        });

        containerRef.current.append(chart);

        return () => {
            chart.remove()
        };
    }, [ tapEvents, containerRef ]);

    return (<>
        <div ref={containerRef} className={'text-gray-200'} />
    </>);
};