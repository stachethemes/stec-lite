import Button from '@Stec/CommonComponents/Button';
import DatePicker from '@Stec/CommonComponents/DatePicker';
import InputCheckbox from '@Stec/CommonComponents/InputCheckbox';
import LightModal from '@Stec/CommonComponents/LightModal';
import ListManager from '@Stec/CommonComponents/ListManager';
import Spacer from '@Stec/CommonComponents/Spacer';
import { newApiDelete, newApiPost, newApiPut } from '@Stec/JS/api.js';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { beautifyDate, canModerateCalendar, getUtcOffset } from '@Stec/JS/helpers';
import { usePostItems } from '@Stec/JS/hooks';
import { __, _x } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ListFilters from './ListFilters';

const DuplicateModal = ({ isOpen, id, onClose, onDuplicate }) => {

    const [isRecurrenceOverride, setRecurrenceOverride] = useState(false);
    const [dateString, setDateString] = useState(moment().format('YYYYMMDD'));

    const dateStringDisplay = moment(dateString).format('YYYY-MM-DD');

    const clearAndClose = () => {
        setRecurrenceOverride(false);
        onClose();
    }

    return (
        <LightModal
            isOpen={isOpen}
            onClose={clearAndClose}
            headerIcon='fa-solid fa-clone'
            title={__('Duplicate event', 'stachethemes_event_calendar_lite')}
            buttons={[
                <Button key='duplicate' className='blue' label={__('Duplicate', 'stachethemes_event_calendar_lite')} onClick={() => {
                    onDuplicate({
                        id: id,
                        override: isRecurrenceOverride,
                        date: dateString
                    });
                }} />,
                <Button key='cancel' className={'red'} label={__('Cancel', 'stachethemes_event_calendar_lite')} onClick={clearAndClose} />,
            ]}>

            <InputCheckbox
                title={__('Recurrence override', 'stachethemes_event_calendar_lite')}
                description={__('Select to use the duplicate as a recurrence override', 'stachethemes_event_calendar_lite')}
                value={isRecurrenceOverride}
                onChange={value => {
                    setRecurrenceOverride(value);
                }} />

            {
                isRecurrenceOverride && <>
                    <Spacer />
                    <DatePicker
                        title={__('Recurrence date', 'stachethemes_event_calendar_lite')}
                        description={__('Select recurrence date', 'stachethemes_event_calendar_lite')}
                        value={dateStringDisplay}
                        includeTime={false}
                        onChange={(date) => {
                            const dateInFormat = moment(date).format('YYYYMMDD');
                            setDateString(dateInFormat);
                        }}
                    />
                </>
            }

            <Spacer />

        </LightModal>
    )

}

