import React from "react";
const Calendar = React.lazy(() => import(/* webpackChunkName: "calendar/calendar" */ "@Stec/JS/calendar/Calendar.js"));

function LazyCalendar({ settingsAtts }) {

    return (
        <Calendar settingsAtts={settingsAtts} />
    )
}

export default LazyCalendar