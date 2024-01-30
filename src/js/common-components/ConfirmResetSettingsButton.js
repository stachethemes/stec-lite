import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Button from './Button';
import InputCheckbox from './InputCheckbox';
import LightModal from './LightModal';
import Spacer from './Spacer';

/**
 * Extended version of ConfirmButton that resets the form
 */
const ConfirmResetSettingsButton = (props) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteAllSections, setDeleteAllSections] = useState(false);

    const clickProp = props.onClick;
    const propsWithoutClick = { ...props };
    delete propsWithoutClick.onClick;

    const promptTitle = deleteAllSections ?
        __('Are you sure you want to reset all settings?', 'stec') :
        __('Are you sure you want to reset these settings?', 'stec', 0) 

    return <>

        <LightModal
            isOpen={modalOpen}
            onClose={(e) => {
                e.stopPropagation();
                setModalOpen(false);
            }}
            headerIcon='fa-solid fa-triangle-exclamation'
            title={promptTitle}
            buttons={
                [

                    <Button key='proceed' className='red' label={
                        deleteAllSections ?
                            __('Reset', 'stec') :
                            __('Reset', 'stec', 0)

                    } onClick={() => {
                        setModalOpen(false);
                        clickProp(deleteAllSections ? '' : props.section);
                    }} />,

                    <Button key='cancel' className='yellow' label={__('Cancel', 'stec')} onClick={() => {
                        setModalOpen(false);
                    }} />
                ]
            }
        >
            <InputCheckbox
                title={__('Reset all settings', 'stec')}
                value={deleteAllSections}
                onChange={value => {
                    setDeleteAllSections(value);
                }}
            />

            <Spacer />

        </LightModal>

        <Button {...propsWithoutClick} label={__('Reset to defaults', 'stec')} onClick={() => {
            setModalOpen(true);
        }} />

    </>
}

export default ConfirmResetSettingsButton