const ManageEventsReady = (props) => {

    const { hasItemsRef, resetInstance } = props;

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // active menu dispatcher
    const { activeMenuParams: params, setActiveMenu } = useDashboardMenu();

    const [duplicateModalId, setDuplicateModalId] = useState(false);

    // Initial query args
    const initialQueryArgs = params.initialQueryArgs || {
        page: 1,
        perPage: window.stecFilterManageEventsPerPage || 20,
        permissionType: 'edit_permission',
        includeUnapproved: 1,
        postType: 'stec_event',
        status: props.status
    };

    // Assigns taxonomy query args
    const [postQueryArgs, setPostQueryArgs] = useState(initialQueryArgs);

    // Queries requested events
    const { items, totalPages, ready, error } = usePostItems(postQueryArgs);

    const [checkedItems, setCheckedItems] = useState([]);

    // Approve the event by id
    const approveEvent = (id) => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        const foundEvent = items.find(item => item.id === id);

        if (!foundEvent) {
            toast.error(__('Event not found', 'stachethemes_event_calendar_lite'));
            return;
        }

        const eventSubmitData = cloneDeep(foundEvent);

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function approveItem() {

                    try {

                        const result = await newApiPut({
                            route: 'EVENTS',
                            args: eventSubmitData.id,
                            data: eventSubmitData,
                        });

                        setPostQueryArgs(state => {
                            return {
                                ...state,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Event approved', 'stachethemes_event_calendar_lite'));

                    } catch (e) {

                        return reject(e.message);
                    }


                }

                approveItem();

            }),
            {
                loading: __('Approving', 'stachethemes_event_calendar_lite'),

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

    // Navigates to edit page
    const editEvent = (id) => {

        const editItem = items.filter((filterItem) => {
            return filterItem.id === id;
        })[0];

        setActiveMenu({
            page: 'events-upsert',
            params: {
                template: editItem,
                manageListQueryArgs: { ...postQueryArgs },
                isArchivePage: props.status === 'stec_archived' ? true : false
            }
        });
    }

    // Duplicate event
    const duplicateEvent = (id, args = {
        override: false,
        date: false
    }) => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        const foundEvent = items.find(item => item.id === id);

        if (!foundEvent) {
            toast.error(__('Event not found', 'stachethemes_event_calendar_lite'));
            return;
        }

        const eventDuplicateData = cloneDeep(foundEvent);

        if (args.override) {
            delete eventDuplicateData.id;
            delete eventDuplicateData.title.rendered;
            delete eventDuplicateData.meta.rrule;
            delete eventDuplicateData.meta.exdate;
            eventDuplicateData.meta.recurrence_id = args.date;

            const eventMoment = moment.utc(eventDuplicateData.meta.start_date);
            const ocurrenceMoment = moment.utc(args.date);

            ocurrenceMoment.hours(eventMoment.hours());
            ocurrenceMoment.minutes(eventMoment.minutes());

            const occurenceDiff = ocurrenceMoment.diff(eventMoment, 'hours');

            eventDuplicateData.meta.start_date = moment.utc(eventDuplicateData.meta.start_date)
                .add(occurenceDiff, 'hours').format('YYYY-MM-DD\THH:mm');

            eventDuplicateData.meta.end_date = moment.utc(eventDuplicateData.meta.end_date)
                .add(occurenceDiff, 'hours').format('YYYY-MM-DD\THH:mm');

        } else {
            delete eventDuplicateData.id;
            delete eventDuplicateData.title.rendered;
            delete eventDuplicateData.meta.uid;
        }

        if (!args.override) {
            eventDuplicateData.title.raw = `${eventDuplicateData.title.raw} (duplicate)`;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function duplicateItem() {

                    try {

                        const result = await newApiPost({
                            route: 'EVENTS',
                            data: eventDuplicateData,
                            includeResponseStatus: true
                        });

                        const { status, data } = result;

                        switch (status) {

                            case 201:

                                setPostQueryArgs(state => {
                                    return {
                                        ...state, seed: Date.now()
                                    }
                                });

                                return resolve(__('Duplicated', 'stachethemes_event_calendar_lite'));

                            default:

                                return reject(__(`Sorry, something went wrong`, 'stachethemes_event_calendar_lite'));

                        }

                    } catch (e) {
                        return reject(e.message);
                    }


                }

                duplicateItem();

            }),
            {
                loading: __('Duplicating', 'stachethemes_event_calendar_lite'),

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

    // Delete event by id
    const deleteEvent = (id) => {

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
                            args: id,
                        });

                        setCheckedItems([]);

                        setPostQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
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

    // Bulk deletes selected items (basically loop deletes items)
    const deleteSelectedItems = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        if (checkedItems.length <= 0) {
            return toast.error(__('No items selected', 'stachethemes_event_calendar_lite'));
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function bulkDelete() {

                    try {

                        for await (let id of checkedItems) {

                            const result = await newApiDelete({
                                route: 'EVENTS',
                                args: `${id}?force=true`,
                            });

                        }

                        setCheckedItems([]);

                        setPostQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Items deleted', 'stachethemes_event_calendar_lite'));

                    } catch (e) {
                        return reject(e.message);
                    }

                }

                bulkDelete();
            }),
            {
                loading: __('Deleting items', 'stachethemes_event_calendar_lite'),
                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage
                },
                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage
                },
            }
        );

    }

    // On pagination page change
    const onPageChange = (page) => {
        setCheckedItems([]);
        setPostQueryArgs({
            ...postQueryArgs, page: page
        });
    }

    // Bulk archive selected items 
    const archiveSelectedItems = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        if (checkedItems.length <= 0) {
            return toast.error(__('No items selected', 'stachethemes_event_calendar_lite'));
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function bulkArchive() {

                    try {

                        for await (let id of checkedItems) {

                            const result = await newApiPut({
                                route: 'EVENTS/ARCHIVE',
                                args: `${id}`,
                            });

                        }

                        setCheckedItems([]);

                        setPostQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Items archived', 'stachethemes_event_calendar_lite'));

                    } catch (e) {
                        return reject(e.message);
                    }

                }

                bulkArchive();
            }),
            {
                loading: __('Archiving items', 'stachethemes_event_calendar_lite'),
                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage
                },
                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage
                },
            }
        );

    }

    // Bulk unarchive selected items 
    const unarchiveSelectedItems = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        if (checkedItems.length <= 0) {
            return toast.error(__('No items selected', 'stachethemes_event_calendar_lite'));
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function bulkArchive() {

                    try {

                        for await (let id of checkedItems) {

                            const result = await newApiPut({
                                route: 'EVENTS/UNARCHIVE',
                                args: `${id}`,
                            });

                        }

                        setCheckedItems([]);

                        setPostQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Items unarchived', 'stachethemes_event_calendar_lite'));

                    } catch (e) {
                        return reject(e.message);
                    }

                }

                bulkArchive();
            }),
            {
                loading: __('Unarchiving items', 'stachethemes_event_calendar_lite'),
                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage
                },
                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage
                },
            }
        );

    }

    // List manager top level controls
    const listManagerControls = [
        {
            id: 'select-all',
            label: __('Select all', 'stachethemes_event_calendar_lite'),
            onClick: () => {

                if (checkedItems.length === items.length) {
                    setCheckedItems([]);
                } else {
                    setCheckedItems(items.map(item => item.id));
                }
            },
            type: 'checkbox',
            checked: checkedItems.length > 0 && checkedItems.length === items.length
        },
        {
            id: 'delete',
            color: 'red',
            label: [<i key='icon' className='fa-solid fa-trash' />, __('Delete', 'stachethemes_event_calendar_lite')],
            onClick: () => {
                deleteSelectedItems();
            }
        }
    ];

    if (props.status === 'stec_archived') {

        listManagerControls.push({
            id: 'unarchive',
            color: 'blue',
            label: [<i key='icon' className='fa-solid fa-folder-open' />, __('Unarchive', 'stachethemes_event_calendar_lite')],
            onClick: () => {
                unarchiveSelectedItems();
            }
        });

    } else {

        listManagerControls.push({
            id: 'archive',
            color: 'blue',
            label: [<i key='icon' className='fa-solid fa-box-archive' />, __('Archive', 'stachethemes_event_calendar_lite')],
            onClick: () => {
                archiveSelectedItems();
            }
        });


    }

    // List manager items controls
    const itemControls = [
        {
            id: 'select-item',
            onClick: (itemId) => {
                if (checkedItems.some(id => itemId === id)) {
                    setCheckedItems(checkedItems.filter(id => id !== itemId));
                } else {
                    setCheckedItems([...checkedItems, itemId]);
                }
            },
        },
        {
            id: 'title',
            onClick: (id) => {
                editEvent(id);
            }
        },
        {
            id: 'approve',
            color: 'green',
            icon: <i key='icon' className='fa-solid fa-thumbs-up' />,
            label: __('Approve', 'stachethemes_event_calendar_lite'),
            onClick: (id) => {
                approveEvent(id);
            }
        },
        {
            id: 'view',
            color: 'blue',
            icon: <i key='icon' className='fa-solid fa-eye' />,
            label: __('View', 'stachethemes_event_calendar_lite'),
            onClick: (id) => {

                const foundEvent = items.find(item => item.id === id);
                const permalink = foundEvent.link;

                window.open(permalink, '_blank');

            }
        },
        {
            id: 'duplicate',
            color: 'blue',
            icon: <i key='icon' className='fa-solid fa-clone' />,
            label: __('Duplicate', 'stachethemes_event_calendar_lite'),
            onClick: (id) => {

                const foundEvent = items.find(item => item.id === id);

                if (foundEvent.meta.rrule && !foundEvent.meta.recurrence_id) {
                    setDuplicateModalId(id);
                } else {
                    duplicateEvent(id);
                }
            }
        },
        {
            id: 'edit',
            color: 'blue',
            icon: <i key='icon' className='fa-solid fa-edit' />,
            label: __('Edit', 'stachethemes_event_calendar_lite'),
            onClick: (id) => {
                editEvent(id);
            }
        },
        {
            id: 'delete',
            color: 'red',
            icon: <i key='icon' className='fa-solid fa-trash' />,
            label: __('Delete', 'stachethemes_event_calendar_lite'),
            onClick: (id) => {
                deleteEvent(id);
            }
        }
    ];

    // Convert remind and event date 
    // depending on whether conversion is needed
    const getEventDate = (dateString, eventTimezone) => {

        const showTzOffset = STEC_VARIABLES?.show_tz_offset || false;
        const showInUserTimezone = STEC_VARIABLES?.use_user_tz || false;
        const dateMoment = moment.tz(dateString, eventTimezone);

        if (showInUserTimezone) {
            dateMoment.local();
        }

        let displayDate = beautifyDate(dateMoment, false);

        if (showTzOffset) {

            const displayedTimezone = getUtcOffset(dateMoment);

            displayDate = `${displayDate} (${displayedTimezone})`;
        }

        return displayDate;

    }

    // Get thumbnail data for list manager item
    const getThumbnail = (item) => {

        try {

            return {
                type: item.meta.thumbnail.type,
                icon: item.meta.thumbnail.icon,
                image: item.meta.thumbnail?.image?.[0]?.sizes?.thumbnail,
                backgroundColor: item.meta.color,
                color: '#fff',
                day: 'DD',
                month: 'MMM'
            }

        } catch (e) {

            return {
                type: 'icon',
                icon: 'fa-solid fa-question',
                image: [],
                backgroundColor: '#000',
                color: '#fff',
                day: 'DD',
                month: 'MMM'
            }

        }

    }

    // Map items to fit List manager item props
    const listItems = items.map(item => {

        let tags = [];

        if (0 === item.meta.approved) {
            tags.push({
                id: 'unapproved',
                label: _x('Pending approval','Manage events tag label', 'stachethemes_event_calendar_lite'),
                color: '#ff9933'
            })
        }

        if (item.meta.rrule !== '') {
            tags.push({
                id: 'recurrent',
                label: __('Recurrent', 'stachethemes_event_calendar_lite'),
                title: _x('Recurrent event','Manage events tag title', 'stachethemes_event_calendar_lite'),
                color: '#4285f4'
            })
        }

        if (item.meta.recurrence_id) {
            tags.push({
                id: 'override',
                label: _x('Recurrence override', 'Manage events tag label for recurrence override', 'stachethemes_event_calendar_lite'),
                title: __('Recurrence override', 'stachethemes_event_calendar_lite'),
                color: '#ff9933'
            })
        }

        let description = getEventDate(item.meta.start_date, item.timezone);

        return (
            {
                key: item.id,
                id: item.id,
                title: `${item.title.raw} (#${item.id})`,
                description: description,
                tags: tags,
                thumbnail: getThumbnail(item),

                controls: itemControls.filter(control => {

                    if (control.id === 'duplicate' && item.meta.approved === 0) {
                        return false;
                    }

                    if (control.id === 'approve') {

                        if (item.meta.approved === 0) {
                            return canModerateCalendar(item.stec_cal[0]);
                        }

                        return false;

                    }

                    return true;

                }),

                checked: checkedItems.some(id => item.id === id)
            }
        )
    });

    hasItemsRef.current = items.length > 0;

    return (

        <>

            <DuplicateModal
                isOpen={!!duplicateModalId}
                id={duplicateModalId}
                onClose={() => {
                    setDuplicateModalId(false);
                }} onDuplicate={({ id, override, date }) => {

                    if (!override) {
                        duplicateEvent(id);
                    } else {
                        duplicateEvent(id, {
                            override: override,
                            date: date
                        });
                    }

                    // Close modal
                    setDuplicateModalId(false);

                }} />

            <ListFilters

                postQueryArgs={postQueryArgs}

                onApply={(args) => {

                    setCheckedItems([]);

                    setPostQueryArgs(state => {
                        return {
                            ...state, ...args, page: 1
                        }
                    });

                }} />


            <ListManager
                controls={listManagerControls}
                totalPages={totalPages}
                currentPage={postQueryArgs.page}
                onPageChange={page => {
                    onPageChange(page);
                }}
                items={listItems}
                ready={ready}
            />

        </>
    )


}

function ManageEvents(props) {

    const [instance, setInstance] = useState(0);

    return <ManageEventsReady key={instance} {...props} resetInstance={() => {
        setInstance(Date.now());
    }} />

}

export default ManageEvents