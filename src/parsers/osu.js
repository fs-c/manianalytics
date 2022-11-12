const parseKeyValueLines = (lines) => {
    const obj = {};

    for (const line of lines) {
        const s = line.split(':');

        if (!s[0])
            continue;

        obj[s[0].trim().toLowerCase()] = s[1].trim();
    }

    return obj;
};

const parseManiaHitObjectLines = (columnCount, lines) => {
    const events = [];
    // Time in ms that a single keypress event lasts, this is completely arbitrary
    const keyPressTime = 50;

    let columns = 0;

    for (const line of lines) {
        const fields = line.split(',');

        const x = Number(fields[0]);
        const startTime = Number(fields[2]);
        const isHold = (fields[3] & 128) ? true : false;
        const endTime = isHold ? Number(fields[5].split(':')[0]) : startTime + keyPressTime;

        const column = Math.min(
            Math.max(Math.floor(x * columnCount / 512), 0),
            columnCount - 1
        );

        if (startTime === NaN || endTime === NaN || !endTime) {
            continue;
        }

        if (column > columns) {
            columns = column;
        }

        events.push({ startTime, endTime, column });
    }

    return {
        events: events.sort((a, b) => a.startTime - b.startTime),
        // add one because columns is the highest encountered column starting from 0
        columns: columns + 1,
    };
};

export const parseRawOsu = (raw) => {
    const beatmap = {};

    const rawSections = raw.split('\r\n\r\n');

    beatmap.formatVersion = Number(rawSections.splice(0, 1)[0].slice(17));

    for (const rawSection of rawSections) {
        const lines = rawSection.split('\r\n');
        for (let i = 0; !lines[i].length; i++)
            lines.splice(i, 1);

        const name = lines.splice(0, 1)[0].slice(1, -1);

        if (!name.length)
            continue;
        
        beatmap[name.toLowerCase()] = (() => {
            const keyValueSections = [ 'General', 'Editor', 'Metadata', 'Difficulty' ];
            if (keyValueSections.includes(name))
                return parseKeyValueLines(lines);

            if (name === 'HitObjects') {
                const parsedHitObjects = parseManiaHitObjectLines(beatmap.difficulty.circlesize, lines);

                beatmap.columns = parsedHitObjects.columns;

                return parsedHitObjects.events;
            }
        })();
    }

    beatmap.events = beatmap.hitobjects;

    return beatmap;
};
