import { readFile } from 'src/utils';

export const FileInput = ({ onFile, children, asString, ...props }) => {
    const handleInput = async ({ target }) => {
        if (target.files.length > 1) {
            console.warn('multiple files selected, ignoring all but the first');
        }

        const file = target.files[0];

        if (!file) {
            console.error('could not get file');

            return;
        }

        const raw = await readFile(file, asString);

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
