import { StecDiv } from '@Stec/WebComponents';

function EventLocationAbout({ event, style }) {
    return (
        <StecDiv style={style} className='stec-event-location-about' dangerouslySetInnerHTML={{ __html: event.location.description }} />
    )
}

export default EventLocationAbout