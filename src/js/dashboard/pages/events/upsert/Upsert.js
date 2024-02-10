import Button from '@Stec/CommonComponents/Button';
import ConfirmButton from '@Stec/CommonComponents/ConfirmButton';
import PageHeading from '@Stec/CommonComponents/PageHeading';
import SideNavigation from '@Stec/CommonComponents/SideNavigation';
import Spacer from '@Stec/CommonComponents/Spacer';
import { newApiDelete, newApiPost, newApiPut } from '@Stec/JS/api';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks';
import { canModerateCalendar, getRegexByType } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep, uniqueId } from 'lodash';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import About from './tabs/About';
import Attachments from './tabs/Attachments';
import General from './tabs/General';
import Guests from './tabs/Guests';
import Introduction from './tabs/Introduction';
import Location from './tabs/Location';
import Organizers from './tabs/Organizers';
import PublicHealth from './tabs/PublicHealth';
import Schedule from './tabs/Schedule';
import tabsList from './tabsList';
import template from './template';

const CurrentTabComponent = (props) => {

    switch (props.id) {

        case 'general': {
            return <General {...props} />
        }

        case 'introduction': {
            return <Introduction {...props} />
        }

        case 'schedule': {
            return <Schedule {...props} />
        }

        case 'location': {
            return <Location {...props} />
        }

        case 'organizers': {
            return <Organizers {...props} />
        }

        case 'guests': {
            return <Guests {...props} />
        }

        case 'attachments': {
            return <Attachments {...props} />
        }

        case 'public-health': {
            return <PublicHealth {...props} />
        }

        case 'about': {
            return <About {...props} />
        }

        default: {
            return '';
        }
    }

}

const UpsertContent = (props) => {

    const initialTtabsList = cloneDeep(tabsList);

    const [tabs, setTabs] = useState(initialTtabsList);

    const componentId = tabs.filter(item => item.active === true)[0].id;

    return (
        <StecDiv className='stec-dashboard-upsert-event-wrapper'>

            <SideNavigation items={tabs} setItems={setTabs} />

            <StecDiv className='stec-dashboard-upsert-event-component-container'>
                <CurrentTabComponent
                    id={componentId}
                    wasSubmitted={props.wasSubmitted}
                    postData={props.postData}
                    focusFieldsRef={props.focusFieldsRef}
                    onCalendarChange={props.onCalendarChange}
                />
                <Spacer />
                {props.formButtons()}
            </StecDiv>

        </StecDiv>
    )

}

