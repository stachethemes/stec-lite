import Button from '@Stec/CommonComponents/Button';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import MapModal from './MapModal';

const FindOnMap = ({ coordinates, onChange }) => {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <MapModal
                isOpen={modalOpen}
                coordinates={coordinates}
                onChange={onChange}
                onClose={() => {
                    setModalOpen(false);
                }} />

            <Button
                className='blue'
                label={[<i key='icon' className='fa-solid fa-map-marked-alt' />,
                __('Find on Map', 'stec')]}
                onClick={() => {
                    setModalOpen(true);
                }} />
        </>
    )
}

export default FindOnMap