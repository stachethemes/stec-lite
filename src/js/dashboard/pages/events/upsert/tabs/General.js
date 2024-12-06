import Button from '@Stec/CommonComponents/Button';
import { DatePicker } from '@Stec/CommonComponents/DatePicker';
import Flexbox from '@Stec/CommonComponents/Flexbox';
import { InputCheckbox, UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import InputText, { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputThumbType } from '@Stec/CommonComponents/InputThumbType';
import Modal from '@Stec/CommonComponents/Modal';
import RRuleGenerator from '@Stec/CommonComponents/RRuleGenerator';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { flushApiCache } from '@Stec/JS/api';
import { UpsertForm as CalendarsUpsertForm } from '@Stec/JS/dashboard/pages/calendars/Upsert';
import { UpsertForm as CategoriesUpsertForm } from '@Stec/JS/dashboard/pages/categories/Upsert';
import { getRegexByType } from '@Stec/JS/helpers';
import { usePermissions, useTaxonomyItemsAll, WithMaybeDisplayPermissions } from '@Stec/JS/hooks';
import timezonesList from '@Stec/JS/timezones-list';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import React, { useEffect, useState } from 'react';
import MaybeFilter from '../../../../MaybeFilter';
import { getPropsKeywords } from '../filterMap';

const RecurrenceOverride = (props) => {

    const { postData } = props;
    const [overrideDate, setOverrideDate] = useState(postData.current.meta.recurrence_id);

    useEffect(() => {
        if (postData.current.meta.recurrence_id !== overrideDate) {
            postData.current.meta.recurrence_id = overrideDate;
        }
    }, [overrideDate, postData]);

    if (!postData.current.meta.recurrence_id) {
        return null;
    }


    return <>
        <DatePicker
            title={__('Recurrence override date', 'stachethemes_event_calendar_lite')}
            description={__('Select recurrence override date.', 'stachethemes_event_calendar_lite')}
            value={moment(overrideDate).format('YYYY-MM-DD')}
            includeTime={false}
            onChange={(date) => {
                setOverrideDate(moment(date).format('YYYYMMDD'));
            }}
            required={true}
        />
        <Spacer />
    </>

}

const PermissionsList = (props) => {

    const { searchValue } = props;

    const { wasSubmitted, focusFieldsRef, postData } = props;

    const { items: permissionsList, ready: permissionsListReady, error: permissionsListError } = usePermissions();

    if (!permissionsListReady || permissionsListError) {
        return null;
    }

    return (
        <>
            <WithMaybeDisplayPermissions type='read_permission'>

                <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'read_permission')}>

                    <Spacer />

                    <UncontrolledInputSelect
                        ref={(ref) => focusFieldsRef.current['read_permission'] = ref}
                        multiple={true}
                        defaultValue={postData.current.meta.read_permission}
                        title={__('Read permission', 'stachethemes_event_calendar_lite')}
                        options={permissionsList.filter((item) => {
                            return item;
                        })}
                        onChange={value => {
                            postData.current.meta.read_permission = value;
                        }}
                        description={__('Who can view this event', 'stachethemes_event_calendar_lite')}
                        required={true}
                        wasSubmitted={wasSubmitted}
                        errorMessage={__('The read permission cannot be empty', 'stachethemes_event_calendar_lite')}
                    />

                </MaybeFilter>

            </WithMaybeDisplayPermissions>

            <WithMaybeDisplayPermissions type='edit_permission'>

                <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'edit_permission')}>

                    <Spacer />

                    <UncontrolledInputSelect
                        ref={(ref) => focusFieldsRef.current['edit_permission'] = ref}
                        multiple={true}
                        defaultValue={postData.current.meta.edit_permission}
                        title={__('Edit permission', 'stachethemes_event_calendar_lite')}
                        options={permissionsList.filter((item) => {
                            return item.value !== 'stec_public'
                        })}
                        onChange={value => {
                            postData.current.meta.edit_permission = value;
                        }}
                        description={__('Who can edit this event', 'stachethemes_event_calendar_lite')}
                        required={true}
                        wasSubmitted={wasSubmitted}
                        errorMessage={__('The edit permission cannot be empty', 'stachethemes_event_calendar_lite')}
                    />

                </MaybeFilter>
            </WithMaybeDisplayPermissions>

        </>

    )

}

