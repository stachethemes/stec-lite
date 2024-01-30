import PreviewEvents from '@Stec/JS/calendar/common/PreviewEvents';
import { useCalendarMoment, useLayoutEventsCache, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getFirstDayOfMonthInView, getFirstDayOfWeekInView } from '@Stec/JS/helpers';
import { useState } from 'react';
import CalendarCell from './CalendarCell';

function CellsContainer({ layoutType }) {

    const shouldIncludeSubmitForm = true !== useSettingsAtt('layouts__month_week_es_form_on_top');
    const dowOffset = useSettingsAtt('calendar__dow');
    const { safeValue: calendarMomentSafe } = useCalendarMoment();
    const cacheResetKey = calendarMomentSafe.format('YMD');
    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);
    const [activeCellDate, setActiveCellDate] = useState(false);
    const activeEndWeekMoment = activeCellDate ? getFirstDayOfWeekInView(activeCellDate, dowOffset).add(6, 'days') : false;

    const getGridCells = () => {

        const monthGridCells = [];
        let cellsCount = 0;
        let cellMomentDateIterator;

        if (layoutType === 'month') {
            cellMomentDateIterator = getFirstDayOfMonthInView(calendarMomentSafe, dowOffset);
            cellsCount = 42;
        }

        if (layoutType === 'week') {
            cellMomentDateIterator = getFirstDayOfWeekInView(calendarMomentSafe, dowOffset);
            cellsCount = 7;
        }


        for (let cellIndex = 1; cellIndex <= cellsCount; cellIndex++) {

            const isToday = moment().format('YMD') === cellMomentDateIterator.format('YMD');
            const isDiffMonth = !calendarMomentSafe.isSame(cellMomentDateIterator, 'month');
            const cellYmdKey = cellMomentDateIterator.format('YYYY-MM-DD');
            const cellEvents = layoutEventsReady ? (layoutEvents[cellYmdKey] || false) : false;
            const cellMoment = moment(cellMomentDateIterator);
            let isActive = false;

            if (activeCellDate) {
                isActive = cellMoment.format('YYYY-MM-DD') === activeCellDate;
            }

            monthGridCells.push(

                <CalendarCell
                    key={cellMoment.format('YMD')}
                    label={cellMoment.format('D')}
                    isToday={isToday}
                    isDiffMonth={isDiffMonth}
                    isActive={isActive}
                    eventsInCell={cellEvents}
                    cellMoment={cellMoment}
                    onClick={() => {

                        const cellDate = cellMoment.format('YYYY-MM-DD');

                        if (cellDate === activeCellDate) {
                            setActiveCellDate(false);
                        } else {
                            setActiveCellDate(cellDate);
                        }

                    }}
                />
            )

            if (activeCellDate && activeEndWeekMoment.isSame(cellMomentDateIterator, 'day')) {

                const activeCellEvents = Array.isArray(layoutEvents[activeCellDate]) ? layoutEvents[activeCellDate] : [];

                monthGridCells.push(
                    <PreviewEvents
                        key={`events-preview-container-${activeCellDate}`}
                        events={activeCellEvents}
                        includeSubmitForm={shouldIncludeSubmitForm}
                        activeDate={moment(activeCellDate).format('YYYY-MM-DD')}
                        sortByFeatured={true}
                    />
                );

            }

            cellMomentDateIterator.add(1, 'day');
        }

        return monthGridCells;
    }

    return (
        getGridCells()
    )
}

export default CellsContainer