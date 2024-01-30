import { useCalendarScreenType } from '@Stec/JS/calendar/hooks';
import Layout from '@Stec/JS/calendar/layout/Layout';
import Top from '@Stec/JS/calendar/top/Top';
import toasterOptions from '@Stec/JS/toaster-options';
import '@Stec/LESS/calendar/style.less';
import { StecDiv } from '@Stec/WebComponents';
import React, { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { RecoilRoot } from 'recoil';
import CalendarSetup from './CalendarSetup';

/**
 * The calendar container with already included recoil store
 * Must be called from the <Calendar /> component below
 */
const CalendarContainer = ({ settingsAtts }) => {

    const calendarContainer = useRef();
    const screenType = useCalendarScreenType(calendarContainer);

    // Cast any numeric value found to number
    for (let att in settingsAtts) {

        let value = settingsAtts[att];

        if (typeof value === 'boolean') {
            continue;
        }

        if ('' === value) {
            continue;
        }

        if (!isNaN(value)) {
            value = parseInt(value, 10);
            settingsAtts[att] = value;
        }
    }

    return (
        <StecDiv className={`stec ${screenType}`} ref={calendarContainer}>

            <Toaster {...toasterOptions} />

            <CalendarSetup settingsAtts={settingsAtts}>
                <Top />
                <Layout />  {/* Layout has internal suspense */}
            </CalendarSetup>
        </StecDiv>
    )

}

/**
 * Main Calendar Components (after LazyCalendar.js)
 * This is the very first component of the front Calendar that includes all sub-components
 */
function Calendar({ settingsAtts }) {

    return (
        <RecoilRoot>
            <CalendarContainer settingsAtts={settingsAtts} />
        </RecoilRoot>
    )
}

export default Calendar