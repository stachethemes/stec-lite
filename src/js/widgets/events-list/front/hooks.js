import { sortEventsByFeatured } from '@Stec/JS/helpers';
import { usePostItemsAll } from '@Stec/JS/hooks';
import { getWorkerEventsBetween } from '@Stec/JS/workers/WorkerTask';
import { useEffect, useState } from 'react';

export const useEventsPrefetch = (widgetParams) => {

    const [ready, setReady] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const props = { ...widgetParams };

    useEffect(() => {

        const getEventsInRange = async () => {

            const minDate = props.min_date === 'custom' ? props.min_date_custom : props.min_date;
            const maxDate = props.max_date === 'custom' ? props.max_date_custom : props.max_date;

            const events = await getWorkerEventsBetween({
                startRange: minDate,
                endRange: maxDate,
                minDate: minDate,
                limit: props.limit || 6,
                order: props.order || 'asc',
                filters: {},
                threadIndex: props.id,
                events: window.stecPrefetchedEvents[props.prefetched_events_hash]
            });

            const sortedEvents = sortEventsByFeatured(events);

            setEvents(sortedEvents);
            setReady(true);
        }

        if (!ready && !error) {

            if (typeof window.stecPrefetchedEvents !== 'object' || !window.stecPrefetchedEvents[props.prefetched_events_hash]) {
                setError(true);
                setReady(true);
                setEvents([]);
                return;
            }

            getEventsInRange();

        }

    }, [error, props.id, props.limit, props.max_date, props.max_date_custom, props.min_date, props.min_date_custom, props.order, props.prefetched_events_hash, ready]);


    return {
        items: events,
        ready: ready,
        error: error
    }

}

export const useEvents = (widgetParams) => {

    const [ready, setReady] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const props = { ...widgetParams };

    const taxPropNames = {
        stec_cal: 'calendar',
        stec_cat: 'category',
        stec_loc: 'location',
        stec_org: 'organizer',
        stec_gst: 'guest'
    };

    const taxFilters = Object.keys(taxPropNames)
        .filter(tax => props[tax])
        .reduce((acc, tax) => {
            acc[taxPropNames[tax]] = props[tax];
            return acc;
        }, {});

    const queryParams = {
        minDate: props.min_date === 'custom' ? props.min_date_custom : props.min_date,
        maxDate: props.max_date === 'custom' ? props.max_date_custom : props.max_date,
        featured: props.featured_only ? 1 : 0,
        eventStatus: props.event_status,
        author: props.author,
        include: props.include,
        ...taxFilters
    }

    const { items, ready: queryReady, error: queryError } = usePostItemsAll({
        post_type: 'stec_event',
        perPage: props.per_page || 100,
        context: 'event',
        permissionType: 'read_permission',
        ...queryParams
    });

    useEffect(() => {

        const getEventsInRange = async () => {

            const minDate = props.min_date === 'custom' ? props.min_date_custom : props.min_date;
            const maxDate = props.max_date === 'custom' ? props.max_date_custom : props.max_date;

            const events = await getWorkerEventsBetween({
                startRange: minDate,
                endRange: maxDate,
                minDate: minDate,
                limit: props.limit || 6,
                order: props.order || 'asc',
                filters: {},
                threadIndex: props.id,
                events: items
            });

            const sortedEvents = sortEventsByFeatured(events);

            setEvents(sortedEvents);
            setReady(true);
        }

        if (!queryError && queryReady) {

            if (items.length){
                getEventsInRange();
            } else {
                setReady(true);
            }

        }

        if (queryError) {
            setError(true);
            setReady(true);
            setEvents([]);
        }

    }, [items, queryError, props.limit, props.max_date, props.max_date_custom, props.min_date, props.min_date_custom, queryReady, props.id, props.order]);

    return {
        items: events,
        ready: ready,
        error: error
    }
}