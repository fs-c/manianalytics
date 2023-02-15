import { Fragment, useEffect, useState } from 'react';

import { BeatmapDensityVisualisation } from 'components/beatmap/density';
import { ReplayErrorVisualisation } from 'components/replay/error';
import { ReplayEventsVisualisation } from 'components/replay/events';

import exampleBeatmap from 'src/exampleBeatmap';
import exampleReplay from 'src/exampleReplay';
import { getBeatmapName, getReplayName } from 'src/utils';

import { parseRawOsu } from 'src/parsers/osu';
import { parseRawOsr } from 'src/parsers/osr';
import { FileInput } from 'components/fileinput';
import { TapTimeVisualization } from 'components/replay/tap-time';

const Home = () => {
    const [ beatmap, setBeatmap ] = useState(exampleBeatmap);
    const [ replays, setReplays ] = useState([ exampleReplay ]);

    useEffect(() => {
        if (beatmap !== exampleBeatmap) {
            // clear replays when beatmap is changed
            setReplays([]);
        }
    }, [ beatmap ]);

    const addReplay = (rawReplay) => {
        const parsedReplay = parseRawOsr(rawReplay);

        setReplays((r) => [ ...r, parsedReplay ]);
    };

    const removeReplay = (replay) => {
        setReplays((replays) => replays.filter((r) => r !== replay));
    };

    const changeBeatmap = (rawBeatmap) => {
        const parsedBeatmap = parseRawOsu(rawBeatmap);

        setBeatmap(parsedBeatmap);
    };

    return (<>
        <div className={'p-4 sm:p-8 min-w-0 flex flex-col gap-8 w-full'}>
            <section className={'flex flex-col gap-4 max-w-screen-lg'}>
                <p className={'text-2xl'}>
                    This is <strong>manianalytics</strong>, a tool to analyze osu!mania beatmaps and replays.
                </p>

                <p className={'text-xl'}>
                    An example beatmap and replay is already loaded, feel free to change them to any beatmap/replay you like. 
                    You can find the source on <a href={'https://github.com/fs-c/manianalytics'} className={'underline'}>github</a>. 
                    If you have feedback, either <a href={'https://github.com/fs-c/manianalytics/issues'} className={'underline'}>open an issue</a> or 
                    message me on <a href={'https://discordapp.com/users/151759959997153281'} className={'underline'}>discord</a>.
                </p>
            </section>

            <div className={'flex flex-col gap-8 p-4 rounded-md bg-gray-900/50 drop-shadow-lg'}>
                {beatmap ? (<>
                    <div className={'flex flex-row justify-between items-start'}>
                        <h2 className={'font-semibold'}>
                            <span className={'text-gray-300 font-semibold mr-2 tracking-widest uppercase'}>
                                Beatmap
                            </span><br/>
                            <span className={'text-xl'}>{getBeatmapName(beatmap)}</span>
                        </h2>

                        <button className={'text-gray-200 px-2 py-1 border border-gray-400 rounded-md'} onClick={changeBeatmap}>
                            Change
                        </button>
                    </div>

                    <BeatmapDensityVisualisation beatmap={beatmap} />

                    <BeatmapDensityVisualisation beatmap={beatmap} facet={true} />
                </>) : (<>
                    <p className={'text-gray-400'}>
                        No beatmap selected, nothing to display.
                    </p>
                </>)}
            </div>

            <div className={'grid grid-cols-2 gap-8'}>
                {beatmap && replays.map((replay) => (<Fragment key={replay.replayHash}>
                    <div className={'flex flex-col gap-8 p-4 rounded-md bg-gray-900 drop-shadow-lg'}>
                        <div className={'flex flex-row justify-between items-start'}>
                            <h2 className={'font-semibold'}>
                                <span className={'text-gray-300 font-semibold mr-2 tracking-widest uppercase'}>
                                    Replay
                                </span><br/>
                                <span className={'text-xl'}>{getReplayName(replay)}</span>
                            </h2>

                            <button className={'text-gray-300 px-2 py-1 border border-gray-500 rounded-md'} onClick={() => removeReplay(replay)}>
                                Remove
                            </button>
                        </div>

                        <ReplayEventsVisualisation replay={replay} beatmap={beatmap} />

                        <ReplayErrorVisualisation replay={replay} beatmap={beatmap} />

                        <TapTimeVisualization replay={replay} />
                    </div>
                </Fragment>))}

                <FileInput className={'flex flex-col min-h-[200px] gap-8 p-4 rounded-md border border-dashed border-gray-500 items-center justify-center'}
                    onFile={addReplay}
                >
                    <span className={'text-gray-300'}>Add Replay</span>
                </FileInput>
            </div>
        </div>
    </>);
};

export default Home;
