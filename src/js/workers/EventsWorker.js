function EventsWorker(params) {
    this.params = params;
}

EventsWorker.prototype._getUtcOffsetInHours = function (event) {
    const initialStartMomentUtc = moment.utc(event.initial_start_date_utc);
    const initialStartMoment = moment.utc(event.meta.start_date);
    const utcOffsetInHours = initialStartMoment.diff(initialStartMomentUtc, 'minutes') / 60;
    return utcOffsetInHours;
}

EventsWorker.prototype._ensureInitialDates = function (event) {

    if (event.initial_start_date) {
        event.meta.start_date = event.initial_start_date;
        event.meta.end_date = event.initial_end_date;
        event.meta.start_date_utc = event.initial_start_date_utc;
        event.meta.end_date_utc = event.initial_end_date_utc;
    }

    if (!event.initial_start_date) {
        event.initial_start_date = event.meta.start_date;
        event.initial_end_date = event.meta.end_date;
        event.initial_start_date_utc = event.meta.start_date_utc;
        event.initial_end_date_utc = event.meta.end_date_utc;
    }

    return event;

}

EventsWorker.prototype._getDateOccurences = function ({ event, rangeEndMoment }) {

    // eslint-disable-next-line no-undef
    const { rrulestr } = rrule;

    const eventStartDate = moment.utc(event.meta.start_date);

    let rruleString = (`DTSTART;TZID=UTC:${eventStartDate.format('YYYYMMDD\THHmmss')}\nRRULE:${event.meta.rrule}`).replace(/;(\s+)?$/, '');

    // Add EXDATE to string 
    if (Array.isArray(event.meta.exdate) && event.meta.exdate.length > 0) {

        const datesToExclude = [];
        const exTime = `${eventStartDate.format('HHmm')}00Z`;

        event.meta.exdate.forEach(dateToExclude => {

            const dateToExcludeMoment = moment.tz(dateToExclude, event.meta.timezone);

            if (dateToExcludeMoment.isValid()) {
                datesToExclude.push(`${dateToExcludeMoment.format('YYYYMMDD')}T${exTime}`);
            }
        });

        rruleString += `\nEXDATE:${datesToExclude.join(',')}`;
    }

    const rruleSet = rrulestr(rruleString);

    // We place event.meta.start_date for range start
    // since the event.meta.start_date may be before the rangeStartMoment
    let dateOccurences = rruleSet.between(moment.utc(event.meta.start_date).toDate(), rangeEndMoment.toDate(), true);

    return dateOccurences.map(date => moment.utc(date).format('YYYY-MM-DD HH:mm:ss'));

}

EventsWorker.prototype._getEventDurationInMinutes = function (event) {

    const eventInitialStartMoment = moment.utc(event.initial_start_date);
    const eventInitialEndMoment = moment.utc(event.initial_end_date);
    const initialEventDurationInMinutes = eventInitialEndMoment.diff(eventInitialStartMoment, 'minutes');

    return initialEventDurationInMinutes;
}

EventsWorker.prototype._getEventOccurences = function ({
    event,
    rangeEndMoment
}) {

    const eventOccurences = [];

    if (event.meta.rrule) {

        try {

            /**
             * Date occurences are returned in event timezone
             */
            const dateOccurences = this._getDateOccurences({
                event: event,
                rangeEndMoment: rangeEndMoment
            });

            const eventDurationInMinutes = this._getEventDurationInMinutes(event);

            for (let dtIndex in dateOccurences) {

                const recurrentEvent = JSON.parse(JSON.stringify(event));
                const dateDbFormat = 'YYYY-MM-DD\THH:mm';

                const occurenceDateString = dateOccurences[dtIndex];
                const occurenceStartMoment = moment.tz(occurenceDateString, event.meta.timezone);
                const occurenceStartMomentUtc = moment.tz(occurenceDateString, event.meta.timezone).utc();

                // calculate end date without adjusting for dst/summer time changes
                const occurenceEndDateString = moment.utc(occurenceDateString).add(eventDurationInMinutes, 'minutes').format(dateDbFormat);
                const occurenceEndMoment = moment.tz(occurenceEndDateString, event.meta.timezone);
                const occurenceEndMomentUtc = moment.tz(occurenceEndDateString, event.meta.timezone).utc();

                const repeatUtcOffset = occurenceStartMomentUtc
                    .diff(moment.utc(recurrentEvent.initial_start_date_utc), 'seconds');

                recurrentEvent.meta.start_date = occurenceStartMoment.format(dateDbFormat);
                recurrentEvent.meta.start_date_utc = occurenceStartMomentUtc.format(dateDbFormat);
                recurrentEvent.meta.end_date_utc = occurenceEndMomentUtc.format(dateDbFormat);
                recurrentEvent.meta.end_date = occurenceEndMoment.format(dateDbFormat);
                recurrentEvent.repeat_offset = repeatUtcOffset;

                eventOccurences.push(recurrentEvent);

            }

        } catch (e) {

            // Unable to process repeater for event
            eventOccurences.push(event);
        }

    } else {
        eventOccurences.push(event);
    }

    return eventOccurences;

}

