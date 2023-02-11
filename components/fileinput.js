import { readFile } from 'src/utils';

export const FileInput = ({ onFile, children, asString, className, ...props }) => {
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
        <label className={className}>
            {children}

            <input type={'file'} className={'hidden'} onInput={handleInput} {...props} />
        </label>
    </>);
};