const SelectCategoriesList = ({ postData }) => {

    const { items: categories, ready: categoriesReady, error: categoriesError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'use_permission',
        taxonomy: 'stec_cat'
    });

    return <React.Fragment key='SelectCategoriesList'>

        {(categoriesReady && !categoriesError) && <UncontrolledInputSelect
            title={__('Categories', 'stachethemes_event_calendar_lite')}
            multiple={true}
            defaultValue={postData.current.stec_cat}
            options={categories.map(item => {
                return (
                    {
                        value: item.id,
                        label: item.name,
                        color: item.meta.color
                    }
                )
            })}
            description={__('Assign event categories', 'stachethemes_event_calendar_lite')}
            required={true}
            onChange={(value) => {
                postData.current.stec_cat = value;
            }}
        />}

        <Spacer />
    </React.Fragment>
}

const SelectCategories = ({ postData, focusFieldsRef, wasSubmitted }) => {

    const [listKey, setListKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const refreshList = () => {
        flushApiCache({
            group: 'taxonomy-stec_cat'
        });
        setListKey(uniqueId());
    }

    return <React.Fragment key='SelectCategories'>

        <Modal isOpen={modalOpen} onClose={() => {
            setModalOpen(false);
        }}>

            <CategoriesUpsertForm

                template={false}

                onBack={() => {

                    setModalOpen(false);

                }}

                onCategoryInserted={(item) => {

                    if (false === Array.isArray(postData.current.stec_cat)) {
                        postData.current.stec_cat = [];
                    }

                    if (false === postData.current.stec_cat.some(catId => item.id === catId)) {
                        postData.current.stec_cat = [...postData.current.stec_cat, ...[item.id]];
                    }

                    refreshList();

                }}

                onCategoryDeleted={(item) => {

                    if (false === Array.isArray(postData.current.stec_cat)) {
                        postData.current.stec_cat = [];
                    }

                    postData.current.stec_cat = postData.current.stec_cat.filter(catId => {

                        return catId !== item.id;

                    });

                    refreshList();

                }}
            />

        </Modal>

        <SelectCategoriesList key={listKey} postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />

        <Button
            disabled={!STEC_VARIABLES.current_user.capability.manage_categories}
            className='blue'
            label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new category', 'stachethemes_event_calendar_lite')]}
            onClick={() => {

                if (!STEC_VARIABLES.current_user.capability.manage_categories) {
                    return false;
                }

                setModalOpen(true);
            }}
        />
    </React.Fragment>

}

const SelectCalendarList = ({ postData, focusFieldsRef, wasSubmitted, onCalendarChange }) => {

    const { items: calendars, ready: calendarsReady, error: calendarsError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'use_permission',
        taxonomy: 'stec_cal'
    });

    return <React.Fragment key='SelectCalendarList'>

        {(calendarsReady && !calendarsError) && <UncontrolledInputSelect
            ref={(ref) => focusFieldsRef.current['stec_cal'] = ref}
            title={__('Select calendar', 'stachethemes_event_calendar_lite')}
            defaultValue={postData.current.stec_cal}
            options={calendars.map(item => {
                return (
                    {
                        value: item.id,
                        label: item.name
                    }
                )
            })}
            description={__('Assign the event to the selected calendar', 'stachethemes_event_calendar_lite')}
            required={true}
            onChange={(value) => {
                postData.current.stec_cal = value;


                if (Array.isArray(calendars)) {
                    const selectedCalendar = calendars.find(test => {
                        return value === test.id;
                    });

                    if (selectedCalendar) {
                        postData.current.meta.thumbnail = selectedCalendar.meta.thumbnail;
                        postData.current.meta.color = selectedCalendar.meta.color;
                    }
                }

                if (onCalendarChange) {
                    onCalendarChange(postData.current.stec_cal, calendars);
                }
            }}
            errorMessage={__('The event must have a calendar', 'stachethemes_event_calendar_lite')}
            wasSubmitted={wasSubmitted}
        />}

        <Spacer />
    </React.Fragment>
}

