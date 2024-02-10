import Button from '@Stec/CommonComponents/Button';
import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import Flexbox from '@Stec/CommonComponents/Flexbox';
import InputText, { UncontrolledDelayedInputText } from '@Stec/CommonComponents/InputText';
import LightModal from '@Stec/CommonComponents/LightModal';
import Loader from '@Stec/CommonComponents/Loader';
import Spacer from '@Stec/CommonComponents/Spacer';
import { useUserData } from '@Stec/JS/dashboard/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const AuthorData = ({ userData, setEditMode, setAuthorId }) => {

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

                <Button style={{ width: '100%' }} key='update-author' label={__('Change author', 'stachethemes_event_calendar_lite')} className='green' onClick={() => {
                    setAuthorId(parseInt(id, 10));
                    setEditMode(false);
                    toast(__('Author updated', 'stachethemes_event_calendar_lite'));
                }} />

                <Button style={{ width: '100%' }} key='cancel' label={__('Cancel', 'stachethemes_event_calendar_lite')} className='red' onClick={() => {
                    setEditMode(false);
                }} />

            </StecDiv>

        </>

    )

}

const DataHandle = ({
    ready,
    error,
    searchValue,
    data,
    setAuthorId,
    setEditMode
}) => {

    const noDataButtons = (
        <>

            {(!ready && !error) && <>
                <Spacer />
                <Loader type='small' title={__('Searching...', 'stachethemes_event_calendar_lite')} />
            </>}

            <Spacer />

            <StecDiv className='stec-light-modal-content-buttons'>

                <Button disabled={true} style={{ width: '100%' }} key='update-author' label={__('Change author', 'stachethemes_event_calendar_lite')} className='gray' />

                <Button style={{ width: '100%' }} key='cancel' label={__('Cancel', 'stachethemes_event_calendar_lite')} className='red' onClick={() => {
                    setEditMode(false);
                }} />

            </StecDiv>
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
            <AuthorData
                userData={userData}
                setAuthorId={setAuthorId}
                setEditMode={setEditMode}
            />
        </>
    )

}

const EditAuthorForm = ({ setEditMode, authorId, setAuthorId }) => {

    const [searchValue, setSearchValue] = useState(authorId);

    const { data, ready, error } = useUserData({
        s: searchValue
    });

    return (

        <LightModal
            className='stec-dashboard-light-modal'
            noHeader={true}
            isOpen={true}
            onClose={(e) => {
                e.stopPropagation();
                setEditMode(false);
            }}
            headerIcon='fa-solid fa-user'
            title={__('Change author', 'stachethemes_event_calendar_lite')}>

            <UncontrolledDelayedInputText
                minLength={0}
                title={__('Search user', 'stachethemes_event_calendar_lite')}
                description={__('Search user by id, name or email', 'stachethemes_event_calendar_lite')}
                defaultValue={searchValue}
                onChange={value => {
                    setSearchValue(value);
                }}
            />

            <DataHandle
                ready={ready}
                error={error}
                searchValue={searchValue}
                data={data}
                setEditMode={setEditMode}
                setAuthorId={setAuthorId}
            />

        </LightModal>
    )

}

const EditAuthor = ({ authorId, setAuthorId }) => {

    const [editMode, setEditMode] = useState(false);

    return (
        <>

            <i title={__('Change author', 'stachethemes_event_calendar_lite')} className='stec-dashboard-change-author-side-button fa-solid fa-user-pen' onClick={() => {
                setEditMode((state) => !state);
            }} />

            {
                editMode && <EditAuthorForm setEditMode={setEditMode} authorId={authorId} setAuthorId={setAuthorId} />
            }

        </>
    )

}

/**
 * This is a shared component for both event and taxonomy author change
 */
export default function AuthorControl({ postData }) {

    const canEditAuthor = STEC_VARIABLES.current_user.capability.edit_users === true
    const [authorId, setAuthorId] = useState(postData.current.meta.author);

    useEffect(() => {

        if (isNumber(authorId) && authorId !== postData.current.meta.author) {
            postData.current.meta.author = parseInt(authorId, 10);
        }

    }, [authorId, postData]);

    if (!isNumber(authorId)) {
        return null;
    }

    return (
        <StecDiv className='stec-dashboard-change-author-control'>

            <FieldTitle text={__('Author user id', 'stachethemes_event_calendar_lite')} />
            <Flexbox style={{ justifyContent: 'space-between' }}>
                <InputText
                    readOnly={true}
                    value={authorId}
                />
                {canEditAuthor && <EditAuthor authorId={authorId} setAuthorId={setAuthorId} />}
            </Flexbox>
            <FieldDescription text={__('Current author user id', 'stachethemes_event_calendar_lite')} />


        </StecDiv>
    )
}
