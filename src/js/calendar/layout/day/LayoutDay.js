import PreviewEvents from '@Stec/JS/calendar/common/PreviewEvents';
import { useLayoutEvents } from '@Stec/JS/calendar/hooks';
import '@Stec/LESS/calendar/layout/day/style.less';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

const LayoutDay = () => {

    const [layoutEvents, layoutEventsReady] = useLayoutEvents();

    let events = [];

    if (layoutEventsReady) {
        events = layoutEvents;
    }

    return (
        <StecDiv className='stec-layout-day'>

            <StecDiv className='stec-layout-day-containers'>

                {events.length > 0 && <PreviewEvents events={events} />}

            </StecDiv>

            {
                (layoutEventsReady && events.length <= 0) &&
                <StecDiv className='stec-no-events-found-text'>{__('No events found for this day', 'stachethemes_event_calendar_lite')}</StecDiv>
            }


        </StecDiv>
    )
}

export default LayoutDay