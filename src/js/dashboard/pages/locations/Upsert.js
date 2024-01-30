import Button from '@Stec/CommonComponents/Button';
import ConfirmButton from '@Stec/CommonComponents/ConfirmButton';
import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { InputSelect, UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
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
                        return item.value !== 'stec_public'
                    })}
                    defaultValue={postData.current.meta.edit_permission}
                    description={__('Who can edit this location', 'stec')}
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
                    description={__('Who can add this location to their events', 'stec')}
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

const getLocationCoordinates = async (searchAddress) => {

    let coordinates = false;

    if ('' === searchAddress) {
        return coordinates;
    }

    if (window?.google?.maps?.Geocoder) {

        try {
            const geocoder = new window.google.maps.Geocoder();
            const request = await geocoder.geocode({ 'address': searchAddress });
            coordinates = request.results[0].geometry.location.toString().replace(/\(|\)/gi, '');
        } catch (e) {
            coordinates = false;
        }

    } else {

        try {

            const request = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + searchAddress);
            const result = await request.json();

            if (result.length > 0) {
                coordinates = [result[0].lat, result[0].lon].join(',');
            } else {
                coordinates = false;
            }

        } catch (e) {
            coordinates = false;
        }

    }

    return coordinates;


}

const CoordinatesInput = React.forwardRef((props, ref) => {

    const postData = ref;

    const [fieldKey, setFieldKey] = useState(0);

    const findCoordinates = async () => {

        if (postData.current.meta.address === '' && postData.current.meta.city === '' && postData.current.meta.country === '') {
            toast.error(__('No location provided', 'stec'));
            return;
        }

        const searchAddress = [
            postData.current.meta.address,
            postData.current.meta.postal_code,
            postData.current.meta.state,
            postData.current.meta.city,
            postData.current.meta.country
        ].join(', ');

        const coordinates = await getLocationCoordinates(searchAddress);

        if (false !== coordinates) {

            postData.current.meta.coordinates = coordinates;

            setFieldKey(uniqueId());

            toast.success(__('Coordinates added', 'stec'));
        } else {
            toast.error(__('Unable to obtain coordinates', 'stec'));
        }

    }

    return (
        <>
            <UncontrolledInputText
                key={fieldKey}
                title={__('Coordinates')}
                placeholder={__('Lng, Lat', 'stec')}
                description={__('Location coordinates in decimal format')}
                defaultValue={postData.current.meta.coordinates}
                onChange={value => {

                    postData.current.meta.coordinates = value.replace(/\s/gi, '');
                }}
            />

            <Spacer />

            <Button className='blue' label={[<i key='icon' className='fas fa-map-marked-alt' />, __('Get Coordinates', 'stec')]} onClick={() => {
                findCoordinates();
            }} />
        </>
    )

});

CoordinatesInput.displayName = 'CoordinatesInput';