/**
 * EVENTS ARE SORTED BY DATE OLDEST TO NEWEST
 * EVENTS INCLUDE .pos PROPERTY WHICH DEFINES THE EVENTS POSITION IN THE CELL (1st, 2nd etc...)
 * RANGES ARE EXPECTED TO BE CONVERTED IN UTC TIMEZONE
 */
EventsWorker.prototype.getEventsBetween = function () {

    const rangeStartMoment = moment.utc(this.params.startRange);
    const rangeEndMoment = moment.utc(this.params.endRange);
    const inRelativeTimezone = false === this.params.showInUserTimezone ? true : false;

    const eventsInRange = [];
    let returnEventsData = [];

    /**
     * STEP 1: GET EVENTS FOR GIVEN RANGE AND TEST AGAINST FILTER PARAMS
     */
    for (let i in this.params.events) {

        let prepareEvent = this.params.events[i];
        prepareEvent = JSON.parse(JSON.stringify(prepareEvent));
        prepareEvent = this._ensureInitialDates(prepareEvent);

        const event = prepareEvent;

        const eventOccurences = this._getEventOccurences({
            event: event,
            rangeEndMoment: rangeEndMoment
        });

        for (let eoIndex in eventOccurences) {

            const event = eventOccurences[eoIndex];

            const eventStartMomentUtc = moment.utc(event.meta.start_date_utc);
            const eventEndMomentUtc = moment.utc(event.meta.end_date_utc);
            const eventStartMoment = inRelativeTimezone ? moment.utc(event.meta.start_date) : moment.utc(event.meta.start_date_utc);
            const eventEndMoment = inRelativeTimezone ? moment.utc(event.meta.end_date) : moment.utc(event.meta.end_date_utc);

            const eventStartUnix = eventStartMoment.unix();
            const eventEndUnix = eventEndMoment.unix();

            const rangeStartUnix = rangeStartMoment.unix();
            const rangeEndUnix = rangeEndMoment.unix();

            if (
                // Check for event date and ranges intersection
                rangeEndUnix >= eventStartUnix && eventEndUnix >= rangeStartUnix
            ) {

                let shouldPush = true;
                const allowIntersections = this.params.minMaxIntersect;

                // Check if minDate or maxDate are present and if so, check if event is within the range
                // minDate and maxDate are expected to be in UTC time
                // so we need to compare against event's real start date in UTC (eventStartMomentUtc)

                if (shouldPush && this.params.minDate) {

                    const minDateMoment = moment.utc(this.params.minDate);

                    if (allowIntersections) {
                        if (eventEndMomentUtc.isBefore(minDateMoment)) {
                            shouldPush = false;
                        }
                    } else {
                        if (eventStartMomentUtc.isBefore(minDateMoment)) {
                            shouldPush = false;
                        }
                    }

                }

                if (shouldPush && this.params.maxDate) {

                    const maxDateMoment = moment.utc(this.params.maxDate);

                    if (allowIntersections) {
                        if (eventStartMomentUtc.isAfter(maxDateMoment)) {
                            shouldPush = false;
                        }
                    } else {
                        if (eventStartMomentUtc.isAfter(maxDateMoment)) {
                            shouldPush = false;
                        }
                    }

                }

                if (Array.isArray(this.params.filters) && this.params.filters.length > 0) {

                    for (let paramFilterKey in this.params.filters) {

                        // stop unnecessary loops if conclusion to exclude the event was already done
                        if (false === shouldPush) {
                            break;
                        }

                        const filter = this.params.filters[paramFilterKey];

                        switch (filter.id) {

                            case 'calendars': {

                                const eventCalendarId = event.calendar.id;

                                if (false === filter.items.some(item => {
                                    return item.id === eventCalendarId && true === item.active;
                                })) {
                                    shouldPush = false;
                                }

                                break;

                            }

                            case 'locations': {

                                if (!event.location || !event.location.id) {

                                    shouldPush = filter.items.some(item => item.id === 0 && item.active);

                                } else {

                                    shouldPush = filter.items.some(item => item.id === event.location.id && item.active);
                                }

                                break;
                            }

                            case 'guests':
                            case 'organizers':
                            case 'categories': {

                                // since [filter.id] matches as prop of event (e.g. event['guests]) and they are all arrays 
                                // we will save some space and unify these cases

                                const { id: filterKey } = filter;

                                if (false === Array.isArray(event[filterKey])) {
                                    break;
                                }

                                const activeFilterIdsArray = filter.items.filter(item => item.active).map(item => item.id);
                                const eventHasFilterIds = event[filterKey].some(item => activeFilterIdsArray.includes(item.id));

                                if (!eventHasFilterIds) {
                                    const noItemsFilterIsActive = activeFilterIdsArray.includes(0);
                                    const hasNoItems = !event[filterKey].length;

                                    // double negation in this case seems reasonable
                                    // we are checking if the event has no items and if the no items filter is active
                                    // if so, we will push the event, otherwise we will not
                                    if (!(noItemsFilterIsActive && hasNoItems)) {
                                        shouldPush = false;
                                    }
                                }

                                break;
                            }

                        }

                    }

                }

                // push if event passed filters test
                if (shouldPush) {
                    eventsInRange.push(event);
                }
            }
        }
    }

    if (!Array.isArray(eventsInRange) || eventsInRange.length <= 0) {
        return [];
    }

    /**
     * STEP 1.1
     * Retrieve all events with recurrence_id
     * and delete the original event on that date (recurrence_id date) from eventsInRange
     * since we will be using the event with the recurrence_id event instead
     */
    const eventsWithRecurrenceId = eventsInRange.filter(event => {
        return event.meta.recurrence_id ? true : false;
    });

    for (let eventIndex in eventsWithRecurrenceId) {

        const event = eventsWithRecurrenceId[eventIndex];
        let date = moment.utc(event.meta.recurrence_id).format('YYYYMMDD');

        // if date is 19700101, then we need to fallback to use the start_date
        if (date === '19700101') {
            date = moment.utc(event.meta.start_date).format('YYYYMMDD');
        }

        const uid = event.meta.uid;

        // delete the original event from eventsInRange using splice
        for (let i = 0; i < eventsInRange.length; i++) {

            const eventDate = moment.utc(eventsInRange[i].meta.start_date).format('YYYYMMDD');

            if (!eventsInRange[i].meta.recurrence_id && eventDate === date && eventsInRange[i].meta.uid === uid) {
                eventsInRange.splice(i, 1);
            }
        }
    }

    /**
     * STEP 2: SORT EVENTS OLDEST -> NEWEST, unless order (asc/desc) param is set
     */
    const sortedEvents = eventsInRange.sort((a, b) => {
        let mA = moment.utc(a.meta.start_date_utc);
        let mB = moment.utc(b.meta.start_date_utc);

        // Compare by date
        const dateComparison = mA.diff(mB);

        if (this.params.order === 'desc') {
            // If descending order is specified
            if (dateComparison === 0) {
                // If dates are the same, compare by ID in descending order
                return b.id - a.id;
            }
            // Sort by date in descending order
            return -dateComparison;
        } else {
            // If ascending order is specified
            if (dateComparison === 0) {
                // If dates are the same, compare by ID in ascending order
                return a.id - b.id;
            }
            // Sort by date in ascending order
            return dateComparison;
        }
    });

    /**
     * STEP 3 (CONDITIONAL)
     * STORE EVENTS IN MULTI-ARRAY BY YMD KEYS
     */
    if (true === this.params.sortEventsInYMDkeys) {

        const inRelativeTimezone = false === this.params.showInUserTimezone ? true : false;

        const eventsInDaysKeys = {};
        const dow = this.params.dow; // first day of the week 0 - 6 (Sunday to Saturday)

        // calculate start and end iterator dates
        // +/- 1 day is added to compensate for timezones offsets
        const dayIterator = inRelativeTimezone ? moment.utc(rangeStartMoment) : moment.utc(rangeStartMoment).local();
        const iteratorEndDate = inRelativeTimezone ? moment.utc(rangeEndMoment) : moment.utc(rangeEndMoment).local();

        const normalizerCount = 7;
        let normalizerIterator = 0;

        // adjust normalizerIterator if the first day event is 
        // not the same as the first day of the week
        if (dow !== dayIterator.day()) {
            const diff = (dayIterator.day() - dow + 7) % 7;
            normalizerIterator += diff;
        }

        while (dayIterator.isBefore(iteratorEndDate)) {

            const key = dayIterator.format('YYYY-MM-DD');

            eventsInDaysKeys[key] = [];

            sortedEvents.forEach(event => {

                const eventMomentStart = inRelativeTimezone ? moment.utc(event.meta.start_date) : moment.utc(event.meta.start_date_utc).local();
                const eventMomentEnd = inRelativeTimezone ? moment.utc(event.meta.end_date) : moment.utc(event.meta.end_date_utc).local();

                event.local_start = eventMomentStart.format('DD,MMM HH:mm');
                event.local_end = eventMomentEnd.format('DD,MMM HH:mm');

                const shouldAddEvent = dayIterator.isBetween(eventMomentStart, eventMomentEnd, 'day', '[]');

                if (shouldAddEvent) {

                    if (normalizerIterator % normalizerCount === 0) {
                        event.pos = undefined;
                    }

                    // If event does not have assigned position yet, assign it
                    if (typeof event.pos === 'undefined') {

                        const lastEventInKey = eventsInDaysKeys[key][eventsInDaysKeys[key].length - 1];

                        if (typeof lastEventInKey?.pos !== 'undefined') {

                            const takenPositions = eventsInDaysKeys[key].map(event => event.pos);
                            let availablePosition = 0;

                            while (takenPositions.includes(availablePosition)) {
                                availablePosition++;
                            }

                            event.pos = availablePosition;

                        } else {
                            event.pos = 0;
                        }
                    }

                    eventsInDaysKeys[key].push({ ...event });

                }

            });

            normalizerIterator++;
            dayIterator.add(1, 'day');
        }

        // Sort events by pos
        for (let key in eventsInDaysKeys) {
            eventsInDaysKeys[key].sort((a, b) => {
                return a.pos - b.pos;
            });
        }

        returnEventsData = eventsInDaysKeys;

    } else {

        returnEventsData = sortedEvents;
    }

    // finally check if limit param is set
    if (this.params.limit) {
        returnEventsData = returnEventsData.slice(0, this.params.limit);
    }

    if (typeof this.params.stecFilterGetWorkerEventsBetween !== 'undefined') {

        try {

            const stecFilterGetWorkerEventsBetween = new Function(this.params.stecFilterGetWorkerEventsBetween)();

            returnEventsData = stecFilterGetWorkerEventsBetween(returnEventsData, this.params)

        } catch (e) {

            // silent error

        }

    }

    return returnEventsData;

};

