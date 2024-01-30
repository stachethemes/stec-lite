import React, { Suspense } from "react";
import { RecoilRoot } from 'recoil';
const Dashboard = React.lazy(() => import(/* webpackChunkName: "dashboard/dashboard" */ "@Stec/JS/dashboard/Dashboard.js"));

/**
 * Lazy loads the calendar dashboard
 * withRecoil - Whether to include own RecoilRoot. When Dashboard is loaded standalone 
 * (meaning not from the calendar) then recoil should be set to true
 */
function LazyDashboard({ withRecoil = false }) {

    return (
        <Suspense fallback={''}>
            {
                true === withRecoil &&
                <RecoilRoot>
                    <Dashboard />
                </RecoilRoot>
            }

            {
                false === withRecoil && <Dashboard />
            }

        </Suspense>
    )
}

export default LazyDashboard