import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';

export const BeatmapEventVisualisation = ({ columns, beatmap }) => {
    const canvasRef = useRef();

    const { events } = beatmap;

    useEffect(() => {
        const slider = canvasRef.current;
        const sliderContext = slider.getContext('2d');

        sliderContext.fillStyle = colors.indigo[500];

        const { width, height } = slider.getBoundingClientRect();

        const columnHeight = height / columns;

        const maximumTime = events[events.length - 1].endTime;

        for (const event of events) {
            sliderContext.fillRect(
                (event.startTime / maximumTime) * width, event.column * columnHeight,
                ((event.endTime - event.startTime) / maximumTime) * width, columnHeight
            );
        }

        return () => {
            sliderContext.clearRect(0, 0, slider.width, slider.height);
        };
    }, [ columns, events ]);

    return (<>
        <div className={'flex flex-row gap-4'}>
            <div className={'overflow-x-scroll border border-gray-600'}>
                <canvas ref={canvasRef} height={'100px'} width={10000} />
            </div>
        </div>
    </>);
};