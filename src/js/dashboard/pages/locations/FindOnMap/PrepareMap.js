import { useRequestGoogleMapsLib, useRequestOpenStreetMapLib } from '@Stec/JS/calendar/hooks';
import React from 'react';

const PrepareGoogleMap = ({ children }) => {

    const ready = useRequestGoogleMapsLib();

    if (!ready) {
        return null;
    }

    return children;

}

const PrepareOsm = ({ children }) => {

    const ready = useRequestOpenStreetMapLib();

    if (!ready) {
        return null;
    }

    return children;

}

const PrepareMap = ({ mapProvider, children }) => {

    if (mapProvider === 'gmap') {
        return <PrepareGoogleMap>{children}</PrepareGoogleMap>
    }

    return <PrepareOsm>{children}</PrepareOsm>

}

export default PrepareMap