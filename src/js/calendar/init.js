import React from "react";
import { createRoot } from '@wordpress/element';
import LazyCalendar from '@Stec/JS/calendar/LazyCalendar.js';
import AjaxNonce from '@Stec/JS/AjaxNonce.js';

/**
 * Initialize calendar instances
 */
function stecCalendarInit() {

    if (typeof window.stecInstances !== 'undefined' && Array.isArray(window.stecInstances)) {

        window.stecInstances.forEach(settingsAtts => {

            const container = document.getElementById(settingsAtts.id);
            const root = createRoot(container);
            const App = (
                <React.StrictMode>
                    <AjaxNonce>
                        <LazyCalendar settingsAtts={settingsAtts} />
                    </AjaxNonce>
                </React.StrictMode>
            )

            root.render(App);

        });

    }
}

stecCalendarInit();