const SelectCalendar = ({ postData, focusFieldsRef, wasSubmitted, onCalendarChange }) => {

    const [listKey, setListKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const refreshList = () => {
        flushApiCache({
            group: 'taxonomy-stec_cal'
        });
        setListKey(uniqueId());
    }

    return <React.Fragment key='SelectCalendar'>

        <Modal isOpen={modalOpen} onClose={() => {
            setModalOpen(false);
        }}>

            <CalendarsUpsertForm

                template={false}

                onBack={() => {
                    setModalOpen(false);
                }}

                onCalendarInserted={(item) => {
                    postData.current.stec_cal = item.id;
                    refreshList();
                }}

                onCalendarDeleted={() => {
                    postData.current.stec_cal = '';
                    refreshList();
                }}
            />

        </Modal>

        <SelectCalendarList
            key={listKey}
            postData={postData}
            focusFieldsRef={focusFieldsRef}
            wasSubmitted={wasSubmitted}
            onCalendarChange={onCalendarChange}
        />

        <Spacer />

        <Button
            disabled={!STEC_VARIABLES.current_user.capability.manage_calendars}
            className='blue'
            label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new calendar', 'stachethemes_event_calendar_lite')]}
            onClick={() => {

                if (!STEC_VARIABLES.current_user.capability.manage_calendars) {
                    return false;
                }

                setModalOpen(true);
            }}
        />
    </React.Fragment>

}

const EventDateTimeComponent = (props) => {

    const postData = props.postData;
    const wasSubmitted = props.wasSubmitted;
    const searchValue = props.searchValue;

    const [startDate, setStartDate] = useState(postData.current.meta.start_date);
    const [endDate, setEndDate] = useState(postData.current.meta.end_date);
    const [allDay, setAllDay] = useState(postData.current.meta.all_day);
    const [hideEnd, setHideEnd] = useState(postData.current.meta.hide_end);
    const [exdate, setExdate] = useState(postData.current.meta.exdate);
    const [rrule, setRrule] = useState(postData.current.meta.rrule);
    const [manualRrule, setManualRrule] = useState(postData.current.meta.manual_rrule);

    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);
    const dateFormat = allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD\\THH:mm';
    const startDateString = startDateMoment.format(dateFormat);
    const endDateString = endDateMoment.format(dateFormat);

    const displayRepeater = !(postData.current.meta.recurrence_id && !postData.current.meta.manual_rrule);

    useEffect(() => {

        props.onChange({
            startDate: startDate,
            endDate: endDate,
            allDay: allDay,
            hideEnd: hideEnd,
            rrule: rrule,
            manualRrule: manualRrule,
            exdate: exdate
        });

    }, [startDate, endDate, allDay, hideEnd, props, rrule, manualRrule, exdate]);

    return (
        <React.Fragment key='EventDateTimeComponent'>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'rroverride')}>
                <RecurrenceOverride postData={props.postData} />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'start')}>
                <DatePicker
                    ref={(ref) => props.focusFieldsRef.current['start_date'] = ref}
                    title={__('Start date', 'stachethemes_event_calendar_lite')}
                    description={__('Event initial start date', 'stachethemes_event_calendar_lite')}
                    includeTime={!allDay}
                    value={startDateString}
                    onChange={(value) => {

                        const newStartMoment = moment(value);

                        if (allDay) {
                            newStartMoment.set({
                                hours: 0,
                                minutes: 0,
                                seconds: 0
                            });
                        }

                        const newDateString = newStartMoment.format('YYYY-MM-DD\\THH:mm');

                        setStartDate(newDateString);

                    }}
                    required={true}
                    errorMessage={__('Event must have a start date', 'stachethemes_event_calendar_lite')}
                    wasSubmitted={wasSubmitted}
                />
                <Spacer />
            </MaybeFilter>


            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'end')}>
                <DatePicker
                    ref={(ref) => props.focusFieldsRef.current['end_date'] = ref}
                    title={__('End date', 'stachethemes_event_calendar_lite')}
                    description={__('Event initial end date', 'stachethemes_event_calendar_lite')}
                    includeTime={!allDay}
                    value={endDateString}
                    onChange={(value) => {

                        const newEndMoment = moment(value);

                        if (allDay) {
                            newEndMoment.set({
                                hours: 23,
                                minutes: 59,
                                seconds: 59
                            });
                        }

                        const newDateString = newEndMoment.format('YYYY-MM-DD\\THH:mm');

                        setEndDate(newDateString);

                    }}
                    required={true}
                    errorMessage={__('Event must have an end date', 'stachethemes_event_calendar_lite')}
                    wasSubmitted={wasSubmitted}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'all_day')}>

                <InputCheckbox
                    title={__('All day', 'stachethemes_event_calendar_lite')}
                    description={__('Check if your event spans throughout the day', 'stachethemes_event_calendar_lite')}
                    value={allDay}
                    onChange={checked => {

                        if (checked) {

                            startDateMoment.set({
                                hours: 0,
                                minutes: 0,
                                seconds: 0
                            });

                            endDateMoment.set({
                                hours: 23,
                                minutes: 59,
                                seconds: 59
                            });

                            const startDateValue = startDateMoment.format('YYYY-MM-DD\\THH:mm');
                            const endDateValue = endDateMoment.format('YYYY-MM-DD\\THH:mm');

                            setStartDate(startDateValue);
                            setEndDate(endDateValue);

                        }

                        setAllDay(checked);

                    }}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'hide_end')}>

                <InputCheckbox
                    title={__('Hide end date', 'stachethemes_event_calendar_lite')}
                    description={__(`Check if you don't want to show the event end date on the front-end`, 'stachethemes_event_calendar_lite')}
                    value={hideEnd}
                    onChange={checked => {
                        setHideEnd(checked);
                    }}
                />

            </MaybeFilter>

            {displayRepeater && <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'rrule')}>

                <Spacer />

                <RRuleGenerator
                    title={__('Repeat event', 'stachethemes_event_calendar_lite')}
                    description={__('Set repeat scheme for your events', 'stachethemes_event_calendar_lite')}
                    exdate={exdate}
                    rrule={rrule}
                    manual={manualRrule}
                    min={endDateMoment.format('YYYY-MM-DD')}

                    onModeChange={(type) => {
                        setManualRrule('manual' === type);
                    }}

                    onRRuleChange={(rrule) => {
                        setRrule(rrule);
                    }}

                    onExdateChange={(exdates) => {
                        setExdate(exdates);
                    }}
                />
            </MaybeFilter>}
        </React.Fragment>
    )

}

