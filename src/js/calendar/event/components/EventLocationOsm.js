import { useCalendarScreenTypeValue, useRequestOpenStreetMapLib, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getEventThumbnailByType } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { createRoot } from '@wordpress/element';
import { useEffect, useRef, useState } from 'react';

const EventLocationOsm = ({ event, style }) => {

    const osmScriptLoaded = useRequestOpenStreetMapLib();
    const zoom = useSettingsAtt('layouts__map_zoom');
    const [map, setMap] = useState(false);
    const mapContainer = useRef();
    const screenSize = useCalendarScreenTypeValue();
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');

    /**
     * Initialize osm maps
     */
    useEffect(() => {

        const getCoordinatesObject = (coordinatesString) => {
            const locationCoordinatesArray = coordinatesString.split(',');
            const lat = Number(locationCoordinatesArray[0]);
            const lng = Number(locationCoordinatesArray[1]);

            return new window.L.LatLng(lat, lng);
        }

        const getEventMapMarkerIcon = (event) => {

            const StecDivContainer = document.createElement('stec-div');
            const theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);

            createRoot(StecDivContainer).render(theThumbnail);

            return StecDivContainer;
        }

        if (false === osmScriptLoaded) {
            return;
        }

        if (map === false) {

            mapContainer.current.innerHTML = '';

            const divComponentType = true === window.DISABLE_STEC_WEB_COMPONENTS ? 'div' : 'stec-div';

            // Add div element to container via appendChild
            const container = mapContainer.current.appendChild(document.createElement(divComponentType));

            // get map container height
            const parentHeight = mapContainer.current.parentElement.clientHeight;

            // set container height to parentHeight
            container.style.height = parentHeight + 'px';

            const mapInstance = window.L.map(container, {
                fullscreenControl: true, // @see https://github.com/Leaflet/Leaflet.fullscreen
                zoomControl: true
            });

            const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ['&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', '<a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy">Privacy Policy</a>'].join(' | ')
            });

            const coordinates = getCoordinatesObject(event.location.coordinates);

            mapInstance.addLayer(tileLayer);

            mapInstance.setView(coordinates, zoom);

            const markerIcon = new window.L.divIcon({
                className: 'stec-omap-marker-pin',
                html: getEventMapMarkerIcon(event),
                iconSize: [52, 52],
                iconAnchor: [28, 57]
            });

            const marker = window.L.marker(coordinates, {
                icon: markerIcon,
                riseOnHover: true
            });

            marker.addTo(mapInstance);

            setMap(mapInstance);

        }

        return () => {
            if (map) {
                map.remove();
                setMap(false);
            }
        }

    }, [osmScriptLoaded, map, zoom, event, thumbnailSource]);

    // Fixes incorrect map centering
    useEffect(() => {

        if (map) {
            map.invalidateSize(true);
        }

    }, [map, screenSize]);

    return (
        <StecDiv className='stec-event-location-map' ref={mapContainer} style={style}></StecDiv>
    )

}

export default EventLocationOsm
