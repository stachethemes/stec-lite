import EventTags from '@Stec/CommonComponents/EventTags';
import { beautifyEventTimespan, getEventPermalink, getEventThumbnailByType } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function EventPreview({ widgetProps, event }) {

    const thumbnailSource = widgetProps.thumbnail_source || 'event';
    const theThumbnail = getEventThumbnailByType(event, 'small', thumbnailSource);

    const eventClick = () => {

        let readMoreURL = '';

        if (widgetProps.prefer_external_link === true && event?.meta?.external_link?.url) {

            readMoreURL = event.meta.external_link.url;

        } else {

            readMoreURL = getEventPermalink(event);

        }

        window.open(readMoreURL, widgetProps.open_events_in);
    }

    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;

    const classNameArray = ['stec-widget-events-list-event-preview'];

    if (isEventCancelled) {
        classNameArray.push('stec-widget-events-list-event-preview-cancelled');
    }

    const showInUserTimezone = STEC_VARIABLES?.use_user_tz || false;
    const showUtcOffset = STEC_VARIABLES?.show_tz_offset || false;

    return (
        <StecDiv className={classNameArray.join(' ')} onClick={eventClick}>

            <StecDiv className='stec-widget-events-list-event-preview-flex'>
                <StecDiv className='stec-widget-events-list-event-preview-content'>
                    <StecDiv className='stec-widget-events-list-event-preview-content-primary'>


                        <StecDiv className='stec-widget-events-list-event-preview-content-title-wrap'>
                            {true === widgetProps.display_thumbnail && theThumbnail}
                            <StecDiv>
                                {
                                    true === widgetProps.display_tags &&
                                    <EventTags event={event} size='small' includeCategories={widgetProps.display_categories || false} />
                                }
                                <StecDiv className='stec-widget-events-list-event-preview-content-title'>
                                    {eventTitle}
                                </StecDiv>
                            </StecDiv>
                        </StecDiv>
                    </StecDiv>
                </StecDiv>
            </StecDiv>

            <StecDiv className='stec-widget-events-list-event-preview-content-secondary'>
                <StecSpan>
                    <i className='fa-solid fa-clock' />{
                        beautifyEventTimespan({
                            event: event,
                            fullMonth: true,
                            showInUserTimezone: showInUserTimezone,
                            showUtcOffset: showUtcOffset
                        })
                    }
                </StecSpan>

                {(true === widgetProps.display_locations && event.location) &&
                    <StecSpan>
                        {
                            'virtual' === event.location.type ?
                                <i className='fa-solid fa-wifi' /> :
                                <i className='fa-solid fa-map-marker-alt' />

                        }
                        {
                            event.location.title
                        }
                    </StecSpan>
                }

                {(true === widgetProps.display_categories && event.categories > 0) &&
                    <StecSpan>
                        <i className='fa-solid fa-folder' />
                        {event.categories.map((category, i) => {
                            return 0 === i ? category.name : `, ${category.name}`;
                        })}
                    </StecSpan>
                }

                {(true === widgetProps.display_tickets && Array.isArray(event.meta.tickets) && event.meta.tickets.length > 0) &&
                    <StecSpan>
                        <i className='fa-solid fa-ticket-alt' />
                        {__('Tickets', 'stachethemes_event_calendar_lite')}
                    </StecSpan>
                }

                {(true === widgetProps.display_description && event.short_description) &&
                    <StecSpan dangerouslySetInnerHTML={{ __html: event.short_description }} />}
            </StecDiv>

        </StecDiv>
    )
}

export default EventPreview
