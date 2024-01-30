import EventTags from '@Stec/CommonComponents/EventTags';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getDayLabels, getEventPermalink, getEventSortedImages, getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useRef, useEffect } from 'react';

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

const BoxGridEvent = ({ event, onActive }) => {

    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
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

    const getDateInfo = () => {

        const eventStartMoment = moment.tz(event.meta.start_date, event.meta.timezone);

        if (showInUserTimezone) {
            eventStartMoment.local();
        }

        const year = eventStartMoment.year();
        const date = eventStartMoment.date();
        const monthNum = eventStartMoment.month();
        const monthLabel = getMonthLabel(monthNum, 'short');
        const dayLabel = getDayLabels('long')[eventStartMoment.day()];

        return {
            year: year,
            date: date,
            monthLabel: monthLabel,
            dayLabel: dayLabel
        }
    }

    const { year, date, monthLabel, dayLabel } = getDateInfo();

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
                    <StecDiv className='stec-layout-boxgrid-event-date'>
                        <StecSpan className='stec-layout-boxgrid-event-date-day'>
                            {date}
                        </StecSpan>
                        <StecSpan className='stec-layout-boxgrid-event-date-month-and-year'>
                            <StecSpan className='stec-layout-boxgrid-event-date-year'>
                                {year}
                            </StecSpan>
                            <br />
                            <StecSpan className='stec-layout-boxgrid-event-date-month'>
                                {monthLabel}
                            </StecSpan>
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-layout-boxgrid-event-date-daylabel'>
                            {dayLabel}
                        </StecSpan>
                    </StecDiv>

                    <StecDiv className='stec-layout-boxgrid-event-container-aside-buttons'>

                    </StecDiv>

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