import Button from '@Stec/CommonComponents/Button';
import InputText from '@Stec/CommonComponents/InputText';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const InputStartAddess = ({ directionsFrom, setDirectionsFrom }) => {

    const getUserLocation = () => {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(

                (data) => {
                    setDirectionsFrom(`${data.coords.latitude}, ${data.coords.longitude}`)
                },

                (err) => {

                    if (err.code === 1) {
                        toast.error(__('Sorry, you have disabled this site from accessing your location', 'stec'))
                    } else {
                        toast.error(err.message)
                    }
                });
        }

    }

    return (

        <StecDiv className='stec-input-start-address'>

            <InputText
                title={__('Directions', 'stec')}
                placeholder={__('Enter start address', 'stec')}
                value={directionsFrom}
                onChange={value => {
                    setDirectionsFrom(value);
                }} />

            {
                true !== window.STEC_FORCE_DISABLE?.navigator_geoloc &&
                <i className="fa-solid fa-crosshairs" onClick={getUserLocation} title={__('Find my location', 'stec')} />
            }

        </StecDiv>
    )

}

const EventLocationDirections = ({ event, style }) => {

    const mapType = useSettingsAtt('map__type');
    const [directionsFrom, setDirectionsFrom] = useState('');

    return (
        <StecDiv className='stec-event-location-directions' style={style}>

            <InputStartAddess directionsFrom={directionsFrom} setDirectionsFrom={setDirectionsFrom} />

            {
                'osm' === mapType && <Button
                    style={{ width: '100%' }}
                    label={[<i key='icon' className='fa-solid fa-route' />, __('Get directions', 'stec')]}
                    target={'_BLANK'}
                    href={`https://www.openstreetmap.org/directions?from=${directionsFrom}&to=${event.location.coordinates}`}
                />
            }

            {
                'gmap' === mapType && <Button
                    style={{ width: '100%' }}
                    label={[<i key='icon' className='fa-solid fa-route' />, __('Get directions', 'stec')]}
                    target={'_BLANK'}
                    href={`https://www.google.com/maps/dir/${directionsFrom}/${event.location.coordinates}`}
                />
            }


        </StecDiv>
    )

}

export default EventLocationDirections
