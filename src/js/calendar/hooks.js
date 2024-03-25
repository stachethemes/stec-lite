import {
    agendaSliderKey, calendarEvents, calendarLayout,
    calendarMoment,
    calendarScreenType, calendarTopFilters, settingsAtts
} from '@Stec/JS/calendar/atoms';
import { eventLayoutTemplate } from '@Stec/JS/default-builder-templates';
import { getFirstDayOfMonthInView, getFirstDayOfWeekInView, getMediaSizes, sortEventsByFeatured } from '@Stec/JS/helpers';
import { usePostItemsAll } from '@Stec/JS/hooks';
import { getWorkerEventsBetween, getWorkerEventsFilters, getWorkerEventsSearchByText } from '@Stec/JS/workers/WorkerTask';
import { Loader as googleMapsLoader } from "@googlemaps/js-api-loader";
import { __ } from '@wordpress/i18n';
import { isNumber } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { getPluginUrl } from '@Stec/JS/helpers';

export const useCalendarScreenType = (ref) => {

    const [value, setValue] = useRecoilState(calendarScreenType)

    useEffect(() => {

        const container = ref.current;
        let t;

        const setScreenType = (containerWidth) => {

            clearTimeout(t);

            t = setTimeout(() => {

                const { mobile: mobileSize, tablet: tabletSize } = getMediaSizes();

                let type = '';

                if (containerWidth < mobileSize) {
                    type = 'mobile';
                } else if (containerWidth < tabletSize) {
                    type = 'tablet'
                }

                setValue(type);

            }, 100);

        }

        const observer = new ResizeObserver(entries => {

            if (entries[0] && entries[0].contentRect) {
                const containerWidth = entries[0].contentRect.width;
                setScreenType(containerWidth);
            }

        });

        if (container) {
            observer.observe(container);
        }

        return () => {

            clearTimeout(t);

            if (container) {
                observer.unobserve(container);
            }
        }

    }, [ref, setValue]);

    return value;
}

export const useCalendarScreenTypeValue = () => {
    return useRecoilValue(calendarScreenType);
}

export const useSettingsAtts = () => {
    const [value, setValue] = useRecoilState(settingsAtts);
    return { value, setValue };
}

export const useSettingsAtt = (att) => {
    const value = useRecoilValue(settingsAtts);
    return value[att];
}

/**
 * Retrieve active calendar date in moment object
 * 
 * Expects moment date for setter value
 * 
 * NB: safeValue makes sure the returned moment
 * is new instance and won't interfere with the atom value
 */
export const useCalendarMoment = () => {

    const [value, setValue] = useRecoilState(calendarMoment);

    const safeValue = moment(value);

    return { value, safeValue: safeValue, setValue };
}

/**
 *  Retrieve active layout 
 */
export const useCurrentLayout = () => {

    const [value, setValue] = useRecoilState(calendarLayout);

    return { value, setValue };
}

export const useAvailableLayouts = () => {

    const attsLayouts = useSettingsAtt('calendar__layouts');

    const attsLayoutsArray = attsLayouts.split(',');

    const layouts = [
        {
            id: 'agenda',
            label: __('Agenda', 'stachethemes_event_calendar_lite'),
        },
        {
            id: 'month',
            label: __('Month', 'stachethemes_event_calendar_lite')
        },
        {
            id: 'week',
            label: __('Week', 'stachethemes_event_calendar_lite')
        },
        {
            id: 'day',
            label: __('Day', 'stachethemes_event_calendar_lite')
        },
        {
            id: 'grid',
            label: __('Grid', 'stachethemes_event_calendar_lite')
        },
        {
            id: 'boxgrid',
            label: __('Box grid', 'stachethemes_event_calendar_lite')
        }
    ];

    return layouts.filter(layout => attsLayoutsArray.includes(layout.id));
}

/**
 * Search for events by text
 */
export const useSearchEventsByText = (props) => {

    const [data, setData] = useState({
        ready: false,
        items: [],
        error: false
    });

    const { searchText, events, startRange, endRange, threadIndex } = props;

    useEffect(() => {

        const getEvents = async () => {

            const results = await getWorkerEventsSearchByText({
                searchText: searchText,
                events: events,
                startRange: startRange,
                endRange: endRange,
                threadIndex: threadIndex,
            });

            setData({
                ready: true,
                items: results,
                error: false
            });
        }

        if (searchText.length > 3) {

            setData({
                ready: false,
                items: [],
                error: false
            });

            getEvents();
        }

    }, [searchText, events, threadIndex, startRange, endRange]);

    return { items: data.items, ready: data.ready, error: data.error };

}

