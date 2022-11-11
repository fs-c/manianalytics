import { useState } from 'react';

import { Sidebar } from 'components/sidebar';
import { BeatmapDensityVisualisation } from 'components/beatmap/density';

import exampleBeatmap from 'src/exampleBeatmap';
import { getBeatmapName } from 'src/utils';

const Home = () => {
    const [ beatmap, setBeatmap ] = useState();
    const [ replay, setReplay ] = useState();

    if (!beatmap) {
        setBeatmap(exampleBeatmap);
    }

    return (<>
        <div className={'flex flex-col md:flex-row min-h-screen'}>
            <div className={'min-w-max p-4 bg-gray-900 shadow-md'}>
                <Sidebar onBeatmapSelected={setBeatmap}
                    onReplaySelected={setReplay} />
            </div>

            <div className={'p-4 min-w-0 flex flex-col gap-8 w-full'}>
                {beatmap ? (<>
                    <h2 className={'font-semibold'}>
                        <span className={'text-gray-300 font-normal mr-2'}>
                            Beatmap
                        </span> {getBeatmapName(beatmap)}
                    </h2>

                    <BeatmapDensityVisualisation beatmap={beatmap} />   
                </>) : (<>
                    <p className={'text-gray-400'}>
                        No beatmap selected, nothing to display.
                    </p>
                </>)}
            </div>
        </div>
    </>);
};

export default Home;
