import { parseRawOsu } from 'src/parsers/osu';
import { parseRawOsr } from 'src/parsers/osr';
import { FileInput } from 'components/fileinput';

export const Sidebar = ({ onBeatmapSelected, onReplayAdded }) => {
    const handleBeatmapSelected = (raw) => {
        onBeatmapSelected(parseRawOsu(raw));
    };

    const handleReplayAdded = (raw) => {
        onReplayAdded(parseRawOsr(raw));
    };

    return (<>
        <h1 className={'font-bold'}>
            <span className={'text-gray-400 font-normal'}>fsoc / </span>
            manianalytics
        </h1>

        <div className={'pt-4'}>
            <FileInput onFile={handleBeatmapSelected} accept={'.osu'} asString={true}>
                Choose beatmap
            </FileInput>
        </div>

        <div className={'pt-4'}>
            <FileInput onFile={handleReplayAdded}  accept={'.osr'}>
                Add replay
            </FileInput>
        </div>
    </>);
};