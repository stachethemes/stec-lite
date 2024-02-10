import Button from '@Stec/CommonComponents/Button';
import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import InputText, { UncontrolledDelayedInputText } from '@Stec/CommonComponents/InputText';
import LightModal from '@Stec/CommonComponents/LightModal';
import Loader from '@Stec/CommonComponents/Loader';
import Spacer from '@Stec/CommonComponents/Spacer';
import { useUserData } from '@Stec/JS/dashboard/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneElement, useState } from 'react';

const UserData = ({ userData, onClose, onSelect, applyButtonTitle }) => {

    const { id, user_email, display_name } = userData || {};

    if (!userData) {
        return null;
    }

    return (
        <>

            <InputText
                readOnly={true}
                title={__('User id', 'stachethemes_event_calendar_lite')}
                value={id}
            />

            <Spacer />

            <InputText
                readOnly={true}
                title={__('User display name', 'stachethemes_event_calendar_lite')}
                value={display_name}
            />

            <Spacer />

            <InputText
                readOnly={true}
                title={__('User e-mail', 'stachethemes_event_calendar_lite')}
                value={user_email}
            />

            <Spacer />

            <StecDiv className='stec-light-modal-content-buttons'>

                <Button style={{ width: '100%' }} key='update-author' label={applyButtonTitle} className='green' onClick={() => {
                    onSelect(userData);
                }} />

                <Button style={{ width: '100%' }} key='cancel' label={__('Cancel', 'stachethemes_event_calendar_lite')} className='red' onClick={onClose} />

            </StecDiv>

        </>

    )

}

const NoDataButtons = ({ applyButtonTitle, onClose }) => {
    return (
        <StecDiv className='stec-light-modal-content-buttons'>
            <Button disabled={true} style={{ width: '100%' }} key='update-author' label={applyButtonTitle} className='gray' />
            <Button style={{ width: '100%' }} key='cancel' label={__('Cancel', 'stachethemes_event_calendar_lite')} className='red' onClick={onClose} />
        </StecDiv>
    )
}

const DataHandle = ({
    applyButtonTitle,
    searchValue,
    onSelect,
    onClose
}) => {

    const { data, ready, error } = useUserData({
        s: searchValue
    });

    const noDataButtons = (
        <>

            {(!ready && !error) && <>
                <Spacer />
                <Loader type='small' title={__('Searching...', 'stachethemes_event_calendar_lite')} />
            </>}

            <Spacer />

            <NoDataButtons applyButtonTitle={applyButtonTitle} onClose={onClose} />
        </>
    )

    if (!ready) {
        return noDataButtons;
    }

    if (error) {

        if ('' === searchValue) {
            return noDataButtons;
        }

        const errorMessage = typeof error === 'string' ? error : __('Sorry, something went wrong', 'stachethemes_event_calendar_lite');

        return (
            <>
                <Spacer />
                <FieldTitle text={errorMessage} />
                {noDataButtons}
            </>
        )
    }

    if (!data || !data.length) {

        return (
            <>
                <Spacer />
                <FieldTitle text={__('User not found', 'stachethemes_event_calendar_lite')} />
                {noDataButtons}
            </>
        )


    }

    const userData = data[0];

    return (
        <>
            <Spacer />
            <UserData
                onClose={onClose}
                applyButtonTitle={applyButtonTitle}
                userData={userData}
                onSelect={onSelect}
            />
        </>
    )

}

const SearchUserModal = ({ isOpen, onClose, onSelect, modalTitle, applyButtonTitle }) => {

    const [searchValue, setSearchValue] = useState('');

    return (

        <LightModal
            className='stec-dashboard-light-modal'
            noHeader={true}
            isOpen={isOpen}
            onClose={onClose}
            headerIcon='fa-solid fa-user'
            title={modalTitle}>

            <UncontrolledDelayedInputText
                minLength={0}
                title={__('Search user', 'stachethemes_event_calendar_lite')}
                description={__('Search user by id, name or email', 'stachethemes_event_calendar_lite')}
                defaultValue={searchValue}
                onChange={value => {
                    setSearchValue(value);
                }}
            />

            {
                searchValue &&
                <DataHandle
                    applyButtonTitle={applyButtonTitle}
                    searchValue={searchValue}
                    onClose={onClose}
                    onSelect={onSelect}
                />
            }

            {!searchValue && <>

                <Spacer />

                <NoDataButtons applyButtonTitle={applyButtonTitle} onClose={onClose} />
            </>}

        </LightModal>
    )

}

const DisplayComponent = (props) => {

    if (props.customComponent) {

        return (
            props.customComponent && cloneElement(props.customComponent, {
                onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onClick();
                }
            })
        )
    }

    return (
        <Button
            label={[
                <i key='icon' className='fa-solid fa-search' />,
                <span key='text'>{props.buttonTitle}</span>
            ]}
            className='blue'
            onClick={props.onClick} />
    )

}

export default function SearchUserDetails(props) {

    const canEditAuthor = STEC_VARIABLES.current_user.capability.edit_users === true;
    const [modalOpen, setModalOpen] = useState(false);

    if (!canEditAuthor) {
        return null;
    }

    const buttonTitle = props.buttonTitle || __('Search for user', 'stachethemes_event_calendar_lite');
    const modalTitle = props.modalTitle || __('Search for user', 'stachethemes_event_calendar_lite');
    const applyButtonTitle = props.applyButtonTitle || __('Select user', 'stachethemes_event_calendar_lite');

    return (
        <StecDiv>

            <DisplayComponent
                customComponent={props.customComponent}
                buttonTitle={buttonTitle}
                onClick={() => {
                    setModalOpen(true);
                }} />

            <SearchUserModal
                key={new Date().getTime()}
                modalTitle={modalTitle}
                applyButtonTitle={applyButtonTitle}
                isOpen={modalOpen}
                onClose={(e) => {
                    if (e) {
                        e.stopPropagation();
                    }

                    setModalOpen(false);
                }}

                onSelect={(userData) => {
                    props.onSelect && props.onSelect(userData);
                    setModalOpen(false);
                }}

            />
        </StecDiv>
    )
}