export const useCalendarEvents = () => {

    const [data, setData] = useRecoilState(calendarEvents);

    const setValue = (events) => {
        setData({
            error: false,
            ready: true,
            items: events
        });
    }

    const value = data.items || [];

    return { value, setValue };
}

/**
 * Fetch all events
 */
export const useFetchCalendarEvents = (props = {}) => {

    const [events, setEvents] = useRecoilState(calendarEvents);
    let eventsPerRequest = useSettingsAtt('misc__events_per_request');

    if (isNumber(eventsPerRequest) === false || parseInt(eventsPerRequest, 10) <= 0) {
        eventsPerRequest = 100;
    }

    const queryResult = usePostItemsAll({
        post_type: 'stec_event',
        perPage: eventsPerRequest,
        context: 'event',
        ...props
    });

    useEffect(() => {

        if (true === queryResult.ready && queryResult.error === false) {
            if (events.ready === false) {
                setEvents(queryResult);
            }
        }
    });

    return events;

};

export const useShouldReverseOrder = () => {

    const { value: calendarAtts } = useSettingsAtts();
    const view = useRecoilValue(calendarLayout);

    switch (view) {
        case 'agenda': {
            return calendarAtts.layouts__agenda_list_reverse_order || false;
        }

        case 'grid': {
            return calendarAtts.layouts__grid_reverse_order || false;
        }

        case 'boxgrid': {
            return calendarAtts.layouts__boxgrid_reverse_order || false;
        }

        default:
            return false;
    }

}

/**
 * Obtains events for given layout and layout range
 * @uses useEventsInRange
 * @param object settings The calendar settings
 * @returns array [events, ready] [array, boolean]
 */
export const useLayoutEvents = (params = {}) => {

    const minMaxIntersect = useSettingsAtt('filter__minmax_intersect');
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const dowOffset = useSettingsAtt('calendar__dow');
    const { value: calendarAtts } = useSettingsAtts();
    const { items: events } = useRecoilValue(calendarEvents);
    const view = useRecoilValue(calendarLayout);
    const { safeValue: activeCalendarDate } = useCalendarMoment();
    const minDate = calendarAtts.filter__min_date || false;
    const maxDate = calendarAtts.filter__max_date || false;
    const { value: { items: filters } } = useTopFilters();
    const reverseOrder = useShouldReverseOrder();
    const rangesFormat = 'YYYY-MM-DD HH:mm:ss';

    let startRange;
    let endRange;

    params.showInUserTimezone = showInUserTimezone;

    switch (view) {

        case 'day': {
            startRange = moment(activeCalendarDate).startOf('day').utc().format(rangesFormat);
            endRange = moment(activeCalendarDate).endOf('day').utc().format(rangesFormat);
            break;
        }

        case 'week': {

            const firstDayOfWeek = getFirstDayOfWeekInView(activeCalendarDate, dowOffset);

            if (showInUserTimezone) {
                startRange = moment(firstDayOfWeek).startOf('day').utc().format(rangesFormat);
                endRange = moment(firstDayOfWeek).endOf('day').utc().add(6, 'day').format(rangesFormat);
            } else {
                startRange = moment.utc(firstDayOfWeek.format('YYYY-MM-DDT00:00:00')).format(rangesFormat);
                endRange = moment.utc(firstDayOfWeek.format('YYYY-MM-DDT23:59:59')).add(6, 'day').format(rangesFormat);
            }

            params.sortEventsInYMDkeys = true;

            break;
        }

        case 'month': {

            const firstDayOfmonth = getFirstDayOfMonthInView(activeCalendarDate, dowOffset);

            if (showInUserTimezone) {
                startRange = moment(firstDayOfmonth).startOf('day').utc().format(rangesFormat);
                endRange = moment(firstDayOfmonth).endOf('day').utc().add(41, 'day').format(rangesFormat);
            } else {
                startRange = moment.utc(firstDayOfmonth.format('YYYY-MM-DDT00:00:00')).format(rangesFormat);
                endRange = moment.utc(firstDayOfmonth.format('YYYY-MM-DDT23:59:59')).add(41, 'day').format(rangesFormat);
            }

            params.sortEventsInYMDkeys = true;

            break;
        }

        case 'agenda': {

            if (showInUserTimezone) {

                if (reverseOrder) {
                    startRange = moment(activeCalendarDate).startOf('month').utc().format(rangesFormat);
                    endRange = moment(activeCalendarDate).endOf('day').utc().format(rangesFormat);
                } else {
                    startRange = moment(activeCalendarDate).startOf('day').utc().format(rangesFormat);
                    endRange = moment(activeCalendarDate).endOf('month').utc().format(rangesFormat);
                }

            } else {

                if (reverseOrder) {
                    startRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT00:00:00')).startOf('month').format(rangesFormat);
                    endRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT23:59:59')).endOf('day').format(rangesFormat);
                } else {
                    startRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT00:00:00')).startOf('day').format(rangesFormat);
                    endRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT23:59:59')).endOf('month').format(rangesFormat);
                }

            }

            break;
        }

        case 'grid':
        case 'boxgrid':
        case 'map': {

            if (showInUserTimezone) {
                startRange = moment(activeCalendarDate).startOf('month').utc().format(rangesFormat);
                endRange = moment(activeCalendarDate).endOf('month').utc().format(rangesFormat);
            } else {
                startRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT00:00:00')).startOf('month').format(rangesFormat);
                endRange = moment.utc(activeCalendarDate.format('YYYY-MM-DDT23:59:59')).endOf('month').format(rangesFormat);
            }

            break;
        }

    }

    /**
     * GET EVENTS FROM ATOM
     */
    let eventsToProcess = events;


    /**
     * WORKER QUERY FILTERS PARAMS
     */
    const [foundEvents, ready] = useEventsInRange({
        startRange: startRange,
        endRange: endRange,
        minDate: minDate,
        maxDate: maxDate,
        minMaxIntersect: minMaxIntersect,
        events: eventsToProcess,
        filters: filters,
        order: reverseOrder ? 'desc' : 'asc',
        threadIndex: `BASE_${calendarAtts.id}`,
        ...params
    });

    let eventsToReturn = foundEvents;

    /**
     * Sort agenda boxgrid and grid events by featured on top
     * these exclude unbound layouts
     */
    if (['agenda', 'grid', 'boxgrid'].includes(view)) {
        eventsToReturn = sortEventsByFeatured(foundEvents);
    }

    return [eventsToReturn, ready];

}

