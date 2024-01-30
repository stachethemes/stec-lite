import Button from '@Stec/CommonComponents/Button';
import ConfirmButton from '@Stec/CommonComponents/ConfirmButton';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { UncontrolledInputImages } from '@Stec/CommonComponents/InputImages';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import { UncontrolledInputSocialLinks } from '@Stec/CommonComponents/InputSocialLinks';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { flushApiCache, newApiDelete, newApiPost, newApiPut } from '@Stec/JS/api.js';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks';
import AuthorControl from '@Stec/JS/dashboard/pages/AuthorControl';
import { getRegexByType } from '@Stec/JS/helpers';
import { WithMaybeDisplayPermissions, usePermissions } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep, uniqueId } from 'lodash';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import template from './template';

const PermissionsList = (props) => {

    const { wasSubmitted, focusFieldsRef, postData } = props;

    const { items: permissionsList, ready: permissionsListReady, error: permissionsListError } = usePermissions();

    if (!permissionsListReady || permissionsListError) {
        return null;
    }

    return (
        <>
            <WithMaybeDisplayPermissions type='edit_permission'>

                <Spacer />

                <UncontrolledInputSelect
                    ref={(ref) => focusFieldsRef.current['edit_permission'] = ref}
                    multiple={true}
                    title={__('Edit permission', 'stec')}
                    options={permissionsList.filter(item => {
                        return item.value !== 'stec_public';
                    })}
                    defaultValue={postData.current.meta.edit_permission}
                    description={__('Who can edit this guest', 'stec')}
                    required={true}
                    errorMessage={__('The edit permission cannot be empty', 'stec')}
                    wasSubmitted={wasSubmitted}
                    onChange={value => {
                        postData.current.meta.edit_permission = value;
                    }}
                />

            </WithMaybeDisplayPermissions>

            <WithMaybeDisplayPermissions type='use_permission'>

                <Spacer />

                <UncontrolledInputSelect
                    ref={(ref) => focusFieldsRef.current['use_permission'] = ref}
                    multiple={true}
                    title={__('Use permission', 'stec')}
                    options={permissionsList}
                    defaultValue={postData.current.meta.use_permission}
                    description={__('Who can add this guest to their events', 'stec')}
                    required={true}
                    errorMessage={__('The use permission cannot be empty', 'stec')}
                    wasSubmitted={wasSubmitted}
                    onChange={value => {
                        postData.current.meta.use_permission = value;
                    }}
                />

            </WithMaybeDisplayPermissions>

        </>

    )

}

