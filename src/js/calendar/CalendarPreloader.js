import Loader from '@Stec/CommonComponents/Loader';
import { calendarEvents } from '@Stec/JS/calendar/atoms';
import { useFetchCalendarEvents, usePrepareTopFilters, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useRecoilState } from "recoil";

const CalendarPreloaderPrefetched = ({ children }) => {

    const prefetchedEventsHash = useSettingsAtt('prefetched_events_hash');
    const prefetchedEvents = window.stecPrefetchedEvents[prefetchedEventsHash];
    const [{ items: events, ready }, setEvents] = useRecoilState(calendarEvents);
    const calendarInstanceId = useSettingsAtt('id');

    const { ready: filtersReady } = usePrepareTopFilters({
        events: events,
        eventsReady: ready
    });

    useEffect(() => {

        if (false === ready) {

            setEvents({
                ready: true,
                error: false,
                items: Array.isArray(prefetchedEvents) ? prefetchedEvents : []
            });

        }

    }, [events, prefetchedEvents, ready, setEvents]);

    useEffect(() => {

        if (filtersReady && ready) {
            if (typeof window.stecOnCalendarReady === 'function') {
                window.stecOnCalendarReady({
                    id: calendarInstanceId,
                });
            }
        }

    }, [calendarInstanceId, events, filtersReady, ready]);

    return (
        children
    );

}

const CalendarPreloaderFetch = ({ children }) => {

    const calendarInstanceId = useSettingsAtt('id');
    const filterByOrganizer = useSettingsAtt('filter__organizer');
    const filterByLocation = useSettingsAtt('filter__location');
    const filterByCalendar = useSettingsAtt('filter__calendar');
    const filterByCategory = useSettingsAtt('filter__category');
    const filterByGuest = useSettingsAtt('filter__guest');
    const filterByFeatured = useSettingsAtt('filter__featured');
    const filterByEvents = useSettingsAtt('filter__events');
    const filterByMinDate = useSettingsAtt('filter__min_date');
    const filterByMaxDate = useSettingsAtt('filter__max_date');
    const filterByReadPermission = useSettingsAtt('filter__read_permission');
    const filterByAuthor = useSettingsAtt('filter__author');

    const { items: events, ready: eventsReady } = useFetchCalendarEvents({
        organizer: filterByOrganizer,
        location: filterByLocation,
        guest: filterByGuest,
        calendar: filterByCalendar,
        category: filterByCategory,
        minDate: filterByMinDate,
        maxDate: filterByMaxDate,
        featured: filterByFeatured,
        readPermission: filterByReadPermission,
        author: filterByAuthor,
        include: filterByEvents
    });

    const { ready: filtersReady } = usePrepareTopFilters({
        events: events,
        eventsReady: eventsReady
    });

    useEffect(() => {

        if (filtersReady && eventsReady) {
            if (typeof window.stecOnCalendarReady === 'function') {
                window.stecOnCalendarReady({
                    id: calendarInstanceId,
                });
            }
        }

    }, [eventsReady, filtersReady, calendarInstanceId]);

    if (false === filtersReady || false === eventsReady) {
        return (
            <Loader className='stec-calendar-preloader' type='calendar-sprite' title={__('Loading calendar', 'stachethemes_event_calendar_lite')} />
        );
    }

    return (
        children
    );

}

const CalendarPreloader = ({ children }) => {

    const eventsArePrefetched = useSettingsAtt('misc__events_prefetch');
    const prefetchedEventsHash = useSettingsAtt('prefetched_events_hash');

    if (eventsArePrefetched && prefetchedEventsHash) {
        return (
            <CalendarPreloaderPrefetched>
                {children}
            </CalendarPreloaderPrefetched>
        );
    }

    return (
        <CalendarPreloaderFetch>
            {children}
        </CalendarPreloaderFetch>
    )


}

export default CalendarPreloader;