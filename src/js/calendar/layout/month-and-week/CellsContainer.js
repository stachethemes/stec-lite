import PreviewEvents from '@Stec/JS/calendar/common/PreviewEvents';
import { useCalendarMoment, useLayoutEventsCache, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getFirstDayOfMonthInView, getFirstDayOfWeekInView } from '@Stec/JS/helpers';
import Event from '@Stec/JS/calendar/event/Event';
import { useState } from 'react';
import CalendarCell from './CalendarCell';

function CellsContainer({ layoutType }) {

    const [activeEventKey, setActiveEventKey] = useState(false);
    const shouldIncludeSubmitForm = true !== useSettingsAtt('layouts__month_week_es_form_on_top');
    const dowOffset = useSettingsAtt('calendar__dow');
    const { safeValue: calendarMomentSafe } = useCalendarMoment();
    const cacheResetKey = calendarMomentSafe.format('YMD');
    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);
    const [activeCellDate, setActiveCellDate] = useState(false);
    const activeEndWeekMoment = activeCellDate ? getFirstDayOfWeekInView(activeCellDate, dowOffset).add(6, 'days') : false;
    let activeEvent = false;

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
                    setActiveEventKey={setActiveEventKey}
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

    if (layoutEventsReady && activeEventKey) {

        const activeEventKeyInfo = activeEventKey.split('--');
        const dateKey = activeEventKeyInfo[0];
        const eventId = parseInt(activeEventKeyInfo[1], 10);
        const eventStartDate = activeEventKeyInfo[2];
        const dateKeyEvents = layoutEvents[dateKey] ?? [];
        const event = dateKeyEvents.find(item => item.id === eventId && item.meta.start_date === eventStartDate);

        if (event) {
            activeEvent = event;
        }
    }

    return (
        <>
            {getGridCells()}

            {
                !!activeEvent && <Event
                    key={activeEventKey}
                    event={activeEvent}
                    active={true}
                    forceOpenIn={'modal'}
                    noPreviewWhenModal={true} // Prevents display of the preview container in the grid layout
                    onActiveToggle={() => {
                        setActiveEventKey(false);
                    }}
                />
            }

        </>
    )
}

export default CellsContainer