import { Fragment, useEffect, useState } from 'react';

import { Sidebar } from 'components/sidebar';
import { BeatmapDensityVisualisation } from 'components/beatmap/density';
import { ReplayErrorVisualisation } from 'components/replay/error';
import { ReplayEventsVisualisation } from 'components/replay/events';

import exampleBeatmap from 'src/exampleBeatmap';
import exampleReplay from 'src/exampleReplay';
import { getBeatmapName, getReplayName } from 'src/utils';

const Home = () => {
    const [ beatmap, setBeatmap ] = useState(exampleBeatmap);
    const [ replays, setReplays ] = useState([ exampleReplay ]);

    useEffect(() => {
        if (beatmap !== exampleBeatmap) {
            // clear replays when beatmap is changed
            setReplays([]);
        }
    }, [ beatmap ]);

    const addReplay = (replay) => {
        setReplays((r) => [ ...r, replay ]);
    };

    const removeReplay = (replay) => {
        setReplays((replays) => replays.filter((r) => r !== replay));
    };

    return (<>
        <div className={'flex flex-col md:flex-row min-h-screen'}>
            <div className={'min-w-max p-4 bg-gray-900 shadow-md'}>
                <Sidebar onBeatmapSelected={setBeatmap}
                    onReplayAdded={addReplay} />
            </div>

            <div className={'p-4 min-w-0 flex flex-col gap-8 w-full'}>
                {beatmap ? (<>
                    <h2 className={'font-semibold'}>
                        <span className={'text-gray-300 font-normal mr-2'}>
                            Beatmap
                        </span> {getBeatmapName(beatmap)}
                    </h2>

                    <BeatmapDensityVisualisation beatmap={beatmap} />

                    <BeatmapDensityVisualisation beatmap={beatmap} facet={true} />
                </>) : (<>
                    <p className={'text-gray-400'}>
                        No beatmap selected, nothing to display.
                    </p>
                </>)}

                {beatmap && replays.map((replay) => (<Fragment key={replay.replayHash}>
                    <div className={'flex flex-row justify-between items-center'}>
                        <h2 className={'font-semibold'}>
                            <span className={'text-gray-300 font-normal mr-2'}>
                                Replay
                            </span> {getReplayName(replay)}
                        </h2>

                        <button className={'text-gray-300'} onClick={() => removeReplay(replay)}>
                            Remove
                        </button>
                    </div>

                    <ReplayErrorVisualisation replay={replay} beatmap={beatmap} />
                    <ReplayEventsVisualisation replay={replay} beatmap={beatmap} />
                </Fragment>))}
            </div>
        </div>
    </>);
};

export default Home;