/**
 *  Obtain top menu filters from the available events stored in prop
 */
EventsWorker.prototype.getEventsFilters = function () {

    const events = this.params.events;

    if (false === Array.isArray(events) || events.length <= 0) {
        return [];
    }

    events.forEach(event => {

        for (let filterKey in this.params.filters) {

            const filter = this.params.filters[filterKey];

            switch (filter.id) {

                case 'calendars': {

                    if (!event.calendar) {
                        break;
                    }

                    if (false === filter.items.some(item => item.id === event.calendar.id)) {
                        filter.items.push({
                            id: event.calendar.id,
                            label: event.calendar.title,
                            color: event.calendar.color,
                            timezone: event.calendar.timezone,
                            active: true
                        });
                    }

                    break;

                }

                case 'categories': {

                    if (false === Array.isArray(event.categories) || event.categories.length <= 0) {
                        break;
                    }

                    event.categories.forEach(category => {

                        if (false === filter.items.some(item => item.id === category.id)) {
                            filter.items.push({
                                id: category.id,
                                label: category.title,
                                color: category.color,
                                active: filter.defaultActiveValue
                            });
                        }

                    });

                    break;

                }

                case 'locations': {

                    if (!event.location) {
                        break;
                    }

                    if (false === filter.items.some(item => item.id === event.location.id)) {
                        filter.items.push({
                            id: event.location.id,
                            label: event.location.title,
                            color: event.location.color,
                            active: true
                        });
                    }


                    break;
                }

                case 'organizers': {

                    if (false === Array.isArray(event.organizers) || event.organizers.length <= 0) {
                        break;
                    }

                    event.organizers.forEach(organizer => {

                        if (false === filter.items.some(item => item.id === organizer.id)) {
                            filter.items.push({
                                id: organizer.id,
                                label: organizer.title,
                                color: organizer.color,
                                active: true
                            });
                        }

                    });

                    break;

                }

                case 'guests': {

                    if (false === Array.isArray(event.guests) || event.guests.length <= 0) {
                        break;
                    }

                    event.guests.forEach(guest => {

                        if (false === filter.items.some(item => item.id === guest.id)) {
                            filter.items.push({
                                id: guest.id,
                                label: guest.title,
                                color: guest.color,
                                active: true
                            });
                        }

                    });

                    break;

                }

            }
        }
    });

    // sort filters by label
    this.params.filters.forEach(filter => {
        filter.items.sort((a, b) => {
            if (a.id === 0) return -1;
            if (b.id === 0) return 1;
            return a.label.localeCompare(b.label);
        });
    });

    return this.params.filters;

}


