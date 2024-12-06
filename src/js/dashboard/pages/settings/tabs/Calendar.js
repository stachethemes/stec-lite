import InputCheckbox, { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import MaybeFilter from '../../../MaybeFilter';
import { getPropsKeywords, getSectionKeywords } from '../filterMap';

const InlineCategories = ({ settingsCalendar, searchValue }) => {

    const [enabled, setEnabled] = useState(settingsCalendar.top_inline_categories);

    return (

        <>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_inline_categories')}>

                <InputCheckbox
                    value={settingsCalendar.top_inline_categories}
                    title={__('Inline categories list', 'stachethemes_event_calendar_lite')}
                    description={__(`Display categories inline below the top menu`, 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsCalendar.top_inline_categories = value;
                        setEnabled(value);
                    }}
                />

                <Spacer />

            </MaybeFilter>

            {enabled && <>

                <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_inline_categories_mode')}>

                    <UncontrolledInputSelect
                        defaultValue={settingsCalendar.top_inline_categories_mode}
                        title={__('Inline categories list mode', 'stachethemes_event_calendar_lite')}
                        options={[
                            {
                                label: __('Single-Select', 'stachethemes_event_calendar_lite'),
                                value: 'single'
                            },
                            {
                                label: __('Multi-Select', 'stachethemes_event_calendar_lite'),
                                value: 'multi'
                            },
                        ]}
                        description={__(`Toggle between Single-Select Mode, where selecting an item automatically unchecks others, and Multi-Select Mode, which allows multiple items to be selected simultaneously.`, 'stachethemes_event_calendar_lite')}
                        onChange={value => {
                            settingsCalendar.top_inline_categories_mode = value;
                        }}
                    />

                    <Spacer />

                </MaybeFilter>
            </>}

        </>

    )

}

const TopMenuSection = ({ settingsCalendar, searchValue }) => {

    const [topMenuEnabled, setTopMenuEnabled] = useState(settingsCalendar.top_enabled);

    return (
        <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'topMenu')}>
            <SectionCollapseContent title={__('Calendar top menu', 'stachethemes_event_calendar_lite')} subtitle={__('Show calendar top menu settings', 'stachethemes_event_calendar_lite')}>

                <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_enabled')}>
                    <InputCheckbox
                        value={topMenuEnabled}
                        title={__('Top menu', 'stachethemes_event_calendar_lite')}
                        description={__(`Display top menu`, 'stachethemes_event_calendar_lite')}
                        onChange={value => {
                            settingsCalendar.top_enabled = value;
                            setTopMenuEnabled(value);
                        }}
                    />

                    <Spacer />
                </MaybeFilter>

                {
                    topMenuEnabled && <>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_today_button')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_today_button}
                                title={__('Today button', 'stachethemes_event_calendar_lite')}
                                description={__(`Display today button`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_today_button = value;
                                }}
                            />

                            <Spacer />
                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_nav_buttons')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_nav_buttons}
                                title={__('Navigation buttons', 'stachethemes_event_calendar_lite')}
                                description={__(`Display previous & next date navigation buttons`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_nav_buttons = value;
                                }}
                            />

                            <Spacer />
                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_datepicker_menu')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_datepicker_menu}
                                title={__('Date picker menu', 'stachethemes_event_calendar_lite')}
                                description={__(`Display date picker dropdown menu`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_datepicker_menu = value;
                                }}
                            />

                            <Spacer />
                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_search_menu')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_search_menu}
                                title={__('Search menu', 'stachethemes_event_calendar_lite')}
                                description={__(`Display search events menu`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_search_menu = value;
                                }}
                            />

                            <Spacer />

                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_layouts_menu')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_layouts_menu}
                                title={__('Layouts menu', 'stachethemes_event_calendar_lite')}
                                description={__(`Display layouts menu`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_layouts_menu = value;
                                }}
                            />

                            <Spacer />

                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_filters_menu')}>

                            <UncontrolledInputSelect
                                defaultValue={settingsCalendar.top_filters_menu}
                                title={__('Filters menu', 'stachethemes_event_calendar_lite')}
                                options={[
                                    {
                                        label: __('Hide', 'stachethemes_event_calendar_lite'),
                                        value: 0
                                    },
                                    {
                                        label: __('Toggle', 'stachethemes_event_calendar_lite'),
                                        value: 1
                                    },
                                    {
                                        label: __('Always Visible', 'stachethemes_event_calendar_lite'),
                                        value: 2
                                    },
                                ]}
                                description={__(`Set top menu filters visibility`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_filters_menu = value;
                                }}
                            />

                            <Spacer />

                        </MaybeFilter>

                        <InlineCategories settingsCalendar={settingsCalendar} searchValue={searchValue} />

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_categories_start_inactive')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_categories_start_inactive}
                                title={__('Uncheck categories', 'stachethemes_event_calendar_lite')}
                                description={__(`Uncheck categories upon initial calendar load`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_categories_start_inactive = value;
                                }}
                            />

                            <Spacer />
                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_labels')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_labels}
                                title={__('Display labels', 'stachethemes_event_calendar_lite')}
                                description={__(`Display labels for top menu items`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_labels = value;
                                }}
                            />

                            <Spacer />

                        </MaybeFilter>

                        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'topMenu', 'top_single_line')}>

                            <UncontrolledInputCheckbox
                                defaultValue={settingsCalendar.top_single_line}
                                title={__('Keep top menu in a single line', 'stachethemes_event_calendar_lite')}
                                description={__(`If checked top menu will be displayed in a single line on mobile layouts`, 'stachethemes_event_calendar_lite')}
                                onChange={value => {
                                    settingsCalendar.top_single_line = value;
                                }}
                            />

                        </MaybeFilter>

                    </>
                }


            </SectionCollapseContent>
        </MaybeFilter>
    )

}