/**
 * Obtains events for given layout and layout range
 * @uses useEventsInRange
 * @param object settings The calendar settings
 * @param object ranges {start, end} yyyy-mm-dd || moment
 * @returns mixed false || events 
 */
export const useCustomLayoutEvents = (ranges, params, threadIndex) => {

    const minMaxIntersect = useSettingsAtt('filter__minmax_intersect');
    const { value: calendarAtts } = useSettingsAtts();
    const { value: { items: filters } } = useTopFilters();
    const minDate = calendarAtts.filter__min_date || false;
    const maxDate = calendarAtts.filter__max_date || false;

    let cellMomentDateIterator;
    let startRange;
    let endRange;

    cellMomentDateIterator = ranges.start ? moment.utc(ranges.start) : false;
    startRange = cellMomentDateIterator ? moment.utc(cellMomentDateIterator).format('YYYY-MM-DD HH:mm:ss') : false;
    endRange = ranges.end ? moment.utc(ranges.end).format('YYYY-MM-DD HH:mm:ss') : false;

    /**
     * GET EVENTS FROM EVENTS PROVIDER
     */
    const { items: events } = useRecoilValue(calendarEvents);


    const foundEvents = useEventsInRange({
        startRange: startRange,
        endRange: endRange,
        minDate: minDate,
        maxDate: maxDate,
        minMaxIntersect: minMaxIntersect,
        events: events,
        filters: filters,
        threadIndex: threadIndex,
        ...params
    });

    return foundEvents;
}

/**
 * Keeps old state events visible while getting new state
 * when resetKey is changed 'ready' is reverted to false
 */
export const useCustomLayoutEventsCache = (props = {
    resetKey: 0
}) => {

    const [ready, setReady] = useState(false);
    const [layoutEvents, layoutEventsReady] = useCustomLayoutEvents({
        start: props.start,
        end: props.end
    }, {
        order: props.order || 'asc',
        sortEventsInYMDkeys: props.sortEventsInYMDkeys || false
    },
        props.threadIndex
    );

    const cache = useRef([]);

    if (layoutEvents) {
        cache.current = layoutEvents;
    }

    const events = cache.current;

    useEffect(() => {
        setReady(false);
    }, [props.resetKey]);

    useEffect(() => {

        if (false === ready && true === layoutEventsReady) {
            setReady(true);
        }

    }, [ready, layoutEventsReady]);

    return { events, ready };

}

