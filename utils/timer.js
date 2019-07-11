const humanInterval = require("human-interval");

var repeatingJobs = [];
var oneTimeJobs = [];

function every(name, interval, fn) {
    repeatingJobs.push({
        name,
        interval: humanInterval(interval),
        callback: fn,
        intervalId: null
    });
}

function delayed(name, delay, fn) {
    oneTimeJobs.push({
        name,
        interval: humanInterval(delay),
        callback: fn,
        intervalId: null // that will never be not-null
    })
}

function start() {
    every("main timer loop", "one second", function () {
        for (var job of oneTimeJobs) {
            setTimeout(job.callback, job.interval);
        }

        oneTimeJobs = [];
    });

    for (var job of repeatingJobs) {
        job.intervalId = setInterval(job.callback, job.interval);
    }
}

function stopRepeating(name) {
    for (var job of repeatingJobs) {
        if (job.name === name && job.intervalId !== null)
            clearInterval(job.intervalId);
    }

    repeatingJobs = repeatingJobs.filter(function (value) {
        return value.name !== name;
    });
}

module.exports = {
    every,
    delayed,
    start,
    stopRepeating
};