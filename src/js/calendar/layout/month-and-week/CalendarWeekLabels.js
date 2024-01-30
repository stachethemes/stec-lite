import { useCalendarMoment, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getFirstDayOfWeekInView } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import CalendarWeekDayLabel from './CalendarWeekDayLabel';

const CalendarWeekLabels = ({ layoutType }) => {

    const dowOffest = useSettingsAtt('calendar__dow');
    const momentToday = moment();
    const { safeValue: calendarMomentSafe } = useCalendarMoment();

    // Check if the label is in the current range
    // for month layout you should check if today month is the same as the current active month
    // for week layout you should check if today week is the same as the current active week
    // layoutType is expected to be 'week' or 'month';

    const isTodayMonthOrWeek = momentToday.isSame(calendarMomentSafe, layoutType);
    const monthWeekDays = [];

    const initialWeekMoment = getFirstDayOfWeekInView(calendarMomentSafe, dowOffest);

    for (let i = 0; i < 7; i++) {

        const dayIndex = initialWeekMoment.day();
        const isToday = isTodayMonthOrWeek && dayIndex === momentToday.day();

        monthWeekDays.push({
            dayIndex: dayIndex,
            isToday: isToday
        });

        initialWeekMoment.add(1, 'day');

    }

    return (
        <StecDiv className='stec-calendar-week-labels'>
            {monthWeekDays.map(item => {
                return <CalendarWeekDayLabel key={item.dayIndex} dayIndex={item.dayIndex} isToday={item.isToday} />
            })}
        </StecDiv>
    )
}

export default CalendarWeekLabels
