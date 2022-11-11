export const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        resolve(reader.result);
    });

    reader.addEventListener('error', () => {
        console.error('failed reading file', file);

        reject(reader.error);
    });

    reader.addEventListener('progress', ({ loaded }) => {
        console.log(`${loaded} bytes transferred`);
    });

    reader.readAsText(file);
});

export const getBeatmapName = (beatmap) => {
    const metadata = beatmap?.metadata;

    return `${metadata.artist} - ${metadata.title} (${metadata.version})`;
};
