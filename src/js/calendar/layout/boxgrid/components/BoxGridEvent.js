import EventTags from '@Stec/CommonComponents/EventTags';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getDayLabels, getEventPermalink, getEventSortedImages, getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';

const WithWrapper = (props) => {

    const hrefTarget = useSettingsAtt('calendar__links_target');
    const openEventsIn = useSettingsAtt('calendar__open_events_in');

    switch (openEventsIn) {

        case 'external': {

            let href = '';

            if (props.event.meta?.external_link?.url) {
                href = props.event.meta.external_link.url;
            } else {
                getEventPermalink(props.event);
            }

            return (
                <a className={props.classNameArray.join(' ')} href={href} target={hrefTarget}>
                    {props.children}
                </a>
            )

        }

        case 'single': {

            const href = getEventPermalink(props.event);

            return (
                <a className={props.classNameArray.join(' ')} href={href} target={hrefTarget}>
                    {props.children}
                </a>
            )
        }

        default:
            return (
                <StecDiv className={props.classNameArray.join(' ')}>
                    {props.children}
                </StecDiv>
            )
    }

}

const EventDate = ({ event }) => {

    const hideEndFromBoxGrid = useSettingsAtt('layouts__boxgrid_hide_end');
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');

    const getDateInfo = (value = 'start') => {

        if (value === 'end') {

            const eventEndMoment = moment.tz(event.meta.end_date, event.meta.timezone);

            if (showInUserTimezone) {
                eventEndMoment.local();
            }

            const year = eventEndMoment.year();
            const date = eventEndMoment.date();
            const monthNum = eventEndMoment.month();
            const monthLabel = getMonthLabel(monthNum, 'short');
            const dayLabel = getDayLabels('long')[eventEndMoment.day()];
            const dayLabelShort = getDayLabels('short')[eventEndMoment.day()];

            return {
                year: year,
                date: date,
                monthLabel: monthLabel,
                dayLabel: dayLabel,
                dlShort: dayLabelShort
            }

        }

        const eventStartMoment = moment.tz(event.meta.start_date, event.meta.timezone);

        if (showInUserTimezone) {
            eventStartMoment.local();
        }

        const year = eventStartMoment.year();
        const date = eventStartMoment.date();
        const monthNum = eventStartMoment.month();
        const monthLabel = getMonthLabel(monthNum, 'short');
        const dayLabel = getDayLabels('long')[eventStartMoment.day()];
        const dayLabelShort = getDayLabels('short')[eventStartMoment.day()];

        return {
            year: year,
            date: date,
            monthLabel: monthLabel,
            dayLabel: dayLabel,
            dlShort: dayLabelShort
        }


    }

    const Separator = (params) => {

        let style = {
            fontSize: 16,
            verticalAlign: 'middle',
            fontWeight: 'bold',
            margin: '0 10px'
        };

        if (params.style) {
            // add extra css to style 
            style = {
                ...style,
                ...params.style
            }
        }


        return (
            <StecSpan style={style}>&ndash;</StecSpan>
        )
    }

    const { year: startYear, date: startDate, monthLabel: startMonthLabel, dayLabel: startDayLabel } = getDateInfo('start');
    const { year: endYear, date: endDate, monthLabel: endMonthLabel, dayLabel: endDayLabel } = getDateInfo('end');

    const isSameDay = startDate === endDate && startMonthLabel === endMonthLabel && startYear === endYear;
    const isSameMonth = startMonthLabel === endMonthLabel && startYear === endYear;
    const hideEnd = event.meta.hide_end || hideEndFromBoxGrid;

    if (typeof window.stecFilterBoxGridEventDateHtml === 'function') {

        const customHtml = window.stecFilterBoxGridEventDateHtml({
            event: event,
            hideEnd: hideEnd,
            hideEndFromBoxGrid: hideEndFromBoxGrid,
            showInUserTimezone: showInUserTimezone
        });

        return customHtml;
    }

    if (isSameDay || hideEnd) {
        return (
            <StecDiv className='stec-layout-boxgrid-event-date'>
                <StecSpan className='stec-layout-boxgrid-event-date-day'>
                    {startDate}
                </StecSpan>
                <StecSpan className='stec-layout-boxgrid-event-date-month-and-year'>
                    <StecSpan className='stec-layout-boxgrid-event-date-year'>
                        {startYear}
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-layout-boxgrid-event-date-month'>
                        {startMonthLabel}
                    </StecSpan>
                </StecSpan>
                <br />
                <StecSpan className='stec-layout-boxgrid-event-date-daylabel'>
                    {startDayLabel}
                </StecSpan>
            </StecDiv>
        )
    }

    if (isSameMonth) {
        return (
            <StecDiv className='stec-layout-boxgrid-event-date'>
                <StecSpan className='stec-layout-boxgrid-event-date-day'>
                    {startDate}
                    <Separator />
                    {endDate}
                </StecSpan>
                <StecSpan className='stec-layout-boxgrid-event-date-month-and-year'>
                    <StecSpan className='stec-layout-boxgrid-event-date-year'>
                        {startYear}
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-layout-boxgrid-event-date-month'>
                        {startMonthLabel}
                    </StecSpan>
                </StecSpan>
                <br />
                <StecSpan className='stec-layout-boxgrid-event-date-daylabel'>
                    {startDate} {startDayLabel} - {endDate} {endDayLabel}
                </StecSpan>
            </StecDiv>
        )
    }

    return (
        <StecDiv style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItem: 'center'
        }}>
            <StecDiv className='stec-layout-boxgrid-event-date'>
                <StecSpan className='stec-layout-boxgrid-event-date-day'>
                    {startDate}
                </StecSpan>
                <StecSpan className='stec-layout-boxgrid-event-date-month-and-year'>
                    <StecSpan className='stec-layout-boxgrid-event-date-year'>
                        {startYear}
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-layout-boxgrid-event-date-month'>
                        {startMonthLabel}
                    </StecSpan>
                </StecSpan>
                <br />
                <StecSpan className='stec-layout-boxgrid-event-date-daylabel'>
                    {startDayLabel}
                </StecSpan>
            </StecDiv>
            <Separator style={{ marginTop: 10 }} />
            <StecDiv className='stec-layout-boxgrid-event-date'>
                <StecSpan className='stec-layout-boxgrid-event-date-day'>
                    {endDate}
                </StecSpan>
                <StecSpan className='stec-layout-boxgrid-event-date-month-and-year'>
                    <StecSpan className='stec-layout-boxgrid-event-date-year'>
                        {endYear}
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-layout-boxgrid-event-date-month'>
                        {endMonthLabel}
                    </StecSpan>
                </StecSpan>
                <br />
                <StecSpan className='stec-layout-boxgrid-event-date-daylabel'>
                    {endDayLabel}
                </StecSpan>
            </StecDiv>
        </StecDiv>
    )

}

