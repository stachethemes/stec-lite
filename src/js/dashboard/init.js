import LazyDashboard from '@Stec/JS/dashboard/LazyDashboard.js';
import toasterOptions from '@Stec/JS/toaster-options';
import { createRoot } from '@wordpress/element';
import { Toaster } from 'react-hot-toast';
import React from 'react';

/**
 * Initialize dashboard instances
 */
function stecDashboardInit() {

    if (typeof window.stecDashboardInstances !== 'undefined' && Array.isArray(window.stecDashboardInstances)) {

        window.stecDashboardInstances.forEach(instanceParams => {

            const container = document.getElementById(instanceParams.id);
            const root = createRoot(container);
            const App = (
                <React.StrictMode>
                    <LazyDashboard withRecoil={true} />
                    <Toaster {...toasterOptions} />
                </React.StrictMode>
            )

            root.render(App);

        });

    }
}

document.addEventListener('DOMContentLoaded', function () {
    stecDashboardInit();
});