export function UpsertForm(props) {

    // Whether submit was initiated
    const [wasSubmitted, setWasSubmitted] = useState(false);

    // The form key used for reseting the form data
    const [formInstance, setFormInstance] = useState(0);

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // The initial values when creating guest
    const guestDataDefaults = template;

    // The form data content storage
    // All form input values are stored in ref to prevent re-renders of 
    // everything which in turn produces input lag especially on slower machines
    // !!! Uncontrolled state !!!
    const postData = useRef(cloneDeep(props.template ? props.template : guestDataDefaults));

    // Input refs for the error messages
    const focusFieldsRef = useRef([]);

    // Updates the postData.current and generates new instance key
    const setPostData = (formData, doClone = true) => {
        postData.current = doClone ? cloneDeep(formData) : formData;
        setFormInstance(uniqueId());
    }

    // Resets the form to initial state
    const resetForm = () => {
        setPostData(guestDataDefaults);
        setWasSubmitted(false);
        toast(__('The form has been reset', 'stec'));
    }

    // Validates the form fields and toast focus error message
    const manualValidation = () => {

        const requiredFields = [
            {
                id: 'name',
                regex: getRegexByType('title'),
                meta: false,
                errorMessage: __('The guest must have a name', 'stec'),
            },
            {
                id: 'slug',
                regex: getRegexByType('slug'),
                meta: false,
                errorMessage: __('The guest must have a valid slug', 'stec'),
            },
            {
                id: 'email',
                regex: getRegexByType('email'),
                meta: true,
                errorMessage: __('Invalid email', 'stec'),
            },

            {
                id: 'use_permission',
                meta: true,
                errorMessage: __('The use permission cannot be empty', 'stec')
            },
            {
                id: 'edit_permission',
                meta: true,
                errorMessage: __('The edit permission cannot be empty', 'stec')
            },
        ]

        for (let key in requiredFields) {

            const field = requiredFields[key];
            const value = field.meta ? postData.current.meta[field.id] : postData.current[field.id];

            let valid = true;

            if (field.regex) {

                const regex = new RegExp(field.regex);
                valid = regex.test(value);

            } else {

                if (Array.isArray(value)) {
                    valid = value.length > 0;
                } else {
                    valid = value && '' !== value ? true : false;
                }
            }


            if (false === valid) {

                if (focusFieldsRef.current[field.id]) {
                    focusFieldsRef.current[field.id].focus();
                }

                toast.error(field.errorMessage);

                return false;
            }

        }

        return true;
    }

    // Updates or Inserts new guest
    const onUpsertGuest = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stec'));
            return;
        }

        setWasSubmitted(true);

        if (false === manualValidation()) {
            return false;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function createItem() {

                    try {

                        let result;

                        if (postData.current.id) {

                            result = await newApiPut({
                                route: 'GUESTS',
                                args: postData.current.id,
                                data: postData.current,
                                includeResponseStatus: true,
                                errorMessage: 'auto'
                            });

                        } else {

                            result = await newApiPost({
                                route: 'GUESTS',
                                data: postData.current,
                                includeResponseStatus: true,
                                translateErrorCode: {
                                    'term_exists': __('A guest with this name already exists', 'stec')
                                },
                                errorMessage: 'auto'
                            });

                        }

                        const { status, data } = result;

                        switch (status) {

                            case 201: {

                                if (props.onGuestInserted) {
                                    props.onGuestInserted(data);
                                }


                                setPostData(data);

                                flushApiCache({
                                    group: 'taxonomy-stec_gst'
                                });

                                return resolve(__('Created', 'stec'));
                            }

                            case 200: {

                                if (props.onGuestInserted) {
                                    props.onGuestInserted(data);
                                }

                                setPostData(data);

                                flushApiCache({
                                    group: 'taxonomy-stec_gst'
                                });

                                return resolve(__('Updated', 'stec'));

                            }

                            default: {
                                return reject(__('Sorry, something went wrong', 'stec'));
                            }
                        }

                    } catch (e) {

                        return reject(e.message);
                    }


                }

                createItem();

            }),
            {
                loading: __('Saving', 'stec'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return errorMessage;
                },
            }
        );

    }

    // Delete guest
    const deleteGuest = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stec'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteItem() {

                    try {

                        const result = await newApiDelete({
                            route: 'GUESTS',
                            args: postData.current.id,
                        });

                        if (props.onGuestDeleted) {
                            props.onGuestDeleted(postData.current);
                        }


                        const clonePostData = cloneDeep(postData.current);

                        clonePostData.id = '';

                        setPostData(clonePostData, false);

                        flushApiCache({
                            group: 'taxonomy-stec_gst'
                        });

                        return resolve(__('Deleted', 'stec'));

                    } catch (e) {
                        return reject(e.message);
                    }

                }

                deleteItem();

            }),
            {
                loading: __('Deleting', 'stec'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return errorMessage;
                },
            }
        );
    }

    const sectionTitle = postData.current.id ?
        [<i key='icon' className='fa-solid fa-pen-to-square' />, __('Edit guest', 'stec')] :
        [<i key='icon' className='fa-solid fa-plus' />, __('Add new guest', 'stec')];

    return (

        <Section title={sectionTitle} key={formInstance}>

            <AuthorControl postData={postData} />

            <Spacer />

            <UncontrolledInputImages
                multiple={false}
                defaultValue={postData.current.meta.photo}
                title={__('Photo', 'stec')}
                buttonTitle={__('Add Photo', 'stec')}
                description={__('Add photo for this guest from the WordPress Media Library', 'stec')}
                onChange={(images) => {
                    // Remove dimensions since it does not exist in the schema
                    postData.current.meta.photo = images.map(image => {

                        if (image.dimensions) {
                            delete image.dimensions;
                        }

                        return image;
                    });
                }}
            />

            <Spacer />

            <UncontrolledInputText
                ref={(ref) => focusFieldsRef.current['name'] = ref}
                title={__('Name')}
                defaultValue={postData.current.name}
                placeholder={__('Guest name', 'stec')}
                description={__('Guest display name')}
                required={true}
                regex={getRegexByType('title')}
                errorMessage={__('The guest must have a name', 'stec')}
                wasSubmitted={wasSubmitted}
                onChange={value => {
                    postData.current.name = value;
                }}
            />

            <Spacer />

            <UncontrolledInputText
                ref={(ref) => focusFieldsRef.current['slug'] = ref}
                title={__('Slug')}
                defaultValue={postData.current.slug}
                placeholder={__('Guest slug', 'stec')}
                description={__('Leave empty to auto-generate')}
                required={false}
                regex={getRegexByType('slug')}
                errorMessage={__('The guest must have a valid slug', 'stec')}
                onChange={value => {
                    postData.current.slug = value;
                }}
                wasSubmitted={wasSubmitted}
            />

            <Spacer />

            <UncontrolledInputColor
                title={__('Color', 'stec')}
                defaultValue={postData.current.meta.color}
                description={__('Guest color', 'stec')}
                onChange={value => {
                    postData.current.meta.color = value;
                }}
            />

            <Spacer />

            <UncontrolledInputTextarea
                title={__('Description', 'stec')}
                description={__('About this Guest', 'stec')}
                defaultValue={postData.current.description}
                onChange={(value) => {
                    postData.current.description = value;
                }}

            />
            <Spacer />

            <UncontrolledInputSocialLinks
                title={__('Social Links', 'stec')}
                description={__('Social links like Facebook, Twitter, Instagram...', 'stec')}
                defaultLinks={postData.current.meta.social}
                onChange={(links) => {
                    postData.current.meta.social = links;
                }}
            />


            <Spacer />

            <UncontrolledInputText
                ref={(ref) => focusFieldsRef.current['email'] = ref}
                type='email'
                title={__('Email', 'stec')}
                placeholder={__('Email', 'stec')}
                description={__('Contact email', 'stec')}
                defaultValue={postData.current.meta.email}
                regex={getRegexByType('email')}
                errorMessage={__('Invalid email', 'stec')}
                wasSubmitted={wasSubmitted}
                onChange={value => {
                    postData.current.meta.email = value;
                }}
            />

            <Spacer />

            <PermissionsList postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />

            <Spacer />

            <Button label={postData.current.id ? __('Update', 'stec') : __('Create', 'stec', 0)} className='green' onClick={onUpsertGuest} />
            <Button label={__('Reset form', 'stec')} className='yellow' style={{ marginLeft: 5 }} onClick={resetForm} />

            {postData.current.id && <ConfirmButton label={__('Delete', 'stec')} className='red' style={{ marginLeft: 5 }} onClick={deleteGuest} />}

            <Button label={__('Back', 'stec')} className='blue' style={{ marginLeft: 5 }} onClick={() => {
                // If the term was deleted we better reset the query args
                const resetQuery = postData.current.id ? false : true;
                props.onBack(resetQuery)
            }} />

        </Section>

    )

}

function Upsert() {

    // Obtain this page params and get setActiveMenu to navigate across pages
    const { setActiveMenu, activeMenuParams: params } = useDashboardMenu();

    const goToManageList = (resetQuery) => {

        // manageListQueryArgs is defined in ManageTerms.js on setActiveMenu
        let queryArgs = params.manageListQueryArgs || null;

        // If the term was deleted we better reset the query args
        // since the page may no longer exists
        if (resetQuery) {
            queryArgs = null;
        }

        setActiveMenu({
            page: 'guests-list',
            params: {
                initialQueryArgs: queryArgs
            }
        });
    }

    return (

        <>

            <StecDiv className='stec-dashboard-top-nav'>

                <Button className='yellow stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-home' />, __('Home', 'stec')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='blue' label={[<i key='icon' className='fa-solid fa-list' />, __('Manage guests', 'stec')]} onClick={goToManageList} />

            </StecDiv>

            <UpsertForm
                template={params.template || false}
                onBack={resetQuery => {
                    goToManageList(resetQuery);
                }} />

        </>

    )

}

export default Upsert