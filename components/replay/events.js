import { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';

const columnHeight = 20;
const columnSeparator = 5;
const verticalPadding = 20;
const horizontalPadding = 20;
const widthScaling = .15;

const namespace = 'http://www.w3.org/2000/svg';

const addSVGElement = (parent, type, { children, ...attributes }) => {
    const element = document.createElementNS(namespace, type);

    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }

    parent.appendChild(element);
};

const drawEvents = (svg, events, attributes = {}) => {
    for (const { startTime, endTime, column } of events) {
        addSVGElement(svg, 'rect', {
            x: startTime * widthScaling,
            y: column * columnHeight + column * columnSeparator,
            width: (endTime - startTime) * widthScaling,
            height: columnHeight,
            fill: colors.gray[500],
            ...attributes,
        });
    }
};

export const ReplayEventsVisualisation = ({ replay, beatmap }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = svgRef.current;

        drawEvents(svg, beatmap.events);

        drawEvents(svg, replay.events, {
            fill: colors.indigo[500],
            'fill-opacity': .5,
        });

        return () => svg.innerHTML = '';
    }, [ beatmap.events, replay.events, svgRef ]);

    const lastEventEnd = Math.max(replay.events[replay.events.length - 1].endTime,
        beatmap.events[beatmap.events.length - 1].endTime);

    return (<>
        <p>
            Beatmap events are gray, replay events are colored and slightly opaque.
        </p>

        <div className={'overflow-x-auto h-min'}>
            <svg ref={svgRef} width={lastEventEnd * widthScaling + horizontalPadding}
                height={columnHeight * beatmap.columns + verticalPadding} />
        </div>
    </>);
};
