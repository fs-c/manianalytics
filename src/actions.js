const eventsToActions = (events) => events
    .map((e) => [ { time: e.startTime, column: e.column },
        { time: e.endTime, column: e.column } ])
    .flat().sort((a, b) => a.time - b.time);

exports.eventsToActions = eventsToActions;

const actionsToChunks = (actions, timeFrame = 1000) => {
    const chunks = [];

    const chunksNeeded = Math.floor(actions[actions.length - 1].time / timeFrame);

    console.log('will need', chunksNeeded, 'chunks');

    for (let chunk_i = 0; chunk_i < chunksNeeded; chunk_i++) {
        chunks.push([]);

        for (let action_i = 0; action_i < actions.length; action_i++) {
            const action = actions[action_i];

            if (action.time >= timeFrame * chunk_i && action.time <= timeFrame * (chunk_i + 1)) {
                chunks[chunk_i].push(action);
            }
        }
    }

    return chunks;
};

exports.actionsToChunks = actionsToChunks;

const getActionsOffsets = (actions, targetActions) => {
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

exports.getActionsOffsets = getActionsOffsets;
