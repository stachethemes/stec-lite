import React from 'react';
import { createRoot } from '@wordpress/element';
import LazyEventsList from './LazyEventsList';
import AjaxNonce from '@Stec/JS/AjaxNonce.js';

if (typeof window.stecEventsListInstances !== 'undefined' && Array.isArray(window.stecEventsListInstances)) {

    window.stecEventsListInstances.forEach(instanceParams => {

        const container = document.getElementById(instanceParams.id);
        const root = createRoot(container);
        const App = (
            <React.StrictMode>
                <AjaxNonce>
                    <LazyEventsList {...instanceParams} />
                </AjaxNonce>
            </React.StrictMode>
        )

        root.render(App);

    });

}