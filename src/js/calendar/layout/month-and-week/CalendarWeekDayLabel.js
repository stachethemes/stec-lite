
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { getDayLabels } from '@Stec/JS/helpers';

const CalendarWeekDayLabel = React.memo(({ dayIndex, isToday }) => {
    
    const dayLabels = getDayLabels();
    const dayLabelsShort = getDayLabels('short');

    const classNameArray = ['stec-calendar-week-day-label'];

    if (isToday) {
        classNameArray.push('stec-calendar-week-day-label-today');
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>
            <StecSpan className='stec-calendar-week-day-label-full'>{dayLabels[dayIndex]}</StecSpan>
            <StecSpan className='stec-calendar-week-day-label-short'>{dayLabelsShort[dayIndex]}</StecSpan>
        </StecDiv>
    );

});

CalendarWeekDayLabel.displayName = 'CalendarWeekDayLabel';

export default CalendarWeekDayLabel
