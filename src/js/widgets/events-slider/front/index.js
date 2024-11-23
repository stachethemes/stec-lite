import React from 'react';
import { createRoot } from '@wordpress/element';
import LazyEventsSlider from './LazyEventsSlider';
import AjaxNonce from '@Stec/JS/AjaxNonce';

if (typeof window.stecEventsSliderInstances !== 'undefined' && Array.isArray(window.stecEventsSliderInstances)) {

    window.stecEventsSliderInstances.forEach(instanceParams => {

        const container = document.getElementById(instanceParams.id);
        const root = createRoot(container);
        const App = (
            <React.StrictMode>
                <AjaxNonce>
                    <LazyEventsSlider {...instanceParams} />
                </AjaxNonce>
            </React.StrictMode>
        )

        root.render(App);

    });

}