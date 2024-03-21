import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const Osm = ({
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

            const mapInstance = window.L.map(container, {
                zoomControl: false,

            });

            const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ['&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', '<a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy">Privacy Policy</a>'].join(' | ')
            });

            mapInstance.addLayer(tileLayer);

            mapInstance.setView([
                51.505,
                -0.09
            ], 2);

            setMap(mapInstance);

        }

        return () => {
            if (map) {
                map.remove();
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
                        map.setView([lat, lon], 15);
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

        // * Initial marker if coordinates are set
        if (!marker && coordinates) {

            try {

                const coordinatesArray = coordinates.split(',');
                const lat = parseFloat(coordinatesArray[0]);
                const lon = parseFloat(coordinatesArray[1]);

                const newMarker = window.L.marker([lat, lon]).addTo(map);

                setMarker(newMarker);

                map.setView([lat, lon], 15);

            } catch (e) {

                // ...
            }


        }

        const addPin = (e) => {

            if (marker) {
                marker.remove();
            }

            const newMarker = window.L.marker(e.latlng).addTo(map);

            setMarker(newMarker);
        }

        map.on('click', addPin);

        return () => {
            map.off('click', addPin);
        }

    }, [map, marker, coordinates]);

    // * onCoordinatesChange
    useEffect(() => {

        if (map && marker) {

            const { lat, lng } = marker.getLatLng();

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

export default Osm