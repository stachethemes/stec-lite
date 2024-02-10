import { StecDiv, StecInputCheckBox, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import Button from './Button';
import LightModal from './LightModal';
import Tag from './Tag';
import Thumbnail from './Thumbnail';

const SelectControl = (props) => {

    return <StecInputCheckBox key={'item-checkbox'} hint={props.checkHint} checked={props.checked} onChange={() => {
        props.onClick(props.itemId);
    }} />

}

const ButtonControls = (props) => {

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
                title={confirmYesAction.current.message || __('Are you sure you want to delete this item?', 'stachethemes_event_calendar_lite')}
                buttons={
                    [
                        <Button key='delete' className='red' label={__('Delete', 'stachethemes_event_calendar_lite')} onClick={() => {
                            if (confirmYesAction.current) {
                                confirmYesAction.current.onClick(confirmYesAction.current.id);
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

            <StecDiv className='stec-list-manager-item-controls'>

                {props.controls.map((control) => {

                    if (['select-item', 'title'].includes(control.id)) {
                        return '';
                    }

                    return (
                        <Button key={control.id} className={control.color} label={[control.icon, control.label]} onClick={() => {

                            if (['delete', 'empty-calendar'].includes(control.id)) {
                                confirmYesAction.current = {
                                    onClick: control.onClick,
                                    id: props.id,
                                    message: control.id === 'empty-calendar' ?
                                        __('Are you use you want to delete all events from this calendar', 'stachethemes_event_calendar_lite') : false
                                };
                                setConfirmModalOpen(true);
                            } else {
                                control.onClick(props.id)
                            }


                        }} />
                    )
                })}

            </StecDiv>
        </>
    )
}

const ListManagerItem = (props) => {

    return (
        <StecDiv className='stec-list-manager-item'>

            <StecDiv>

                {props.controls.map((control) => {
                    if ('select-item' === control.id) {
                        return <SelectControl key={control.id}
                            itemId={props.id}
                            onClick={control.onClick}
                            checked={props.checked}
                            checkHint={props.checkHint}
                        />
                    }
                })}

                <Thumbnail {...props.thumbnail} />

                <StecDiv>

                    {props.tags && props.tags.map((tag) => {
                        return <Tag key={tag.id} title={tag.title} label={tag.label} backgroundColor={tag.color} />
                    })}

                    <StecSpan className='stec-list-manager-item-title' onClick={() => {

                        const titleControl = props.controls.filter((filterControl) => {
                            return filterControl.id === 'title'
                        });

                        if (titleControl.length > 0) {
                            titleControl[0].onClick(props.id)
                        } else {
                            return false;
                        }

                    }}>{props.title}</StecSpan>

                    {props.itemProps && <>
                        <br />
                        {
                            props.itemProps.map(itemProp => {
                                return (
                                    <StecDiv key={itemProp.id} className='stec-list-manager-item-prop'>
                                        {itemProp.icon && <i className={itemProp.icon} />}
                                        {itemProp.text}
                                    </StecDiv>
                                )
                            })
                        }
                    </>}

                    {props.description && <>
                        <br />
                        <StecSpan className='stec-list-manager-item-description'>{props.description}</StecSpan>
                    </>}

                </StecDiv>

            </StecDiv>

            <ButtonControls {...props} />

        </StecDiv>
    )
};

export default ListManagerItem