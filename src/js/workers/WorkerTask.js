const WorkersList = [];

export const getWorkerEventsBetween = (params) => {

    return new Promise((resolve) => {

        if (WorkersList[params.threadIndex] instanceof Worker) {
            WorkersList[params.threadIndex].terminate();
        }

        const workerPath = `${STEC_VARIABLES.workers_url}events.js?ver${STEC_VARIABLES.version}`;

        WorkersList[params.threadIndex] = new Worker(workerPath);

        if (typeof window.stecFilterGetWorkerEventsBetween === 'function') {
            params.stecFilterGetWorkerEventsBetween = `return ${window.stecFilterGetWorkerEventsBetween.toString()};`;
        }

        WorkersList[params.threadIndex].postMessage({
            task: 'getEventsBetween',
            params: params,
            depScripts: [
                STEC_VARIABLES.moment_url,
                STEC_VARIABLES.moment_tz_url,
                STEC_VARIABLES.rrule_url]
        });

        WorkersList[params.threadIndex].onmessage = (e) => {

            WorkersList[params.threadIndex].terminate();

            return resolve(e.data);
        };

    });

}

export const getWorkerEventsFilters = (params) => {

    return new Promise((resolve) => {

        if (WorkersList[params.threadIndex] instanceof Worker) {
            WorkersList[params.threadIndex].terminate();
        }

        const workerPath = `${STEC_VARIABLES.workers_url}events.js?ver${STEC_VARIABLES.version}`;

        WorkersList[params.threadIndex] = new Worker(workerPath);

        WorkersList[params.threadIndex].postMessage({
            task: 'getEventsFilters',
            params: params,
            depScripts: []
        });

        WorkersList[params.threadIndex].onmessage = (e) => {

            WorkersList[params.threadIndex].terminate();

            return resolve(e.data);
        };

    });

}

export const getWorkerEventsSearchByText = (params) => {

    return new Promise((resolve) => {

        if (WorkersList[params.threadIndex] instanceof Worker) {
            WorkersList[params.threadIndex].terminate();
        }

        const workerPath = `${STEC_VARIABLES.workers_url}events.js?ver${STEC_VARIABLES.version}`;

        WorkersList[params.threadIndex] = new Worker(workerPath);

        WorkersList[params.threadIndex].postMessage({
            task: 'getWorkerEventsSearchByText',
            params: params,
            depScripts: [
                STEC_VARIABLES.moment_url,
                STEC_VARIABLES.moment_tz_url,
                STEC_VARIABLES.rrule_url
            ]
        });

        WorkersList[params.threadIndex].onmessage = (e) => {

            WorkersList[params.threadIndex].terminate();
            return resolve(e.data);
        };
    });
}

