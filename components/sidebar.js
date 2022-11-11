import { readFile, parseRawOsu } from 'src/beatmapParsing'

const FileInput = ({ onFile, children, ...props }) => {
    const handleInput = async ({ target }) => {
        if (target.files.length > 1) {
            console.warn('multiple files selected, ignoring all but the first');
        }

        const file = target.files[0];

        if (!file) {
            console.error('could not get file');

            return;
        }

        const raw = await readFile(file);

        if (!raw) {
            console.error('could not read file');

            return;
        }

        onFile(raw);
    };

    return (<>
        <label className={'flex items-center justify-center cursor-pointer px-2 py-1 border border-gray-500 rounded-md'}>
            {children}

            <input type={'file'} className={'hidden'} onInput={handleInput} {...props} />
        </label>
    </>);
};

export const Sidebar = ({ onBeatmapSelected }) => {
    const handleBeatmapSelected = (raw) => {
        onBeatmapSelected(parseRawOsu(raw));
    };

    return (<>
        <h1 className={'font-bold'}>
            <span className={'text-gray-400 font-normal'}>fsoc / </span>
            manianalytics
        </h1>

        <div className={'pt-4'}>
            <FileInput onFile={handleBeatmapSelected}>
                Choose beatmap
            </FileInput>
        </div>
    </>);
};