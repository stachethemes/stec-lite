import React, { Suspense } from "react";
const EventsList = React.lazy(() => import(/* webpackChunkName: "widgets/events-list/lazy-events-list" */ "./EventsList"));

function Fallback() {
    return '';
}

function LazyEventsList(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <EventsList {...props} />
        </Suspense>
    )
}

export default LazyEventsList