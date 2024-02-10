import { StecDiv, StecInputCheckBox } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import Button from './Button';
import LightModal from './LightModal';

const CheckboxControl = (props) => {

    return (
        <StecDiv className='stec-list-manager-top-control-checkbox' onClick={props.onClick} style={props.style}>
            <StecInputCheckBox checked={props.checked} onClick={props.onClick} />
            {props.label}
        </StecDiv>
    );
}

function ListManagerTopControl(props) {

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const confirmYesAction = useRef(false);

    return (
        <>

            <LightModal
                isOpen={confirmModalOpen}
                onClose={(e) => {
                    e.stopPropagation();
                    setConfirmModalOpen(false);
                }}
                headerIcon='fa-solid fa-triangle-exclamation'
                title={__('Are you sure you want to delete the selected items?', 'stachethemes_event_calendar_lite')}
                buttons={
                    [
                        <Button key='delete' className='red' label={__('Delete', 'stachethemes_event_calendar_lite')} onClick={() => {
                            if (confirmYesAction.current) {
                                confirmYesAction.current.onClick();
                                setConfirmModalOpen(false);
                            }
                        }} />,
                        <Button key='cancel' className='yellow' label={__('Cancel', 'stachethemes_event_calendar_lite')} onClick={() => {
                            confirmYesAction.current = false;
                            setConfirmModalOpen(false);
                        }} />,
                    ]
                }
            />
            <StecDiv className='stec-list-manager-top-control'>

                {props.controls.map(control => {

                    if ('checkbox' === control.type) {
                        return <CheckboxControl key={control.id} {...control} />
                    }

                    return (
                        <StecDiv key={control.id} className={`stec-list-manager-top-control-button ${control.color}`} onClick={() => {

                            if (control.id === 'delete') {

                                if (control.id === 'delete') {
                                    confirmYesAction.current = {
                                        onClick: control.onClick,
                                    };
                                    setConfirmModalOpen(true);
                                } else {
                                    control.onClick(props.id)
                                }

                            } else {
                                control.onClick();
                            }


                        }}>
                            {control.label}
                        </StecDiv>
                    );

                })}


            </StecDiv>
        </>
    )
}

export default ListManagerTopControl