function Calendar({ settings, searchValue }) {

    const settingsCalendar = settings.current.calendar;

    const layoutsList = [
        {
            value: 'agenda',
            label: __('Agenda', 'stachethemes_event_calendar_lite')
        },
        {
            value: 'month',
            label: __('Month', 'stachethemes_event_calendar_lite')
        },
        {
            value: 'week',
            label: __('Week', 'stachethemes_event_calendar_lite')
        },
        {
            value: 'day',
            label: __('Day', 'stachethemes_event_calendar_lite')
        },
        {
            value: 'grid',
            label: __('Grid', 'stachethemes_event_calendar_lite')
        },
        {
            value: 'boxgrid',
            label: __('Box grid', 'stachethemes_event_calendar_lite')
        }
    ];

    return (
        <Section>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'dateTime')}>
                <SectionCollapseContent title={__('Date & time settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show date and time settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'dateTime', 'dow')}>

                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.dow}
                            title={__('First day of the week', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Monday', 'stachethemes_event_calendar_lite'),
                                    value: 1
                                },
                                {
                                    label: __('Tuesday', 'stachethemes_event_calendar_lite'),
                                    value: 2
                                },
                                {
                                    label: __('Wednesday', 'stachethemes_event_calendar_lite'),
                                    value: 3
                                },
                                {
                                    label: __('Thursday', 'stachethemes_event_calendar_lite'),
                                    value: 4
                                },
                                {
                                    label: __('Friday', 'stachethemes_event_calendar_lite'),
                                    value: 5
                                },
                                {
                                    label: __('Saturday', 'stachethemes_event_calendar_lite'),
                                    value: 6
                                },
                                {
                                    label: __('Sunday', 'stachethemes_event_calendar_lite'),
                                    value: 0
                                },
                            ]}
                            description={__(`Select first day of the week for your calendar`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.dow = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'dateTime', 'date_format')}>
                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.date_format}
                            title={__('Date format', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Month Day Year', 'stachethemes_event_calendar_lite'),
                                    value: 'stec_mdy'
                                },
                                {
                                    label: __('Day Month Year', 'stachethemes_event_calendar_lite'),
                                    value: 'stec_dmy'
                                },
                                {
                                    label: __('Year Month Day', 'stachethemes_event_calendar_lite'),
                                    value: 'stec_ymd'
                                },
                                {
                                    label: __('Use WordPress Settings', 'stachethemes_event_calendar_lite'),
                                    value: 'wp'
                                },
                            ]}
                            description={__(`Set date format for your calendar`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.date_format = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'dateTime', 'time_format')}>
                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.time_format}
                            title={__('Time format', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('12 hours', 'stachethemes_event_calendar_lite'),
                                    value: 'stec_12'
                                },
                                {
                                    label: __('24 hours', 'stachethemes_event_calendar_lite'),
                                    value: 'stec_24'
                                },
                                {
                                    label: __('Use WordPress Settings', 'stachethemes_event_calendar_lite'),
                                    value: 'wp'
                                },
                            ]}
                            description={__(`Set time format for your calendar`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.time_format = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'dateTime', 'use_user_timezone')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsCalendar.use_user_timezone}
                            title={__(`Show dates in user's local time`, 'stachethemes_event_calendar_lite')}
                            description={__(`Turn on this option to show event dates in the user's local time`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.use_user_timezone = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'dateTime', 'show_tz_offset')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsCalendar.show_tz_offset}
                            title={__('Show UTC Offset', 'stachethemes_event_calendar_lite')}
                            description={__(`Display UTC Offset next to the time`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.show_tz_offset = value;
                            }}
                        />
                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>

            <TopMenuSection settingsCalendar={settingsCalendar} searchValue={searchValue} />

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'calendarLayouts')}>
                <SectionCollapseContent title={__('Calendar layouts', 'stachethemes_event_calendar_lite')} subtitle={__('Show calendar layouts settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'calendarLayouts', 'layouts')}>
                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsCalendar.layouts ? settingsCalendar.layouts.split(',') : []}
                            title={__('Calendar layouts', 'stachethemes_event_calendar_lite')}
                            options={layoutsList}
                            description={__(`Set the available layouts for your calendar`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.layouts = [value].join(',');
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'calendarLayouts', 'layout')}>

                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.layout}
                            title={__('Default calendar layout', 'stachethemes_event_calendar_lite')}
                            options={layoutsList}
                            description={__(`Select the default calendar layout`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.layout = value;
                            }}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'eventPreview')}>
                <SectionCollapseContent title={__('Event preview', 'stachethemes_event_calendar_lite')} subtitle={__('Show event preview settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'eventPreview', 'ep_short_desc')}>
                        <UncontrolledInputCheckbox
                            title={__('Display short description', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsCalendar.ep_short_desc}
                            onChange={value => {
                                settingsCalendar.ep_short_desc = value;
                            }}
                            description={__(`Display event short description`, 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'eventPreview', 'ep_toggle_button')}>
                        <UncontrolledInputCheckbox
                            title={__('Display toggle button', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsCalendar.ep_toggle_button}
                            onChange={value => {
                                settingsCalendar.ep_toggle_button = value;
                            }}
                            description={__(`Display toggle event button at the right side of the preview container`, 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'eventPreview', 'ep_keep_thumbnail')}>

                        <UncontrolledInputCheckbox
                            title={__('Show thumbnail icon in mobile view', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsCalendar.ep_keep_thumbnail}
                            onChange={value => {
                                settingsCalendar.ep_keep_thumbnail = value;
                            }}
                            description={__(`Show thumbnail icon in mobile view`, 'stachethemes_event_calendar_lite')}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'eventLinks')}>
                <SectionCollapseContent title={__('Open events & links', 'stachethemes_event_calendar_lite')} subtitle={__('Show open events & links settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'eventLinks', 'open_events_in')}>
                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.open_events_in}
                            title={__('Open Events In', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Calendar', 'stachethemes_event_calendar_lite'),
                                    value: 'calendar'
                                },
                                {
                                    label: __('Popup', 'stachethemes_event_calendar_lite'),
                                    value: 'modal'
                                },
                                {
                                    label: __('Single page', 'stachethemes_event_calendar_lite'),
                                    value: 'single'
                                },
                                {
                                    label: __('Exernal link', 'stachethemes_event_calendar_lite'),
                                    value: 'external'
                                },
                            ]}
                            description={__(`Select how to open your events on click`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.open_events_in = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'eventLinks', 'links_target')}>
                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.links_target}
                            title={__('Open links In', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Same window', 'stachethemes_event_calendar_lite'),
                                    value: '_self'
                                },
                                {
                                    label: __('New window', 'stachethemes_event_calendar_lite'),
                                    value: '_blank'
                                },
                            ]}
                            description={__(`Open links in new window or same window`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.links_target = value;
                            }}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('calendar', 'other')}>
                <SectionCollapseContent title={__('Other', 'stachethemes_event_calendar_lite')} subtitle={__('Show open "other" settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'other', 'thumbnail_source')}>
                        <UncontrolledInputSelect
                            defaultValue={settingsCalendar.thumbnail_source}
                            title={__('Front-end event thumbnail & color source', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Event', 'stachethemes_event_calendar_lite'),
                                    value: 'event'
                                },
                                {
                                    label: __('Calendar', 'stachethemes_event_calendar_lite'),
                                    value: 'calendar'
                                },
                                {
                                    label: __('Category', 'stachethemes_event_calendar_lite'),
                                    value: 'category'
                                },
                                {
                                    label: __('Location', 'stachethemes_event_calendar_lite'),
                                    value: 'location'
                                },
                                {
                                    label: __('Organizer', 'stachethemes_event_calendar_lite'),
                                    value: 'organizer'
                                },
                            ]}
                            description={__(`Select event thumbnail & event color source`, 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsCalendar.thumbnail_source = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('calendar', 'other', 'scroll_to_event')}>

                        <UncontrolledInputCheckbox
                            title={__('Auto-focus events', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsCalendar.scroll_to_event}
                            onChange={value => {
                                settingsCalendar.scroll_to_event = value;
                            }}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>
        </Section>
    )
}

export default Calendar;