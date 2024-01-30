import EventTags from '@Stec/CommonComponents/EventTags';
import VerifiedBadgeTag from '@Stec/CommonComponents/VerifiedBadgeTag';
import EventCounterSmall from '@Stec/JS/calendar/common/EventCounterSmall';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyEventTimespan, getEventPermalink, getEventSortedImages, getEventThumbnailByType } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { _x } from '@wordpress/i18n';
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

const GridEvent = ({ event, onActive }) => {

    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const displayCounter = useSettingsAtt('layouts__grid_counter');
    const openEventsIn = useSettingsAtt('calendar__open_events_in');
    const dateShowTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const gridImageAutoHeight = useSettingsAtt('layouts__grid_image_auto_height');
    const dateFormat = useSettingsAtt('date_format');
    const timeFormat = useSettingsAtt('time_format');
    const classNameArray = ['stec-grid-event'];
    const nfoArray = [];
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);
    const images = getEventSortedImages(event);
    const hasImages = images.length > 0;
    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;
    const containerRef = useRef(null);

    const getImageStyle = (image) => {

        const hasDimensionsData = image.dimensions ? true : false;

        if (!gridImageAutoHeight || !hasDimensionsData) {
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

    if (hasImages) {
        classNameArray.push('stec-grid-event-has-image')
    }

    if (event.organizers?.[0]) {

        const hasOrganizerImage = event.organizers[0]?.photo?.sizes?.thumbnail ? true : false;
        let prefix = '';

        if (hasOrganizerImage) {
            prefix = <img src={`${event.organizers[0]?.photo?.sizes?.thumbnail}`} />;
        } else {
            prefix = <i className='stec-grid-event-organizer-image-placeholder fa-solid fa-user' />;
        }

        const isVerified = event.organizers[0]?.verified;

        const organizerContent = [];

        organizerContent.push(event.organizers[0].title);

        if (isVerified) {
            organizerContent.push(
                <VerifiedBadgeTag
                    key={'badge'}
                    style={{
                        marginLeft: 5
                    }}
                    title={_x('Verified organizer', 'Verified organizer title text', 'stec')}
                />
            );
        }

        nfoArray.push({
            prefix: prefix,
            content: organizerContent,
            style: { alignItems: 'center', paddingTop: '9px', paddingBottom: '9px' }
        });
    }

    nfoArray.push({
        prefix: <i className='fa-solid fa-clock' />,
        content: beautifyEventTimespan({
            event: event,
            dateFormat: dateFormat,
            timeFormat: timeFormat,
            showUtcOffset: dateShowTzOffset,
            showInUserTimezone: showInUserTimezone
        })
    });


    if (event.location?.id) {
        nfoArray.push({
            prefix: <i className={'virtual' === event.location.type ? 'fa-solid fa-wifi' : 'fa-solid fa-map-marker-alt'} />,
            content: event.location.title
        });
    }

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

        if (window.stecOnGridEventRender) {
            window.stecOnGridEventRender({
                event: event,
                container: containerRef.current
            });
        }

    }, [event]);

    return (
        <WithWrapper classNameArray={classNameArray} event={event}>
            {
                hasImages &&
                <StecDiv
                    className='stec-grid-event-background-image'
                    style={getImageStyle(images[0])}
                    onClick={beforeOnActive}>
                    <EventTags event={event} />
                </StecDiv>
            }

            <StecDiv ref={containerRef} className='stec-grid-event-container' onClick={beforeOnActive}>

                {!hasImages && <EventTags event={event} />}

                <StecDiv className='stec-grid-event-container-wrapper'>

                    {theThumbnail}

                    <StecDiv className='stec-grid-event-title'>{eventTitle}</StecDiv>

                    {
                        event.short_description &&
                        <StecDiv className='stec-grid-event-description'
                            dangerouslySetInnerHTML={{ __html: event.short_description }} />
                    }

                    {displayCounter && <EventCounterSmall event={event} style={{ marginTop: 20 }} />}

                </StecDiv>

                {
                    nfoArray.map((item, i) => {
                        /* @since 5.1.1 changed item?.style to item.style */
                        return <StecDiv style={item.style} className='stec-grid-event-nfo' key={i}>
                            {item.prefix}
                            <StecSpan>{item.content}</StecSpan>
                        </StecDiv>
                    })
                }
            </StecDiv>

            <StecDiv className='stec-grid-event-aside-buttons'>
            </StecDiv>

        </WithWrapper>
    )
}

export default GridEvent