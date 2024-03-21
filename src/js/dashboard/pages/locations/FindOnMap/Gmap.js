import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const Gmap = ({
    coordinates,
    onCoordinatesChange
}) => {

    const [map, setMap] = useState(false);
    const [search, setSearch] = useState('');
    const [marker, setMarker] = useState(false);
    const [loading, setLoading] = useState(false);

    const mapContainer = useRef(null);

    // * Init map
    useEffect(() => {

        if (mapContainer.current === null) {
            return;
        }

        if (map === false) {

            mapContainer.current.innerHTML = '';

            const container = mapContainer.current.appendChild(document.createElement('div'));

            container.style.height = mapContainer.current.clientHeight + 'px';

            const mapInstance = new window.google.maps.Map(mapContainer.current, {
                mapId: `stec-map-${new Date().getTime()}`,
                gestureHandling: 'greedy',
                zoom: 2,
                center: {
                    lat: 51.505,
                    lng: -0.09
                },
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                // * Disable POI
                clickableIcons: false
            });

            setMap(mapInstance);

        }

        return () => {
            if (map) {
                setMap(false);
            }
        }

    }, [map]);

    // * Input search
    useEffect(() => {

        const findCoordinatesBySearch = async (search) => {

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${search}&limit=1`;

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                if (data.length === 0) {
                    return null;
                }

                const item = data[0];
                const { lat, lon } = item;
                return { lat, lon };

            } else {
                return null;
            }
        }

        let t;

        t = setTimeout(async () => {

            if (search.length > 2) {

                setLoading(true);

                const result = await findCoordinatesBySearch(search);

                setLoading(false);

                if (result) {

                    const { lat, lon } = result;

                    if (map) {

                        map.panTo(new window.google.maps.LatLng(lat, lon));
                        map.setZoom(15);

                    }
                } else {
                    toast.error(__('Location not found', 'stachethemes_event_calendar_lite'));
                }

            }

        }, 1000);

        return () => {
            clearTimeout(t);
        }

    }, [map, search]);

    // * Marker
    useEffect(() => {

        if (!map) {
            return;
        }

        const getMarker = async () => {
            return await google.maps.importLibrary('marker');
        }

        const initialMarker = async () => {

            try {

                const { AdvancedMarkerElement } = await getMarker();

                const coordinatesArray = coordinates.split(',');
                const lat = parseFloat(coordinatesArray[0]);
                const lon = parseFloat(coordinatesArray[1]);

                const newMarker = new AdvancedMarkerElement({
                    position: { lat, lng: lon },
                    map,
                });

                setMarker(newMarker);

                map.setCenter({ lat, lng: lon });
                map.setZoom(15);

            } catch (e) {

                // ...
            }

        }

        // * Initial marker if coordinates are set
        if (!marker && coordinates) {
            initialMarker();
        }

        const addPin = async (e) => {

            if (marker) {
                marker.setMap(null);
            }

            const { AdvancedMarkerElement } = await getMarker();

            const newMarker = new AdvancedMarkerElement({
                position: e.latLng,
                map,
            });

            setMarker(newMarker);
        }

        map.addListener('click', addPin);

        return () => {
            google.maps.event.clearListeners(map, 'click');
        }

    }, [map, marker, coordinates]);

    // * onCoordinatesChange
    useEffect(() => {

        if (map && marker) {

            const position = marker.position;

            const { lat, lng } = {
                lat: position.lat,
                lng: position.lng
            }

            onCoordinatesChange(`${lat},${lng}`);

        }

    }, [map, marker, onCoordinatesChange]);

    return (
        <>

            <UncontrolledInputText
                placeholder={__('Search Location', 'stachethemes_event_calendar_lite')}
                className='stec-find-on-map-search'
                value={search}
                onChange={value => {
                    setSearch(value);
                }}
            />

            <StecDiv
                ref={mapContainer}
                style={{
                    opacity: loading ? 0.5 : 1,
                    height: 500
                }}
                className='stec-find-on-map-container'
            />

        </>
    )
}

export default Gmap