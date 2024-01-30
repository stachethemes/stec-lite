import React from "react";
import { createRoot } from '@wordpress/element';
import LazySinglePage from '@Stec/JS/pages/single-page/LazySinglePage.js';
import AjaxNonce from '@Stec/JS/AjaxNonce.js';

/**
 * Initialize single page instance
 */
function stecSinglePageInit() {

    if (typeof window.stecSinglePageInstances !== 'undefined' && Array.isArray(window.stecSinglePageInstances)) {

        window.stecSinglePageInstances.forEach(settingsAtts => {

            const container = document.getElementById(settingsAtts.id);

            const root = createRoot(container);
            const App = (
                <React.StrictMode>
                    <AjaxNonce>
                        <LazySinglePage atts={settingsAtts} />
                    </AjaxNonce>
                </React.StrictMode>
            )

            root.render(App);

        });

    }
}

stecSinglePageInit();