function Upsert() {

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // Obtain this page params and get setActiveMenu to navigate across pages
    const { activeMenuParams: params, setActiveMenu } = useDashboardMenu();

    // The event default object values
    const eventDataDefaults = template;

    // The form data content storage
    // All form input values are stored in ref to prevent re-renders of 
    // everything which in turn produces input lag especially on slower machines
    // !!! Uncontrolled state !!!
    const postData = useRef(cloneDeep(params.template ? params.template : eventDataDefaults));

    const [selectedCalendar, setSelectedCalendar] = useState(postData?.current?.stec_cal[0]);

    // Input refs for the error messages
    const focusFieldsRef = useRef([]);

    // The form key used for reseting the data
    const [formInstance, setFormInstance] = useState(0);

    // Whether submit was initiated
    const [wasSubmitted, setWasSubmitted] = useState(false);

    const goToManageList = () => {

        // manageListQueryArgs is defined in ManageEvents.js on setActiveMenu
        let queryArgs = params.manageListQueryArgs || null;

        // If the event was deleted we better reset the query args
        // since the page may no longer exists
        if (!postData.current.id) {
            queryArgs = null;
        }

        setActiveMenu({
            page: params.isArchivePage ? 'events-archive' : 'events-list',
            params: {
                initialQueryArgs: queryArgs
            }
        });
    }

    // Delete event
    const deleteEvent = () => {

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
                            route: 'EVENTS',
                            args: postData.current.id,
                            errorMessage: 'auto'
                        });

                        const clonePostData = cloneDeep(postData.current);

                        delete clonePostData.id;

                        setPostData(clonePostData, false);

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

    // Updates the postData.current and generates new instance key
    // Somewhat simulates setState
    const setPostData = (formData, doClone = true) => {
        postData.current = doClone ? cloneDeep(formData) : formData;
        setFormInstance(uniqueId());
    }

    // Validates the form fields and toast focus error message
    const manualValidation = () => {

        const requiredFields = [
            {
                id: 'title',
                regex: getRegexByType('title'),
                meta: false,
                errorMessage: __('The event must have a title', 'stachethemes_event_calendar_lite'),
            },
            {
                id: 'slug',
                regex: getRegexByType('slug'),
                meta: false,
                errorMessage: __('The event must have a valid slug', 'stachethemes_event_calendar_lite'),
            },
            {
                id: 'stec_cal',
                meta: false,
                errorMessage: __('The event must have a calendar', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'start_date',
                regex: getRegexByType('start_date'),
                meta: true,
                errorMessage: __('Event must have a start date', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'end_date',
                regex: getRegexByType('end_date'),
                meta: true,
                errorMessage: __('Event must have an end date', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'timezone',
                meta: true,
                errorMessage: __('The event must have a timezone', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'read_permission',
                meta: true,
                errorMessage: __('The read permission cannot be empty', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'edit_permission',
                meta: true,
                errorMessage: __('The edit permission cannot be empty', 'stachethemes_event_calendar_lite')
            }
        ]

        for (let key in requiredFields) {

            const field = requiredFields[key];
            let value = field.meta ? postData.current.meta[field.id] : postData.current[field.id];

            if (field.id === 'title') {
                value = value.raw;
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

        // Check if start date is before end date
        if (moment(postData.current.meta.start_date).isAfter(postData.current.meta.end_date)) {

            if (focusFieldsRef.current['start_date']) {
                focusFieldsRef.current['start_date'].focus();
            }

            toast.error(__('Start date must be before end date', 'stachethemes_event_calendar_lite'));

            return false;
        }


        return true;
    }

    const onUpsertEvent = () => {

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

                        let submitData = cloneDeep(postData.current);

                        if (submitData.id) {

                            result = await newApiPut({
                                route: 'EVENTS',
                                args: submitData.id,
                                data: submitData,
                                includeResponseStatus: true,
                                errorMessage: 'auto'
                            });

                        } else {

                            result = await newApiPost({
                                route: 'EVENTS',
                                data: submitData,
                                includeResponseStatus: true,
                                errorMessage: 'auto'
                            });

                        }

                        const { status, data } = result;

                        switch (status) {

                            case 201: {

                                setPostData(data);

                                return resolve(__('Created', 'stachethemes_event_calendar_lite'));
                            }

                            case 200: {

                                setPostData(data);

                                return resolve(__('Updated', 'stachethemes_event_calendar_lite'));

                            }

                            default: {

                                return reject(__(`Sorry, something went wrong`, 'stachethemes_event_calendar_lite'))
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

    const resetForm = () => {
        setPostData(eventDataDefaults);
        setWasSubmitted(false);
        toast(__('The form has been reset', 'stachethemes_event_calendar_lite'));
    }

    const isEdit = postData.current.id || false;

    const moderateCalendar = canModerateCalendar(selectedCalendar);

    return (

        <>

            <StecDiv className='stec-dashboard-top-nav'>

                <Button className='yellow stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-house' />, __('Home', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='blue' label={[<i key='icon' className='fa-solid fa-list' />, __('Manage events', 'stachethemes_event_calendar_lite')]} onClick={goToManageList} />

            </StecDiv>

            <PageHeading label={isEdit ?
                [<i key='icon' className='fa-solid fa-pen-to-square' />, __('Edit event', 'stachethemes_event_calendar_lite')] :
                [<i key='icon' className='fa-solid fa-plus' />, __('Add new event', 'stachethemes_event_calendar_lite')]} />

            <UpsertContent
                key={formInstance}
                wasSubmitted={wasSubmitted}
                postData={postData}
                focusFieldsRef={focusFieldsRef}
                onCalendarChange={(value) => {
                    setSelectedCalendar(value);
                }}
                formButtons={() => {
                    return (
                        <>
                            <Button style={{marginRight: 5}} label={isEdit ? (moderateCalendar && postData.current.meta.approved === 0 ? __('Approve', 'stachethemes_event_calendar_lite') : __('Update', 'stachethemes_event_calendar_lite', 0)) : __('Create', 'stachethemes_event_calendar_lite', 1)} className='green' onClick={onUpsertEvent} />
                            <Button label={__('Reset form', 'stachethemes_event_calendar_lite')} className='yellow' style={{ marginRight: 5 }} onClick={resetForm} />
                            {postData.current.id && <ConfirmButton label={__('Delete', 'stachethemes_event_calendar_lite')} className='red' style={{ marginRight: 5 }} onClick={deleteEvent} />}
                            <Button label={__('Back', 'stachethemes_event_calendar_lite')} className='blue' onClick={goToManageList} />
                        </>
                    )
                }}
            />
        </>
    )
}

export default Upsert