const BoxGridEvent = ({ event, onActive }) => {

    const openEventsIn = useSettingsAtt('calendar__open_events_in');
    const classNameArray = ['stec-boxgrid-event'];
    const hasImages = getEventSortedImages(event);
    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;
    const containerRef = useRef(null);

    const beforeOnActive = () => {

        if (['single', 'external'].includes(openEventsIn)) {
            return;
        }

        onActive();
    }

    useEffect(() => {

        if (!containerRef.current) {
            return;
        }

        if (window.stecOnBoxGridEventRender) {
            window.stecOnBoxGridEventRender({
                event: event,
                container: containerRef.current
            });
        }

    }, [event]);

    return (
        <WithWrapper classNameArray={classNameArray} event={event}>

            {
                <StecDiv
                    className='stec-boxgrid-event-background-image'
                    style={
                        hasImages.length > 0 ?
                            { backgroundColor: event.color, backgroundImage: `url(${hasImages[0].sizes.full})` } :
                            {
                                backgroundColor: event.color
                            }
                    }>
                </StecDiv>
            }

            <StecDiv ref={containerRef} className='stec-boxgrid-event-container' onClick={(e) => {
                e.stopPropagation();
                beforeOnActive(event);
            }}>
                <StecDiv className='stec-layout-boxgrid-event-top'>
                    <StecDiv className='stec-layout-boxgrid-event-icon'>
                        {event.meta.thumbnail.icon ? <i className={event.meta.thumbnail.icon} /> : ''}
                    </StecDiv>

                    <EventDate event={event} />

                </StecDiv>

                <StecDiv className='stec-layout-boxgrid-event-content'>
                    <EventTags event={event} />
                    <StecDiv className='stec-layout-boxgrid-event-title'>{eventTitle}</StecDiv>
                    {event.short_description &&
                        <StecDiv className='stec-layout-boxgrid-event-description' dangerouslySetInnerHTML={{ __html: event.short_description }} />}
                </StecDiv>

            </StecDiv>

        </WithWrapper>
    )
}

export default BoxGridEvent