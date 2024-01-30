import { StecDiv } from '@Stec/WebComponents';
import EventPreview from './EventPreview';
import { Suspense, useEffect, useRef } from 'react';
import { useSettingsAtt, useCalendarScreenTypeValue } from '@Stec/JS/calendar/hooks';
import EventContentSkeleton from '@Stec/JS/calendar/skeletons/EventContentSkeleton';
import EventPreviewSkeleton from '@Stec/JS/calendar/skeletons/EventPreviewSkeleton';
import { getEventPermalink } from '@Stec/JS/helpers';
import Modal from '@Stec/CommonComponents/Modal';
const EventContent = React.lazy(() => import(/* webpackChunkName: "calendar/event/event-content" */ "./EventContent"));

const Preloader = ({ style, preview = true, content = true }) => {

    return (
        <StecDiv style={style}>
            {preview && <EventPreviewSkeleton />}
            {content && <EventContentSkeleton />}
        </StecDiv>
    )

}

const Event = ({ event, active, onActiveToggle, onMouseEnter, forceActive, forceOpenIn = false, noPreviewWhenModal = false, }) => {

    let openEventIn = useSettingsAtt('calendar__open_events_in');
    const autoFocus = useSettingsAtt('calendar__scroll_to_event');
    const screenType = useCalendarScreenTypeValue();
    const eventRef = useRef(false);

    if (forceOpenIn) {
        openEventIn = forceOpenIn;
    }

    useEffect(() => {
        let t;

        if (active && autoFocus && openEventIn === 'calendar' && eventRef.current) {
            t = setTimeout(() => {
                eventRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        return () => {
            clearTimeout(t);
        };
    }, [active, openEventIn, autoFocus, eventRef]);

    switch (openEventIn) {

        case 'single': {

            const eventPermalink = getEventPermalink(event);

            return (
                <StecDiv ref={eventRef} className='stec-event' onMouseEnter={() => {
                    if (onMouseEnter) {
                        onMouseEnter(event);
                    }
                }}>
                    <EventPreview
                        event={event}
                        href={eventPermalink}
                    />
                </StecDiv>
            )

        }

        case 'external': {

            const eventPermalink = getEventPermalink(event);

            let href = '';

            if (event.meta?.external_link?.url) {
                href = event.meta.external_link.url;
            } else {
                href = eventPermalink;
            }

            return (
                <StecDiv ref={eventRef} className='stec-event' onMouseEnter={() => {
                    if (onMouseEnter) {
                        onMouseEnter(event);
                    }
                }}>
                    <EventPreview
                        event={event}
                        href={href}
                    />
                </StecDiv>
            )
        }

        case 'modal': {

            return (

                <StecDiv className='stec-event' onMouseEnter={() => {
                    if (onMouseEnter) {
                        onMouseEnter(event);
                    }
                }}>
                    {
                        false === noPreviewWhenModal &&
                        <EventPreview event={event} forceActive={forceActive} active={active} onToggle={onActiveToggle} />
                    }

                    {active &&
                        <Modal isOpen={active} onClose={onActiveToggle}>
                            <Suspense fallback={
                                <Preloader style={
                                    {
                                        borderRadius: 'var(--stec-corner-smoothing)',
                                        overflow: 'hidden'
                                    }
                                } />
                            }>
                                <StecDiv className={screenType}>
                                    <StecDiv className={'stec-event'}>
                                        <EventPreview event={event} forceActive={forceActive} active={active} onToggle={onActiveToggle} />
                                        <EventContent event={event} />
                                    </StecDiv>
                                </StecDiv>
                            </Suspense>
                        </Modal>
                    }

                </StecDiv >
            )
        }

        default: {

            return (
                <StecDiv ref={eventRef} className='stec-event' onMouseEnter={() => {
                    if (onMouseEnter) {
                        onMouseEnter(event);
                    }
                }}>
                    <EventPreview event={event} forceActive={forceActive} active={active} onToggle={onActiveToggle} />

                    {
                        active &&
                        <Suspense fallback={<Preloader preview={false} />}>
                            <EventContent event={event} />
                        </Suspense>
                    }

                </StecDiv>
            )
        }
    }
};

export default Event