/**
 * Obtains events for given range 
 * 
 * @params as following:
 * startRange - (string) start date in format YYYY-MM-DD
 * endRange - (string) end date in format YYYY-MM-DD
 * events - events list to be proccessed
 * threadIndex - the worker threadIndex string name
 * filters: calendars, categories, locations, organizers...
 * 
 * @uses EventsWorker.getEventsBetween
 * @returns Array with events
 */
export const useEventsInRange = (params) => {

    const dow = useSettingsAtt('calendar__dow');

    const [result, setResult] = useState({
        events: false,
        params: false,
        ready: false
    });

    const currentParamsString = JSON.stringify(params);

    useEffect(() => {

        let unsubscribe = false;

        const getEvents = async () => {

            setResult({ ...result, ready: false });

            const events = await getWorkerEventsBetween({ ...params, dow: dow });

            if (false === unsubscribe) {
                setResult({
                    events: events,
                    params: currentParamsString,
                    ready: true
                });
            }
        }

        if (params.startRange && params.endRange && params.events.length > 0) {

            getEvents();

        } else {
            setResult({
                events: [],
                params: currentParamsString,
                ready: true
            });
        }

        return () => {
            unsubscribe = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentParamsString]);

    return result.params !== currentParamsString ? [false, false] : [result.events, result.ready];

}

/**
 * Obtain top menu filters from events content
 * e.g. Categories, Locations...
 */
export const usePrepareTopFilters = ({ events, eventsReady }) => {

    const [value, setValue] = useRecoilState(calendarTopFilters);
    const categoriesStartInActive = useSettingsAtt('calendar__top_categories_start_inactive');
    const calendarId = useSettingsAtt('id');

    useEffect(() => {

        const obtainFiltersFromEvents = async () => {

            const items = await getWorkerEventsFilters({
                events: events,
                threadIndex: `usePrepareTopFilters_${calendarId}`,
                filters: [
                    {
                        id: 'calendars',
                        icon: 'fa-solid fa-calendar',
                        label: __('Calendars', 'stachethemes_event_calendar_lite'),
                        items: []
                    },
                    {
                        id: 'categories',
                        icon: 'fa-solid fa-folder',
                        label: __('Categories', 'stachethemes_event_calendar_lite'),
                        defaultActiveValue: !categoriesStartInActive,
                        items: [
                            {
                                id: 0,
                                label: __('Uncategorized', 'stachethemes_event_calendar_lite'),
                                active: !categoriesStartInActive
                            }
                        ]
                    },
                    {
                        id: 'locations',
                        icon: 'fa-solid fa-map-marker-alt',
                        label: __('Locations', 'stachethemes_event_calendar_lite'),
                        items: [
                            {
                                id: 0,
                                label: __('No location', 'stachethemes_event_calendar_lite'),
                                active: true
                            }
                        ]
                    },
                    {
                        id: 'organizers',
                        icon: 'fa-solid fa-users',
                        label: __('Organizers', 'stachethemes_event_calendar_lite'),
                        items: [
                            {
                                id: 0,
                                label: __('No organizer', 'stachethemes_event_calendar_lite'),
                                active: true
                            }
                        ]
                    },
                    {
                        id: 'guests',
                        icon: 'fa-solid fa-star',
                        label: __('Guests', 'stachethemes_event_calendar_lite'),
                        items: [
                            {
                                id: 0,
                                label: __('No guests', 'stachethemes_event_calendar_lite'),
                                active: true
                            }
                        ]
                    }
                ]
            });

            setValue({
                items: items,
                ready: true,
                error: false
            });

        }

        if (true === eventsReady) {
            obtainFiltersFromEvents();
        }


    }, [categoriesStartInActive, events, eventsReady, calendarId, setValue]);

    return value;

}

export const useTopFilters = () => {
    const [value, setValue] = useRecoilState(calendarTopFilters);
    return { value, setValue };
}

// For the agenda slider
export const useIsDragging = () => {

    const isDrag = useRef(false);

    useEffect(() => {

        let startX;
        let endX;
        let isMousePressed = false;

        function onMouseDown(e) {
            isDrag.current = false;
            isMousePressed = true;
            startX = e.clientX;
        }

        function onMouseUp(e) {
            if (isMousePressed) {
                endX = e.clientX;
                isMousePressed = false;
                isDrag.current = (Math.abs(startX - endX) > 10);
            }
        }

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            isDrag.current = false;
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        }

    }, [])

    return isDrag;
}