const SelectCalendarThumbAndColor = ({ postData, focusFieldsRef, wasSubmitted, onCalendarChange, searchValue }) => {

    const [state, setState] = useState(uniqueId());

    return (

        <React.Fragment key={state}>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'calendar')}>
                <SelectCalendar
                    postData={postData}
                    focusFieldsRef={focusFieldsRef}
                    wasSubmitted={wasSubmitted}
                    onCalendarChange={() => {
                        if (onCalendarChange) {
                            onCalendarChange();
                            setState(uniqueId());
                        }

                    }}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'color')}>
                <UncontrolledInputColor
                    title={__('Event Color', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.meta.color}
                    description={__('Select color for your event', 'stachethemes_event_calendar_lite')}
                    onChange={(value) => {
                        postData.current.meta.color = value;
                    }}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'thumbnail')}>
                <UncontrolledInputThumbType
                    title={__('Thumbnail type', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.meta.thumbnail}
                    description={__('Event thumbnail', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        postData.current.meta.thumbnail = value;
                    }}
                />
                <Spacer />
            </MaybeFilter>

        </React.Fragment>
    )

}

function General(props) {

    const postData = props.postData;
    const wasSubmitted = props.wasSubmitted;
    const focusFieldsRef = props.focusFieldsRef;
    const searchValue = props.searchValue;

    return (
        <Section title={__('General', 'stachethemes_event_calendar_lite')}>

            {
                postData.current.link &&
                <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'permalink')}>
                    <Flexbox className='stec-dashboard-edit-event-permalink'>

                        <InputText
                            readOnly={true}
                            title={__('Permalink', 'stachethemes_event_calendar_lite')}
                            value={postData.current.link}
                            description={__('The event current permalink', 'stachethemes_event_calendar_lite')}
                            onChange={() => {
                                // do nothing
                            }}
                        />

                        <Button
                            extra={{
                                title: __('View event', 'stachethemes_event_calendar_lite')
                            }}
                            className='blue'
                            label={__('View', 'stachethemes_event_calendar_lite')} href={postData.current.link} target={'_blank'} />
                    </Flexbox>
                </MaybeFilter>
            }

            <Spacer />

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'title')}>
                <UncontrolledInputText
                    ref={(ref) => focusFieldsRef.current['title'] = ref}
                    title={__('Title', 'stachethemes_event_calendar_lite')}
                    description={__('The event title', 'stachethemes_event_calendar_lite')}
                    placeholder={__('Title', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.title.raw}
                    onChange={value => {
                        postData.current.title.raw = value;
                    }}
                    regex={getRegexByType('title')}
                    errorMessage={__('The event must have a title', 'stachethemes_event_calendar_lite')}
                    wasSubmitted={wasSubmitted}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'slug')}>
                <UncontrolledInputText
                    ref={(ref) => focusFieldsRef.current['slug'] = ref}
                    title={__('Slug', 'stachethemes_event_calendar_lite')}
                    className='stec-input-slug'
                    placeholder={__('Slug', 'stachethemes_event_calendar_lite')}
                    description={__('The event title slug. Leave empty to auto-generate', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.slug}
                    onChange={value => {
                        postData.current.slug = value;

                    }}
                    regex={getRegexByType('slug')}
                    errorMessage={__('The event must have a valid slug', 'stachethemes_event_calendar_lite')}
                    wasSubmitted={wasSubmitted}
                />

                <Spacer />
            </MaybeFilter>

            <SelectCalendarThumbAndColor
                searchValue={searchValue}
                postData={postData}
                focusFieldsRef={focusFieldsRef}
                wasSubmitted={wasSubmitted}
                onCalendarChange={props.onCalendarChange}
            />

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'timezone')}>
                <UncontrolledInputSelect
                    ref={(ref) => focusFieldsRef.current['timezone'] = ref}
                    title={__('Timezone', 'stachethemes_event_calendar_lite')}
                    options={[{
                        label: __('Use calendar timezone', 'stachethemes_event_calendar_lite'),
                        value: 'stec_cal_default'
                    }, ...timezonesList.map(tz => {
                        return {
                            value: tz.value,
                            label: tz.label
                        }
                    })]}
                    defaultValue={postData.current.meta.timezone}
                    required={true}
                    onChange={value => {
                        postData.current.meta.timezone = value;
                    }}
                    description={__('Event timezone', 'stachethemes_event_calendar_lite')}
                    errorMessage={__('The event must have a timezone', 'stachethemes_event_calendar_lite')}
                    wasSubmitted={wasSubmitted}
                />

                <Spacer />
            </MaybeFilter>

            <EventDateTimeComponent
                searchValue={searchValue}
                postData={postData}
                wasSubmitted={wasSubmitted}
                focusFieldsRef={focusFieldsRef}
                onChange={
                    (props) => {
                        postData.current.meta.start_date = props.startDate;
                        postData.current.meta.end_date = props.endDate;
                        postData.current.meta.all_day = props.allDay;
                        postData.current.meta.hide_end = props.hideEnd;
                        postData.current.meta.rrule = props.rrule;
                        postData.current.meta.manual_rrule = props.manualRrule;
                        postData.current.meta.exdate = props.exdate;
                    }
                } />

            <Spacer />

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'categories')}>
                <SelectCategories postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />
                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'status')}>
                <UncontrolledInputSelect
                    title={__('Event Status', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.meta.event_status}
                    options={[
                        { value: 'EventScheduled', label: __('Scheduled', 'stachethemes_event_calendar_lite') },
                        { value: 'EventMovedOnline', label: __('Moved Online', 'stachethemes_event_calendar_lite') },
                        { value: 'EventPostponed', label: __('Postponed', 'stachethemes_event_calendar_lite') },
                        { value: 'EventRescheduled', label: __('Rescheduled', 'stachethemes_event_calendar_lite') },
                        { value: 'EventCancelled', label: __('Cancelled', 'stachethemes_event_calendar_lite') },
                    ]}
                    description={__('Set event status', 'stachethemes_event_calendar_lite')}
                    onChange={(value) => {
                        postData.current.meta.event_status = value;
                    }}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'featured')}>
                <UncontrolledInputCheckbox
                    title={__('Set as Featured', 'stachethemes_event_calendar_lite')} description={__('Mark event as featured', 'stachethemes_event_calendar_lite')}
                    defaultValue={postData.current.meta.featured}
                    onChange={checked => {
                        postData.current.meta.featured = checked;
                    }}
                />

                <Spacer />
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('general', 'general', 'comments')}>
                <UncontrolledInputCheckbox
                    title={__('Allow comments', 'stachethemes_event_calendar_lite')}
                    defaultValue={'open' === postData.current.comment_status}
                    description={__('Allow comments for this event', 'stachethemes_event_calendar_lite')}
                    onChange={checked => {
                        postData.current.comment_status = true === checked ? 'open' : 'closed';
                    }}
                />
            </MaybeFilter>

            <PermissionsList searchValue={searchValue} postData={postData} focusFieldsRef={focusFieldsRef} wasSubmitted={wasSubmitted} />

        </Section>
    );
}

export default General