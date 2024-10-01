import Button from '@Stec/CommonComponents/Button';
import ConfirmButton from '@Stec/CommonComponents/ConfirmButton';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputThumbType } from '@Stec/CommonComponents/InputThumbType';
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
                    title={__('Edit permission', 'stachethemes_event_calendar_lite')}
                    options={permissionsList.filter(item => {
                        return item.value !== 'stec_public';
                    })}
                    defaultValue={postData.current.meta.edit_permission}
                    description={__('Who can edit this category', 'stachethemes_event_calendar_lite')}
                    required={true}
                    errorMessage={__('The edit permission cannot be empty', 'stachethemes_event_calendar_lite')}
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
                    title={__('Use permission', 'stachethemes_event_calendar_lite')}
                    options={permissionsList.filter(item => {
                        return item.value !== 'publish'
                    })}
                    defaultValue={postData.current.meta.use_permission}
                    description={__('Who can submit events to this category', 'stachethemes_event_calendar_lite')}
                    required={true}
                    errorMessage={__('The use permission cannot be empty', 'stachethemes_event_calendar_lite')}
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

    // The form key used for reseting the data
    const [formInstance, setFormInstance] = useState(0);

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // The initial values when creating category
    const categoryDataDefaults = template;

    // The form data content storage
    // All form input values are stored in ref to prevent re-renders of 
    // everything which in turn produces input lag especially on slower machines
    // !!! Uncontrolled state !!!
    const postData = useRef(cloneDeep(props.template ? props.template : categoryDataDefaults));

    // Input refs for the error messages
    const focusFieldsRef = useRef([]);

    // Updates the postData.current and generates new instance key
    const setPostData = (formData, doClone = true) => {
        postData.current = doClone ? cloneDeep(formData) : formData;
        setFormInstance(uniqueId());
    }

    // Resets the form to initial state
    const resetForm = () => {
        setPostData(categoryDataDefaults);
        setWasSubmitted(false);
        toast(__('The form has been reset', 'stachethemes_event_calendar_lite'));
    }

    // Validates the form fields and toast focus error message
    const manualValidation = () => {

        const requiredFields = [
            {
                id: 'name',
                regex: getRegexByType('title'),
                meta: false,
                errorMessage: __('The category must have a name', 'stachethemes_event_calendar_lite'),
            },
            {
                id: 'slug',
                regex: getRegexByType('slug'),
                meta: false,
                errorMessage: __('The category must have a valid slug', 'stachethemes_event_calendar_lite'),
            },
            {
                id: 'use_permission',
                meta: true,
                errorMessage: __('The use permission cannot be empty', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'edit_permission',
                meta: true,
                errorMessage: __('The edit permission cannot be empty', 'stachethemes_event_calendar_lite')
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

    // Updates or Inserts new category
    const onUpsertCategory = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
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

                        // Update or insert
                        if (postData.current.id) {

                            result = await newApiPut({
                                route: 'CATEGORIES',
                                args: postData.current.id,
                                data: postData.current,
                                includeResponseStatus: true,
                                errorMessage: 'auto'
                            });

                        } else {

                            result = await newApiPost({
                                route: 'CATEGORIES',
                                data: postData.current,
                                includeResponseStatus: true,
                                translateErrorCode: {
                                    'term_exists': __('A category with this name already exists', 'stachethemes_event_calendar_lite')
                                },
                                errorMessage: 'auto'
                            });

                        }

                        const { status, data } = result;

                        switch (status) {

                            case 201: {

                                if (props.onCategoryInserted) {
                                    props.onCategoryInserted(data);
                                }


                                setPostData(data);

                                flushApiCache({
                                    group: 'taxonomy-stec_cat'
                                });

                                return resolve(__('Created', 'stachethemes_event_calendar_lite'));
                            }

                            case 200: {

                                if (props.onCategoryInserted) {
                                    props.onCategoryInserted(data);
                                }

                                setPostData(data);

                                flushApiCache({
                                    group: 'taxonomy-stec_cat'
                                });

                                return resolve(__('Updated', 'stachethemes_event_calendar_lite'));

                            }

                        }

                    } catch (e) {

                        return reject(e.message);
                    }

                }

                createItem();

            }),
            {
                loading: __('Saving', 'stachethemes_event_calendar_lite'),

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

    // Delete category
    const deleteCategory = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteItem() {

                    try {

                        const result = await newApiDelete({
                            route: 'CATEGORIES',
                            args: postData.current.id,
                        });

                        if (props.onCategoryDeleted) {
                            props.onCategoryDeleted(postData.current);
                        }

                        const clonePostData = cloneDeep(postData.current);

                        clonePostData.id = '';

                        setPostData(clonePostData, false);

                        flushApiCache({
                            group: 'taxonomy-stec_cat'
                        });

                        return resolve(__('Deleted', 'stachethemes_event_calendar_lite'));

                    } catch (e) {

                        return reject(e.message);
                    }


                }

                deleteItem();

            }),
            {
                loading: __('Deleting', 'stachethemes_event_calendar_lite'),

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
        [<i key='icon' className='fa-solid fa-pen-to-square' />, __('Edit category', 'stachethemes_event_calendar_lite')] :
        [<i key='icon' className='fa-solid fa-plus' />, __('Add new category', 'stachethemes_event_calendar_lite')];

    return (

        <Section title={sectionTitle} key={formInstance}>

            <AuthorControl postData={postData} />

            <Spacer />

            <UncontrolledInputText
                ref={(ref) => focusFieldsRef.current['name'] = ref}
                title={__('Name')}
                defaultValue={postData.current.name}
                placeholder={__('Category name', 'stachethemes_event_calendar_lite')}
                description={__('Category display name')}
                required={true}
                regex={getRegexByType('title')}
                errorMessage={__('The category must have a name', 'stachethemes_event_calendar_lite')}
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
                placeholder={__('Category slug', 'stachethemes_event_calendar_lite')}
                description={__('Leave empty to auto-generate')}
                required={false}
                regex={getRegexByType('slug')}
                errorMessage={__('The category must have a valid slug', 'stachethemes_event_calendar_lite')}
                onChange={value => {
                    postData.current.slug = value;
                }}
                wasSubmitted={wasSubmitted}
            />

            <Spacer />

            <UncontrolledInputColor
                title={__('Color', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.color}
                description={__('Category color', 'stachethemes_event_calendar_lite')}
                onChange={value => {
                    postData.current.meta.color = value;
                }}
            />

            <Spacer />

            <UncontrolledInputThumbType
                title={__('Thumbnail type', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.thumbnail}
                description={__('Thumbnail type for your events. Events can override this value', 'stachethemes_event_calendar_lite')}
                onChange={value => {
                    postData.current.meta.thumbnail = value;
                }}
            />

            <Spacer />

            <PermissionsList postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />

            <Spacer />

            <Button label={postData.current.id ? __('Update', 'stachethemes_event_calendar_lite') : __('Create', 'stachethemes_event_calendar_lite', 0)} className='green' onClick={onUpsertCategory} />
            <Button label={__('Reset form', 'stachethemes_event_calendar_lite')} className='yellow' style={{ marginLeft: 5 }} onClick={resetForm} />
            {postData.current.id && <ConfirmButton label={__('Delete', 'stachethemes_event_calendar_lite')} className='red' style={{ marginLeft: 5 }} onClick={deleteCategory} />}
            <Button label={__('Back', 'stachethemes_event_calendar_lite')} className='blue' style={{ marginLeft: 5 }} onClick={() => {
                // If the term was deleted we better reset the query args
                const resetQuery = postData.current.id ? false : true;
                props.onBack(resetQuery)
            }} />

        </Section>

    )
}

function Upsert() {

    // Obtain setActiveMenu to navigate across pages and the active page params
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
            page: 'categories-list',
            params: {
                initialQueryArgs: queryArgs
            }
        });
    }

    return (

        <>

            <StecDiv className='stec-dashboard-top-nav'>
                <Button className='stcolor stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-home' />, __('Home', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='blue' label={[<i key='icon' className='fa-solid fa-list' />, __('Manage categories', 'stachethemes_event_calendar_lite')]} onClick={goToManageList} />

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