export const useAgendaSliderKey = () => {
    const [value, setValue] = useRecoilState(agendaSliderKey);

    return { value, setValue };
}

export const useRequestGoogleMapsLib = () => {

    const isLoaded = typeof window.google !== 'undefined';

    const apiKey = useSettingsAtt('map__gmap_api_key')

    const [ready, setReady] = useState(isLoaded);

    useEffect(() => {

        let mounted = true;

        const callback = () => {
            if (mounted) {
                setReady(true);
            }
        }

        if (window.google?.maps?.MapTypeControlStyle) {

            callback();

        } else {

            if (true !== window.STEC_FORCE_DISABLE?.google_maps) {

                const loader = new googleMapsLoader({
                    apiKey: apiKey,
                    version: "weekly",
                });

                loader.importLibrary('maps').then(async () => {

                    callback();

                });

            }

        }

        return () => {

            mounted = false;
        }

    }, [apiKey]);

    return ready;

}

export const useRequestOpenStreetMapLib = () => {

    const exists = typeof window.L !== 'undefined' && typeof window.L.map !== 'undefined';

    const [jsReady, setJsReady] = useState(exists);
    const [cssReady, setCssReady] = useState(exists);

    useEffect(() => {

        let subscribed = true;
        let script = false;
        let style = false;

        if (false === exists && true !== window.STEC_FORCE_DISABLE?.open_street_map) {

            const leafletJsSource = getPluginUrl('assets/js/libs/leaflet/leaflet.js');
            const leafletCssSource = getPluginUrl('assets/js/libs/leaflet/leaflet.css');

            script = document.createElement('script');
            script.src = leafletJsSource;
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                if (subscribed) {
                    setJsReady(true);
                }
            }

            style = document.createElement('link');
            style.href = leafletCssSource;
            style.type = 'text/css';
            style.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].append(style);

            style.onload = () => {
                setCssReady(true);
            }
        }

        return () => {

            subscribed = false;

            if (script) {
                document.body.removeChild(script);
            }
        }


    }, [exists]);

    return jsReady && cssReady;

}

/**
 * Keeps old state events visible while getting new state
 * when resetKey is changed 'ready' is reverted to false
 */
export const useLayoutEventsCache = (resetKey) => {

    const [ready, setReady] = useState(false);
    const [layoutEvents, layoutEventsReady] = useLayoutEvents();
    const cache = useRef([]);

    if (layoutEvents) {
        cache.current = layoutEvents;
    }

    const events = cache.current;

    useEffect(() => {
        setReady(false);
    }, [resetKey]);

    useEffect(() => {

        if (false === ready && true === layoutEventsReady) {
            setReady(true);
        }

    }, [ready, layoutEventsReady]);

    return { events, ready };

}

export const useImagesLoaded = (imagesArray) => {

    const [ready, setReady] = useState(false);

    useEffect(() => {

        const loadImages = async (imagesArray) => {

            return new Promise((resolve) => {

                let waitingPreload = imagesArray.length;

                const onImageLoaded = async () => {
                    waitingPreload--;
                    if (waitingPreload <= 0) {
                        setReady(true);
                        return resolve(imagesArray);
                    }
                }

                if (imagesArray.length > 0) {

                    for (let i = 0; i < imagesArray.length; i++) {
                        const image = imagesArray[i];
                        const imageObject = new Image();
                        imageObject.src = image;

                        if (imageObject.complete) {
                            onImageLoaded();
                        } else {
                            imageObject.onload = () => {
                                onImageLoaded();
                            };
                        }
                    }

                } else {
                    setReady(true);
                    return resolve(imagesArray);
                }
            });
        }

        loadImages(imagesArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(imagesArray)]);

    return { ready, imagesArray };
}

export const useMinMaxCalendarMoments = () => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');

    const minAllowedMoment = moment().utc().set({
        year: minAllowedYear,
        month: 0,
        date: 1,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const maxAllowedMoment = moment().utc().set({
        year: maxAllowedYear,
        month: 11,
        date: 31,
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    return { minAllowedMoment, maxAllowedMoment };

}

export const useEventStructure = (params = {}) => {

    const safeStructure = JSON.parse(JSON.stringify(eventLayoutTemplate));

    return { value: safeStructure, ready: true, isError: false };

}