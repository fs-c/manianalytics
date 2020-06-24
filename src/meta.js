const replayPar = document.getElementById('replay-information');
const beatmapPar = document.getElementById('beatmap-information');

const addReplay = (replay, offsets) => {
    replayPar.innerHTML = `Replay <code>${replay.replayHash.slice(0, 7)}</code> `
        + `by ${replay.playerName || 'anon'} with total score of `
        + `${replay.totalScore}.`;

    if (!offsets)
        return;

    const actual = [ ...offsets.negative.map((e) => -(e.offset)),
        ...offsets.positive.map((e) => e.offset) ];

    const average = actual.reduce((acc, cur) => acc += cur, 0) / actual.length;
    const median = actual.sort((a, b) => a - b)[Math.floor(actual.length / 2)];

    replayPar.innerHTML += ` The median offset was ${median}ms (avg. ${average.toFixed(2)}ms).`;
};

exports.addReplay = addReplay;

const addBeatmap = (beatmap) => {

};

exports.addBeatmap = addBeatmap;
