import EventTags from '@Stec/CommonComponents/EventTags';
import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyEventTimespan, getEventThumbnailByType, } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';

/**
 * Event preview -/+ aside toggle button
 */
const EventPreviewToggleButton = ({ forceActive, active }) => {

    const enabled = useSettingsAtt('calendar__ep_toggle_button');
    const openEventsIn = useSettingsAtt('calendar__open_events_in');
    const screenType = useCalendarScreenTypeValue();

    if ('mobile' === screenType) {
        return null;
    }

    if (!enabled) {
        return null;
    }

    if (forceActive) {
        return null;
    }

    let asideToggleIconClassName = '';

    switch (openEventsIn) {

        case 'single':
            asideToggleIconClassName = ''
            break;

        case 'external':
            asideToggleIconClassName = 'fa-solid fa-external-link-alt'
            break;

        default:
            asideToggleIconClassName = active ? 'fa-solid fa-minus' : 'fa-solid fa-plus';
    }

    return <StecDiv className='stec-event-preview-aside-toggle'>
        <i className={asideToggleIconClassName} />
    </StecDiv>

}

const EventPreview = ({ event, forceActive, active, onToggle, href = false }) => {

    const containerRef = useRef(null);
    const screenType = useCalendarScreenTypeValue();
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const hrefTarget = useSettingsAtt('calendar__links_target');
    const dateShowTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const dateFormat = useSettingsAtt('calendar__date_format');
    const timeFormat = useSettingsAtt('calendar__time_format');
    const theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;

    const classNameArray = ['stec-event-preview'];

    if (true === forceActive) {
        classNameArray.push('no-hover-style');
    }

    if (isEventCancelled) {
        classNameArray.push('stec-event-preview-cancelled');
    }

    useEffect(() => {

        if (!containerRef.current) {
            return;
        }

        if (window.stecActionOnEventPreviewRender) {
            window.stecActionOnEventPreviewRender({
                event: event,
                container: containerRef.current
            });
        }


    }, [event]);

    if (href) {

        // transform wrapper to <a> when need to redirect from link
        return (
            <a href={href} target={hrefTarget} className={classNameArray.join(' ')} ref={containerRef}>

                {theThumbnail}

                <StecDiv className='stec-event-preview-content'>

                    <StecDiv>

                        <StecDiv className='stec-event-preview-content-primary'>
                            <EventTags event={event} />

                            <StecDiv className='stec-event-preview-content-title'>
                                {eventTitle}
                            </StecDiv>
                        </StecDiv>

                        <StecDiv className='stec-event-preview-content-secondary'>

                            <StecSpan>
                                <i className='fa-solid fa-clock' />
                                {
                                    beautifyEventTimespan({
                                        event: event,
                                        dateFormat: dateFormat,
                                        timeFormat: timeFormat,
                                        showUtcOffset: dateShowTzOffset,
                                        fullMonth: screenType !== 'mobile',
                                        showInUserTimezone: showInUserTimezone
                                    })
                                }
                            </StecSpan>

                            {
                                event.location &&
                                <StecSpan>
                                    <i className={'virtual' === event.location.type ? 'fa-solid fa-wifi' : 'fa-solid fa-map-marker-alt'} />
                                    {event.location.title}
                                </StecSpan>
                            }

                            {
                                event.short_description &&
                                <StecSpan dangerouslySetInnerHTML={{ __html: event.short_description }} />
                            }


                        </StecDiv>

                    </StecDiv>

                    <StecDiv className='stec-event-preview-aside'>

                        <EventPreviewToggleButton forceActive={forceActive} active={active} />

                    </StecDiv>

                </StecDiv>

            </a>
        )
    }

    return (
        <StecDiv className={classNameArray.join(' ')} onClick={onToggle} ref={containerRef}>

            {theThumbnail}

            <StecDiv className='stec-event-preview-content'>

                <StecDiv>

                    <StecDiv className='stec-event-preview-content-primary'>
                        <EventTags event={event} />

                        <StecDiv className='stec-event-preview-content-title'>
                            {eventTitle}
                        </StecDiv>
                    </StecDiv>

                    <StecDiv className='stec-event-preview-content-secondary'>

                        <StecSpan>
                            <i className='fa-solid fa-clock' />
                            {beautifyEventTimespan({
                                event: event,
                                dateFormat: dateFormat,
                                timeFormat: timeFormat,
                                showUtcOffset: dateShowTzOffset,
                                fullMonth: screenType !== 'mobile',
                                showInUserTimezone: showInUserTimezone
                            })}
                        </StecSpan>

                        {
                            event.location &&
                            <StecSpan>
                                <i className={'virtual' === event.location.type ? 'fa-solid fa-wifi' : 'fa-solid fa-map-marker-alt'} />
                                {event.location.title}
                            </StecSpan>
                        }

                        {
                            event.short_description &&
                            <StecSpan dangerouslySetInnerHTML={{ __html: event.short_description }} />
                        }

                    </StecDiv>

                </StecDiv>

                <StecDiv className='stec-event-preview-aside'>

                    <EventPreviewToggleButton forceActive={forceActive} active={active} />

                </StecDiv>

            </StecDiv>

        </StecDiv>
    )
}

export default EventPreview
