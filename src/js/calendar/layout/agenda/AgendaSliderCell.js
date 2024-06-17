import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { getCellColor } from '@Stec/JS/helpers';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';

const AgendaSliderCell = (props) => {

    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const classNameArray = ['stec-layout-agenda-slider-cell'];
    const cellEvents = [];
    const eventDotsLimit = 3; // starts from 0

    if (props.highlight) {
        classNameArray.push('stec-layout-agenda-slider-cell-highlight');
    }

    if (!props.loading && Array.isArray(props.events) && props.events.length > 0) {
        for (let i = 0; i < Math.min(props.events.length, eventDotsLimit); i++) {
            const event = props.events[i];
            cellEvents.push(<StecSpan key={i} className='stec-layout-agenda-slider-cell-event' style={{
                backgroundColor: getCellColor(event, thumbnailSource)
            }}></StecSpan>);
        }
    }

    if (props?.events?.length - eventDotsLimit > 0) {
        cellEvents.push(<StecSpan key={eventDotsLimit} className='stec-layout-agenda-slider-cell-event' style={{
        }}>
            <StecSpan className='stec-layout-agenda-slider-cell-event-more'>+{props.events.length - eventDotsLimit}</StecSpan>
        </StecSpan>);
    }


    if (props.isActive) {
        classNameArray.push('stec-layout-agenda-slider-cell-active');
    }

    if (props.isToday) {
        classNameArray.push('stec-layout-agenda-slider-cell-today');
    }

    return (
        <StecDiv className={classNameArray.join(' ')}
            onClick={() => {
                props.onCellClick ? props.onCellClick(props.momentDate, props.events) : '';
            }}>

            <StecSpan className='stec-layout-agenda-slider-cell-daylabel'>{props.dayLabel}</StecSpan>
            <StecSpan className='stec-layout-agenda-slider-cell-day'>{props.day}</StecSpan>
            {
                Array.isArray(props.events) && props.events.length > 0 &&
                <StecSpan className='stec-layout-agenda-slider-cell-events'>
                    {cellEvents}
                </StecSpan>
            }
        </StecDiv>

    )
}

export default AgendaSliderCell
