const { onColorSchemeChange } = require('./utils');
const { eventsToActions, actionsToChunks } = require('./actions');

const Chart = require('chart.js');
const graph = new Chart('beatmap-graph', {
    type: 'line',
    data: {
        datasets: [],
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'density',
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            }, {
                id: 'offset',
                position: 'right',
            }],
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            }],
        },
    },
});

const addActionsDensity = (events, label, color) => {
    const chunks = actionsToChunks(eventsToActions(events));

    graph.data.datasets.push({
        yAxisID: 'density',
        pointRadius: 0,
        pointHitRadius: 4,
        label,
        backgroundColor: `rgba(${color},0.2)`,
        borderColor: `rgba(${color},1)`,
        borderWidth: 2,
        data: chunks.map((c, i) => ({ x: i, y: c.length })),
    });

    graph.update();
};

exports.addActionsDensity = addActionsDensity;

// Abusing the actionsToChunks function but whatever
const offsetsToChunks = (offsets) => actionsToChunks(offsets)
    .map((e) => e.reduce((acc, cur) => acc += cur.offset, 0));

const addEventsOffset = (offsets, label, colors) => {
    for (const type in offsets) {
        const chunks = offsetsToChunks(offsets[type])

        graph.data.datasets.push({
            yAxisID: 'offset',
            pointRadius: 0,
            pointHitRadius: 4,
            label: `${label} (${type})`,
            backgroundColor: `rgba(${colors[type]},0.2)`,
            borderColor: `rgba(${colors[type]},1)`,
            borderWidth: 2,
            data: chunks.map((c, i) => ({ x: i, y: c })),
        });
    }

    graph.update();
};

exports.addEventsOffset = addEventsOffset;
