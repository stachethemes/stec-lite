import EventTags from '@Stec/CommonComponents/EventTags';
import EventCounterSmall from '@Stec/JS/calendar/common/EventCounterSmall';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyEventTimespan, getEventSortedImages, getEventThumbnailByType } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';

const EventTooltip = ({ event }) => {

    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const tooltipImageAutoHeight = useSettingsAtt('layouts__month_week_image_auto_height');
    const dateFormat = useSettingsAtt('calendar__date_format');
    const timeFormat = useSettingsAtt('calendar__time_format');
    const dateShowTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const classNameArray = ['stec-event-tooltip'];
    const nfoArray = [];
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);
    const maybeHasImage = getEventSortedImages(event);

    const getImageStyle = (image) => {

        const hasDimensionsData = image.dimensions ? true : false;

        if (!tooltipImageAutoHeight || !hasDimensionsData) {
            return (
                {
                    backgroundImage: `url(${image.sizes.medium})`
                }
            )
        }

        return (
            {
                backgroundImage: `url(${image.sizes.medium})`,
                height: 0,
                paddingTop: 100 / image.dimensions.medium.ar + '%'
            }
        )

    }


    if (maybeHasImage.length > 0) {
        classNameArray.push('stec-event-tooltip-has-image')
    }

    nfoArray.push(
        <StecDiv key='date' className='stec-event-tooltip-nfo'>
            <i className='fa-solid fa-clock' /><StecSpan>{
                beautifyEventTimespan({
                    event: event,
                    dateFormat: dateFormat,
                    timeFormat: timeFormat,
                    showUtcOffset: dateShowTzOffset,
                    forceHideEnd: true,
                    fullMonth: true,
                    showInUserTimezone: showInUserTimezone
                })
            }</StecSpan>
        </StecDiv>
    );

    if (Array.isArray(event.location) && event.location.length > 0) {
        const locationFullName = [event.location.title];
        if (event.location.type === 'physical') {
            if (event.location.postal_code) {
                locationFullName.push(event.location.postal_code);
            }
            if (event.location.address) {
                locationFullName.push(event.location.address);
            }
            if (event.location.state) {
                locationFullName.push(event.location.state);
            }
            if (event.location.city) {
                locationFullName.push(event.location.city);
            }
            if (event.location.country) {
                locationFullName.push(event.location.country);
            }
        }

        nfoArray.push(
            <StecDiv key='location' className='stec-event-tooltip-nfo'>
                {'virtual' === event.location.type ? <i className='fa-solid fa-wifi' /> : <i className='fa-solid fa-map-marker-alt' />}<StecSpan>{locationFullName.join(', ')}</StecSpan>
            </StecDiv>
        );
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            {maybeHasImage.length > 0 && <StecDiv
                className='stec-event-tooltip-background-image'
                style={getImageStyle(maybeHasImage[0])}>
                {<EventTags event={event} />}
            </StecDiv>}

            <StecDiv className='stec-event-tooltip-container'>

                {!maybeHasImage.length > 0 && <EventTags event={event} />}

                <StecDiv className='stec-event-tooltip-container-wrapper'>

                    {theThumbnail}

                    <StecDiv className='stec-event-tooltip-title'>{event.title}</StecDiv>

                    {event.short_description && <StecDiv className='stec-event-tooltip-description' dangerouslySetInnerHTML={{ __html: event.short_description }} />}

                    <EventCounterSmall event={event} style={{ marginTop: 20 }} />

                </StecDiv>

                {nfoArray}
            </StecDiv>
        </StecDiv>

    )
}

export default EventTooltip
