export const readFile = (file, asString) => new Promise((resolve, reject) => {
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

    if (asString) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
});

export const getBeatmapName = (beatmap) => {
    const metadata = beatmap?.metadata;

    return `${metadata.artist} - ${metadata.title} (${metadata.version})`;
};

export const getReplayName = (replay) => {
    return `${replay.playerName || 'anon'} (${replay.replayHash.slice(0, 8)})`;
};

export const eventsToActions = (events) => {
    const actions = [];

    for (const event of events) {
        actions.push({ time: event.startTime, key: event.column });
        actions.push({ time: event.endTime, key: event.column });
    }

    return actions;
};

export const getActionsOffsets = (actions, targetActions) => {
    const leeway = 250;

    const negativeOffsets = [];
    const positiveOffsets = [];
    const absoluteOffsets = [];

    for (const action of actions) {
        if (action.time < 0)
            continue;

        const potentialTargets = targetActions.filter((a) =>
            a.column === action.column && a.time - leeway < action.time
            && action.time < a.time + leeway);

        if (!potentialTargets.length) {
            console.warn('found no potential targets for', action)

            continue;
        }

        let bestMatch;
        let bestDiff = Infinity;
        for (const target of potentialTargets) {
            const targetDiff = Math.abs(target.time - action.time);
            if (targetDiff < bestDiff) {
                bestMatch = target;
                bestDiff = targetDiff;
            }
        }

        absoluteOffsets.push({ time: action.time, offset: bestDiff });

        if ((bestMatch.time - action.time) < 0) {
            negativeOffsets.push({ time: action.time, offset: bestDiff });
        } else {
            positiveOffsets.push({ time: action.time, offset: bestDiff });
        }
    }

    return { absolute: absoluteOffsets, negative: negativeOffsets,
        positive: positiveOffsets };
};
