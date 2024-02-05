import { StecDiv } from '@Stec/WebComponents';
import CalendarCellEvents from './CalendarCellEvents';

const CalendarCell = (props) => {

    const classNameArray = ['stec-calendar-cell'];

    if (props.isToday) {
        classNameArray.push('stec-calendar-cell-is-today')
    }

    if (props.isActive) {
        classNameArray.push('stec-calendar-cell-is-active')
    }

    if (props.isDiffMonth) {
        classNameArray.push('stec-calendar-cell-is-diff-month')
    }

    return (
        
        <StecDiv className={classNameArray.join(' ')} onClick={props.onClick}>

            <StecDiv className='stec-calendar-cell-label'>
                {props.label}
            </StecDiv>

            <CalendarCellEvents
                cellMoment={props.cellMoment}
                eventsInCell={props.eventsInCell}
                setActiveEventKey={props.setActiveEventKey}
            />

        </StecDiv>
    )
}

export default CalendarCell
