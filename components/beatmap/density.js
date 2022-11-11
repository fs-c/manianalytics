import * as colors from 'tailwindcss/colors'
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from 'react';

const eventsToActions = (events) => {
    const actions = [];

    for (const event of events) {
        actions.push(event.startTime);
        actions.push(event.endTime);
    }

    return actions;
};

const getActionDensity = (actions) => {
    const densityPrecision = 1000;

    const density = [];

    for (const action of actions) {
        const i = Math.floor(action / densityPrecision);

        density[i] = density[i] ? density[i] + 1 : 1;
    }

    return density;
};

export const BeatmapDensityVisualisation = ({ beatmap }) => {
    const actions = eventsToActions(beatmap.events);

    const containerRef = useRef();

    useEffect(() => {
        const chart = Plot.plot({
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

        chart.setAttribute('font-size', 10);

        containerRef.current.append(chart);

        return () => chart.remove();
    }, [ actions ]);

    return (<>
        <div ref={containerRef} className={'text-gray-200 text-2xl'} />
    </>);
};

// export const BeatmapDensityVisualisation = ({ beatmap }) => {
//     const density = getActionDensity(eventsToActions(beatmap.events));
//     const data = density.map((d, i) => ({ time: i, density: d }))
//         .filter((d) => d);

//     return (<>
//         <ResponsiveContainer width={'100%'} height={'40%'} minHeight={300}>
//             <LineChart
//                 width={500}
//                 height={300}
//                 data={data}
//             >
//                 <CartesianGrid style={{ stroke: colors.gray[700] }} />

//                 <Line dot={false} type={'basis'} dataKey={'density'} stroke={colors.indigo[500]} />
//             </LineChart>
//         </ResponsiveContainer>
//     </>);
// };
