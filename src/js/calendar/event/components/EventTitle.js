import { StecDiv } from '@Stec/WebComponents';

function EventTitle({ event, style }) {

    return (
        <StecDiv className='stec-event-title' style={style}>{event.title}</StecDiv>
    )
}

export default EventTitle