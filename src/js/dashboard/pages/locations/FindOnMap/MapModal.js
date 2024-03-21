import Modal from '@Stec/CommonComponents/Modal';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import React from 'react';
import Gmap from './Gmap';
import Osm from './Osm';
import PrepareMap from './PrepareMap';
import Button from '@Stec/CommonComponents/Button';
import Spacer from '@Stec/CommonComponents/Spacer';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

const MapModal = ({
    coordinates,
    onChange,
    isOpen,
    onClose
}) => {

    const mapProvider = useSettingsAtt('map__type');

    const MapComponent = mapProvider === 'gmap' ? Gmap : Osm;
    let preappliedCoordinates = coordinates;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <StecDiv className='stec-find-on-map'>
                <PrepareMap mapProvider={mapProvider}>
                    <MapComponent coordinates={coordinates} onCoordinatesChange={coordinates => {
                        preappliedCoordinates = coordinates;
                    }} />
                </PrepareMap>

                <Spacer />

                <Button className='green' label={__('Apply', 'stachethemes_event_calendar_lite')} onClick={() => {
                    onChange(preappliedCoordinates);
                    onClose();
                }} />
                <Button className='red' style={{ marginLeft: 6 }} label={__('Cancel', 'stachethemes_event_calendar_lite')} onClick={onClose} />
            </StecDiv>
        </Modal>
    )
}

export default MapModal