import { useRequestGoogleMapsLib, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getGmapOverlayIcon } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef, useState } from 'react';

const EventLocationGmap = ({ event, style }) => {

    const googleMapsScriptLoaded = useRequestGoogleMapsLib();
    const zoom = useSettingsAtt('layouts__map_zoom');
    const [map, setMap] = useState(false);
    const mapContainer = useRef();

    const getCoordinatesObject = (coordinatesString) => {
        const locationCoordinatesArray = coordinatesString.split(',');
        const lat = Number(locationCoordinatesArray[0]);
        const lng = Number(locationCoordinatesArray[1]);
        return { lat: lat, lng: lng };
    }

    /**
     * Initialize gmap maps
     */
    useEffect(() => {

        if (!event.location.coordinates) {
            return false;
        }

        if (false === googleMapsScriptLoaded) {
            return;
        }

        if (map === false) {

            const coordinates = getCoordinatesObject(event.location.coordinates);

            const mapInstance = new window.google.maps.Map(mapContainer.current, {
                zoom: zoom,
                center: coordinates,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                },
                fullscreenControl: false,
                fullscreenControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_RIGHT
                }
            });

            setMap(mapInstance);

            const overlay = getGmapOverlayIcon(event);

            overlay.setMap(mapInstance);

        }


    }, [googleMapsScriptLoaded, map, zoom, event]);


    return (
        <StecDiv className='stec-event-location-map' ref={mapContainer} style={style}></StecDiv>
    )

}

export default EventLocationGmap