/**
 * Retrieve events by search text. 
 * Used primary for event attendance available dates
 * WARNING:: TREAT EVERYTHING AS IN UTC TIMEZONE !!!
 */
EventsWorker.prototype.getWorkerEventsSearchByText = function () {

    const resultsLimit = 10;
    const searchText = this.params.searchText;
    const events = this.params.events; // events to search from. recurres are not processed here
    const found = [];

    for (let eventKey in events) {

        if (found.length >= resultsLimit) {
            break;
        }

        const event = events[eventKey];

        const eventRelevantWords = [
            event.title
        ];

        if (event.calendar && event.calendar.title) {
            eventRelevantWords.push(event.calendar.title);
        }

        if (event.location && event.location.title) {
            eventRelevantWords.push(event.location.title);
        }

        if (Array.isArray(event.categories) && event.categories.length > 0) {
            event.categories.forEach(item => {
                eventRelevantWords.push(item.title);
            });
        }

        if (Array.isArray(event.organizers) && event.organizers.length > 0) {
            event.organizers.forEach(item => {
                eventRelevantWords.push(item.title);
            });
        }

        if (Array.isArray(event.guests) && event.guests.length > 0) {
            event.guests.forEach(item => {
                eventRelevantWords.push(item.title);
            });
        }

        // convert all eventRelevantWords to lowercase
        eventRelevantWords.forEach((item, index) => {
            eventRelevantWords[index] = item.toString().toLowerCase();
        });

        const searchTextLower = searchText.toLowerCase();

        if (eventRelevantWords.some(word => word.toLowerCase().includes(searchTextLower))) {
            found.push(event);
        }

    }

    /**
     * If we have a range, get events between the range
     * otherwise return found events without processing recurrences
     */
    if (found.length > 0 && this.params.startRange && this.params.endRange) {

        // update params events with the found events
        this.params.events = found;

        return this.getEventsBetween();

    }

    return found;

};



onmessage = (e) => {

    if (e.data.depScripts && Array.isArray(e.data.depScripts)) {
        e.data.depScripts.forEach((script) => {
            // eslint-disable-next-line no-undef
            importScripts(script);
        });
    }

    switch (e.data.task) {

        case 'getEventsBetween': {

            const params = e.data.params;
            const task = new EventsWorker(params);
            const result = task.getEventsBetween();

            postMessage(result);

            break;
        }

        case 'getEventsFilters': {

            const params = e.data.params;
            const task = new EventsWorker(params);
            const result = task.getEventsFilters();

            postMessage(result);

            break;
        }

        case 'getWorkerEventsSearchByText': {

            const params = e.data.params;
            const task = new EventsWorker(params);
            const result = task.getWorkerEventsSearchByText();

            postMessage(result);

            break;
        }

        default:
            postMessage('');

    }
};
