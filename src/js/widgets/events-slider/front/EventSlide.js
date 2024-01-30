import { StecDiv } from '@Stec/WebComponents'
import EventSlideBoxGrid from './EventSlideBoxGrid';

function EventSlide({ event, widgetProps }) {

    return (
        <StecDiv className='stec-widget-events-slider-event-slide'>
            <EventSlideBoxGrid event={event} widgetProps={widgetProps} />
        </StecDiv>
    )
}

export default EventSlide