const LocationTypeForm = React.forwardRef((props, ref) => {

    const postData = ref;

    const [type, setType] = useState(postData.current.meta.type || 'physical');

    const getPhysicalFormFields = () => {
        return (
            <>

                <UncontrolledInputText
                    defaultValue={postData.current.meta.country}
                    title={__('Country', 'stec')}
                    placeholder={__('Country name', 'stec')}
                    onChange={value => {
                        postData.current.meta.country = value;
                    }}
                    description={__('Country', 'stec')}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={postData.current.meta.state}
                    title={__('State/Province', 'stec')}
                    placeholder={__('State/Province', 'stec')}
                    onChange={value => {
                        postData.current.meta.state = value;
                    }}
                    description={__('State or Province if applicable', 'stec')}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={postData.current.meta.city}
                    title={__('City', 'stec')}
                    placeholder={__('City name', 'stec')}
                    onChange={value => {
                        postData.current.meta.city = value;
                    }}
                    description={__('City name if applicable', 'stec')}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={postData.current.meta.postal_code}
                    title={__('Postal code', 'stec')}
                    placeholder={__('Postal code', 'stec')}
                    onChange={value => {
                        postData.current.meta.postal_code = value;
                    }}
                    description={__('Postal code if applicable', 'stec')}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={postData.current.meta.address}
                    title={__('Address', 'stec')}
                    placeholder={__('Location address', 'stec')}
                    onChange={value => {
                        postData.current.meta.address = value;
                    }}
                    description={__('Address', 'stec')}
                />

                <Spacer />

                <CoordinatesInput ref={postData} />

            </>
        );
    }

    const getVirtualFormFields = () => {
        return (
            <>
                <UncontrolledInputText
                    defaultValue={postData.current.meta.address}
                    title={__('Address', 'stec')}
                    placeholder={__('Location address', 'stec')}
                    onChange={value => {
                        postData.current.meta.address = value;
                    }}
                    description={__('Virtual location address (https://...)', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Protected address', 'stec')}
                    description={__('Only logged-in users can view the address', 'stec')}
                    defaultValue={postData.current.meta.protected}
                    onChange={value => {
                        postData.current.meta.protected = value;
                    }}
                />

            </>
        );
    }

    return (
        <>
            <InputSelect
                multiple={false}
                value={type}
                title={__('Type', 'stec')}
                options={[
                    {
                        label: __('Physical location', 'stec'),
                        value: 'physical'
                    },
                    {
                        label: __('Virtual location', 'stec'),
                        value: 'virtual'
                    },
                ]}
                onChange={value => {
                    setType(value);
                    postData.current.meta.type = value;
                }}
                description={__('Choose location type', 'stec')}
            />

            <Spacer />

            {'physical' === type && getPhysicalFormFields()}
            {'virtual' === type && getVirtualFormFields()}
        </>
    );

});

LocationTypeForm.displayName = 'LocationTypeSpecificForm';

export function UpsertForm(props) {

    // Whether submit was initiated
    const [wasSubmitted, setWasSubmitted] = useState(false);

    // The form key used for reseting the data
    const [formInstance, setFormInstance] = useState(0);

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // The initial values when creating location
    const locationDataDefaults = template;

    // The form data content storage
    // All form input values are stored in ref to prevent re-renders of 
    // everything which in turn produces input lag especially on slower machines
    // !!! Uncontrolled state !!!
    const postData = useRef(cloneDeep(props.template ? props.template : locationDataDefaults));

    // Input refs for the error messages
    const focusFieldsRef = useRef([]);

    // Updates the postData.current and generates new instance key
    const setPostData = (formData, doClone = true) => {
        postData.current = doClone ? cloneDeep(formData) : formData;
        setFormInstance(uniqueId());
    }

    // Resets the form to initial state
    const resetForm = () => {
        setPostData(locationDataDefaults);
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
                errorMessage: __('The location must have a name', 'stec'),
            },
            {
                id: 'slug',
                regex: getRegexByType('slug'),
                meta: false,
                errorMessage: __('The location must have a valid slug', 'stec'),
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
            {
                id: 'coordinates',
                regex: getRegexByType('coordinates'),
                meta: true,
                errorMessage: __('The location must have valid coordinates', 'stec'),
                condition: 'physical'
            },

        ]

        for (let key in requiredFields) {

            const field = requiredFields[key];
            const value = field.meta ? postData.current.meta[field.id] : postData.current[field.id];

            // Require coordinates only for physical locations
            if (field.condition && field.condition === 'physical' && postData.current.meta.type !== 'physical') {
                continue;
            }

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

    // Updates or Inserts new location
    const onUpsertLocation = () => {

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
                                route: 'LOCATIONS',
                                args: postData.current.id,
                                data: postData.current,
                                includeResponseStatus: true,
                                errorMessage: 'auto'
                            });

                        } else {

                            result = await newApiPost({
                                route: 'LOCATIONS',
                                data: postData.current,
                                includeResponseStatus: true,
                                translateErrorCode: {
                                    'term_exists': __('A location with this name already exists', 'stec')
                                },
                                errorMessage: 'auto'
                            });

                        }

                        const { status, data } = result;

                        switch (status) {

                            case 201: {

                                if (props.onLocationInserted) {
                                    props.onLocationInserted(data);
                                }

                                setPostData(data);

                                flushApiCache({
                                    group: 'taxonomy-stec_loc'
                                });

                                return resolve(__('Created', 'stec'));
                            }

                            case 200: {

                                setPostData(data);

                                if (props.onLocationInserted) {
                                    props.onLocationInserted(data);
                                }

                                flushApiCache({
                                    group: 'taxonomy-stec_loc'
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

    // Delete location
    const deleteLocation = () => {

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
                            route: 'LOCATIONS',
                            args: postData.current.id,
                        });

                        if (props.onLocationDeleted) {
                            props.onLocationDeleted(postData.current);
                        }

                        const clonePostData = cloneDeep(postData.current);

                        clonePostData.id = '';

                        setPostData(clonePostData, false);

                        flushApiCache({
                            group: 'taxonomy-stec_loc'
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
        [<i key='icon' className='fa-solid fa-pen-to-square' />, __('Edit location', 'stec')] :
        [<i key='icon' className='fa-solid fa-plus' />, __('Add new location', 'stec')];

    return (

        <Section title={sectionTitle} key={formInstance}>

            <AuthorControl postData={postData} />

            <UncontrolledInputText
                ref={(ref) => focusFieldsRef.current['name'] = ref}
                title={__('Name')}
                defaultValue={postData.current.name}
                placeholder={__('Location name', 'stec')}
                description={__('Location name')}
                required={true}
                regex={getRegexByType('title')}
                errorMessage={__('The location must have a name', 'stec')}
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
                placeholder={__('Location slug', 'stec')}
                description={__('Leave empty to auto-generate')}
                required={false}
                regex={getRegexByType('slug')}
                errorMessage={__('The location must have a valid slug', 'stec')}
                onChange={value => {
                    postData.current.slug = value;
                }}
                wasSubmitted={wasSubmitted}
            />

            <Spacer />

            <UncontrolledInputColor
                title={__('Color', 'stec')}
                defaultValue={postData.current.meta.color}
                description={__('Location color', 'stec')}
                onChange={value => {
                    postData.current.meta.color = value;
                }}
            />

            <Spacer />

            <UncontrolledInputTextarea
                title={__('Description', 'stec')}
                description={__('About this location', 'stec')}
                defaultValue={postData.current.description}
                onChange={(value) => {
                    postData.current.description = value;
                }}

            />
            <Spacer />

            <LocationTypeForm ref={postData} wasSubmitted={wasSubmitted} />

            <Spacer />

            <PermissionsList postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />

            <Spacer />

            <Button label={postData.current.id ? __('Update', 'stec') : __('Create', 'stec', 0)} className='green' onClick={onUpsertLocation} />
            <Button label={__('Reset form', 'stec')} className='yellow' style={{ marginLeft: 5 }} onClick={resetForm} />
            {postData.current.id && <ConfirmButton label={__('Delete', 'stec')} className='red' style={{ marginLeft: 5 }} onClick={deleteLocation} />}
            <Button label={__('Back', 'stec')} className='blue' style={{ marginLeft: 5 }} onClick={() => {
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
            page: 'locations-list',
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

                <Button className='blue' label={[<i key='icon' className='fa-solid fa-list' />, __('Manage locations', 'stec')]} onClick={goToManageList} />

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