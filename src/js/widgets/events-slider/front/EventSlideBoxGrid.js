import EventTags from '@Stec/CommonComponents/EventTags';
import { getDayLabels, getEventPermalink, getEventSortedImages, getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';

function EventSlideBoxGrid({ event, widgetProps }) {

    const classNameArray = ['stec-slide-boxgrid'];
    const eventStartMoment = moment.tz(event.meta.start_date, event.meta.timezone);
    const showInUserTimezone = STEC_VARIABLES?.use_user_tz || false;

    if (showInUserTimezone) {
        eventStartMoment.local();
    }

    const year = eventStartMoment.year();
    const date = eventStartMoment.date();
    const monthNum = eventStartMoment.month();
    const monthLabel = getMonthLabel(monthNum, 'short');
    const dayLabel = getDayLabels('long')[eventStartMoment.day()];
    const hasImages = getEventSortedImages(event);
    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;

    const getClickLink = () => {

        const { prefer_external_link } = widgetProps;

        if (prefer_external_link && event.meta?.external_link?.url) {
            return event.meta.external_link.url;
        }

        return getEventPermalink(event);
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            {
                <StecDiv
                    className='stec-slide-boxgrid-background-image'
                    style={
                        hasImages.length > 0 ?
                            { backgroundColor: event.color, backgroundImage: `url(${hasImages[0].sizes.full})` } :
                            {
                                backgroundColor: event.color
                            }
                    }>
                </StecDiv>
            }

            <StecDiv className='stec-slide-boxgrid-container'>
                <StecDiv className='stec-slide-boxgrid-event-top'>
                    <StecDiv className='stec-slide-boxgrid-event-icon'>
                        {event.meta.thumbnail.icon ? <i className={event.meta.thumbnail.icon} /> : ''}
                    </StecDiv>
                    <StecDiv className='stec-slide-boxgrid-event-date'>
                        <StecSpan className='stec-slide-boxgrid-event-date-day'>
                            {date}
                        </StecSpan>
                        <StecSpan className='stec-slide-boxgrid-event-date-month-and-year'>
                            <StecSpan className='stec-slide-boxgrid-event-date-year'>
                                {year}
                            </StecSpan>
                            <br />
                            <StecSpan className='stec-slide-boxgrid-event-date-month'>
                                {monthLabel}
                            </StecSpan>
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-slide-boxgrid-event-date-daylabel'>
                            {dayLabel}
                        </StecSpan>
                    </StecDiv>


                </StecDiv>

                <StecDiv className='stec-slide-boxgrid-event-content'>
                    {widgetProps.display_tags && <EventTags event={event} includeCategories={widgetProps.display_categories || false} />}
                    <StecDiv className='stec-slide-boxgrid-event-title'>{eventTitle}</StecDiv>

                    {
                        (widgetProps.display_description && event.short_description) &&
                        <StecDiv className='stec-slide-boxgrid-event-description'
                            dangerouslySetInnerHTML={{ __html: event.short_description }} />
                    }

                </StecDiv>

                <a target={widgetProps.open_events_in || '_blank'} href={getClickLink()} className='stec-slide-boxgrid-link' />

            </StecDiv>



        </StecDiv>
    )
}

export default EventSlideBoxGrid