import React, { Suspense } from "react";
const SinglePage = React.lazy(() => import(/* webpackChunkName: "single-page/single" */ "@Stec/JS/pages/single-page/SinglePage.js"));

function LazySinglePageFallback() {
    return '';
}

function LazySinglePage({ atts }) {

    return (
        <Suspense fallback={<LazySinglePageFallback />}>
            <SinglePage atts={atts} />
        </Suspense>
    )
}

export default LazySinglePage