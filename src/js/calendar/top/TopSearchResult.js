import { beautifyEventTimespan, getEventThumbnailByType, getEventPermalink } from '@Stec/JS/helpers';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';

const WithWrapper = (props) => {

    const hrefTarget = useSettingsAtt('calendar__links_target');
    const openEventsIn = useSettingsAtt('calendar__open_events_in');

    switch (openEventsIn) {

        case 'external' : {

            let href = '';

            if (props.event.meta?.external_link?.url) {
                href = props.event.meta.external_link.url;
            } else {
                getEventPermalink(props.event);
            }

            return (
                <a className='stec-top-search-menu-result' href={href} target={hrefTarget}>
                    {props.children}

                </a>
            )

        }

        case 'single': {

            const href = getEventPermalink(props.event);

            return (
                <a className='stec-top-search-menu-result' href={href} target={hrefTarget}>
                    {props.children}

                </a>
            )

        }

        default:
            return (
                <StecDiv className='stec-top-search-menu-result' onClick={() => {
                    props.onEventSelect(props.event);
                }}>
                    {props.children}
                </StecDiv>
            )
    }


}

const TopSearchResult = ({ event, onEventSelect }) => {

    const dateFormat = useSettingsAtt('calendar__date_format');
    const timeFormat = useSettingsAtt('calendar__time_format');
    const dateShowTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');

    return (
        <WithWrapper event={event} onEventSelect={onEventSelect}>

            <StecDiv className='stec-top-search-menu-result-thumb'>
                {theThumbnail}
            </StecDiv>

            <StecDiv className='stec-top-search-menu-result-content'>
                <StecSpan className='stec-top-search-menu-result-content-title'>{event.title}</StecSpan>
                <StecSpan className='stec-top-search-menu-result-content-nfo'>
                    <i className='fa-solid fa-clock' />{
                        beautifyEventTimespan({
                            event: event,
                            dateFormat: dateFormat,
                            timeFormat: timeFormat,
                            showUtcOffset: dateShowTzOffset,
                            fullMonth: true,
                            forceHideEnd: true,
                            showInUserTimezone: showInUserTimezone
                        })
                    }
                </StecSpan>
                {
                    event.location?.id &&
                    <StecSpan className='stec-top-search-menu-result-content-nfo'>
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
            </StecDiv>

        </WithWrapper>
    )
}

export default TopSearchResult
