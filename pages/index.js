import Head from 'next/head';
import { useRef } from 'react';

import { Flex, FileInput } from '../components/utils';

const Home = () => {
    const replayFileRef = useRef(null);
    const beatmapFileRef = useRef(null);

    return (<>
        <Head>
            <title>osu!mania analytics</title>
        </Head>

        <Flex row>
            <Flex column style={{ marginLeft: '1em', marginRight: '1em' }}>
                <h2>osu!mania analytics</h2>

                <form>
                    <FileInput description="Beatmap to analyze" fileType=".osu"
                        ref={beatmapFileRef} />

                    <FileInput description="Replay to analyze" fileType=".osr"
                        ref={replayFileRef} />
                </form>
            </Flex>

            <Flex column grow={4}>
                <p>Some other content</p>
            </Flex>
        </Flex>

        <style jsx global>{`
            body {
                margin: 0;
                font-family: sans-serif;
            }
        `}</style>
    </>);
};

export default Home;
