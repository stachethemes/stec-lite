import React, { Suspense } from "react";
const EventsSlider = React.lazy(() => import(/* webpackChunkName: "widgets/events-slider/lazy-events-slider" */ "./EventsSlider"));

function Fallback() {
    return '';
}

function LazyEventsSlider(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <EventsSlider {...props} />
        </Suspense>
    )
}

export default LazyEventsSlider