import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Button from './Button';
import LightModal from './LightModal';

/**
 * A button that opens a confirmation modal before executing the onClick function
 * Uses LightModal and Button components
 * Works only with onClick prop
 * Will not work if href prop is passed
 */
const ConfirmButton = (props) => {

    const [modalOpen, setModalOpen] = useState(false);

    const clickProp = props.onClick;
    const propsWithoutClick = { ...props };
    delete propsWithoutClick.onClick;

    return <>

        <LightModal
            isOpen={modalOpen}
            onClose={(e) => {
                e.stopPropagation();
                setModalOpen(false);
            }}
            headerIcon='fa-solid fa-triangle-exclamation'
            title={props.promptText || __('Are you sure you want to delete this item?', 'stachethemes_event_calendar_lite')}
            buttons={
                [

                    <Button key='proceed' className='red' label={props.yesLabel || __('Delete', 'stachethemes_event_calendar_lite')} onClick={() => {
                        setModalOpen(false);
                        clickProp();
                    }} />,

                    <Button key='cancel' className='yellow' label={props.noLabel || __('Cancel', 'stachethemes_event_calendar_lite')} onClick={() => {
                        setModalOpen(false);
                    }} />
                ]
            }
        />

        <Button {...propsWithoutClick} onClick={() => {
            setModalOpen(true);
        }} />

    </>
}

export default ConfirmButton
