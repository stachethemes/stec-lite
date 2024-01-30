import InputCheckbox, { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

const TopMenuSection = ({ settingsCalendar }) => {

    const [topMenuEnabled, setTopMenuEnabled] = useState(settingsCalendar.top_enabled);

    return (
        <SectionCollapseContent title={__('Calendar top menu', 'stec')} subtitle={__('Show calendar top menu settings', 'stec')}>

            <InputCheckbox
                value={topMenuEnabled}
                title={__('Top menu', 'stec')}
                description={__(`Display top menu`, 'stec')}
                onChange={value => {
                    settingsCalendar.top_enabled = value;
                    setTopMenuEnabled(value);
                }}
            />

            {
                topMenuEnabled && <>

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_today_button}
                        title={__('Today button', 'stec')}
                        description={__(`Display today button`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_today_button = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_nav_buttons}
                        title={__('Navigation buttons', 'stec')}
                        description={__(`Display previous & next date navigation buttons`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_nav_buttons = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_datepicker_menu}
                        title={__('Date picker menu', 'stec')}
                        description={__(`Display date picker dropdown menu`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_datepicker_menu = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_search_menu}
                        title={__('Search menu', 'stec')}
                        description={__(`Display search events menu`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_search_menu = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_layouts_menu}
                        title={__('Layouts menu', 'stec')}
                        description={__(`Display layouts menu`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_layouts_menu = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputSelect
                        defaultValue={settingsCalendar.top_filters_menu}
                        title={__('Filters menu', 'stec')}
                        options={[
                            {
                                label: __('Hide', 'stec'),
                                value: 0
                            },
                            {
                                label: __('Toggle', 'stec'),
                                value: 1
                            },
                            {
                                label: __('Always Visible', 'stec'),
                                value: 2
                            },
                        ]}
                        description={__(`Set top menu filters visibility`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_filters_menu = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_inline_categories}
                        title={__('Inline categories list', 'stec')}
                        description={__(`Display categories inline below the top menu`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_inline_categories = value;
                        }}
                    />

                    <Spacer />

                    <UncontrolledInputCheckbox
                        defaultValue={settingsCalendar.top_categories_start_inactive}
                        title={__('Uncheck categories', 'stec')}
                        description={__(`Uncheck categories upon initial calendar load`, 'stec')}
                        onChange={value => {
                            settingsCalendar.top_categories_start_inactive = value;
                        }}
                    />

                </>
            }


        </SectionCollapseContent>
    )

}

function Calendar({ settings }) {

    const settingsCalendar = settings.current.calendar;

    const layoutsList = [
        {
            value: 'agenda',
            label: __('Agenda', 'stec')
        },
        {
            value: 'month',
            label: __('Month', 'stec')
        },
        {
            value: 'week',
            label: __('Week', 'stec')
        },
        {
            value: 'day',
            label: __('Day', 'stec')
        },
        {
            value: 'grid',
            label: __('Grid', 'stec')
        },
        {
            value: 'boxgrid',
            label: __('Box grid', 'stec')
        },
        {
            value: 'map',
            label: __('Map', 'stec')
        },
    ];

    return (
        <Section>

            <SectionCollapseContent title={__('Date & time settings', 'stec')} subtitle={__('Show date and time settings', 'stec')}>

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.dow}
                    title={__('First day of the week', 'stec')}
                    options={[
                        {
                            label: __('Monday', 'stec'),
                            value: 1
                        },
                        {
                            label: __('Tuesday', 'stec'),
                            value: 2
                        },
                        {
                            label: __('Wednesday', 'stec'),
                            value: 3
                        },
                        {
                            label: __('Thursday', 'stec'),
                            value: 4
                        },
                        {
                            label: __('Friday', 'stec'),
                            value: 5
                        },
                        {
                            label: __('Saturday', 'stec'),
                            value: 6
                        },
                        {
                            label: __('Sunday', 'stec'),
                            value: 0
                        },
                    ]}
                    description={__(`Select first day of the week for your calendar`, 'stec')}
                    onChange={value => {
                        settingsCalendar.dow = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.date_format}
                    title={__('Date format', 'stec')}
                    options={[
                        {
                            label: __('Month Day Year', 'stec'),
                            value: 'stec_mdy'
                        },
                        {
                            label: __('Day Month Year', 'stec'),
                            value: 'stec_dmy'
                        },
                        {
                            label: __('Year Month Day', 'stec'),
                            value: 'stec_ymd'
                        },
                        {
                            label: __('Use WordPress Settings', 'stec'),
                            value: 'wp'
                        },
                    ]}
                    description={__(`Set date format for your calendar`, 'stec')}
                    onChange={value => {
                        settingsCalendar.date_format = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.time_format}
                    title={__('Time format', 'stec')}
                    options={[
                        {
                            label: __('12 hours', 'stec'),
                            value: 'stec_12'
                        },
                        {
                            label: __('24 hours', 'stec'),
                            value: 'stec_24'
                        },
                        {
                            label: __('Use WordPress Settings', 'stec'),
                            value: 'wp'
                        },
                    ]}
                    description={__(`Set time format for your calendar`, 'stec')}
                    onChange={value => {
                        settingsCalendar.time_format = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsCalendar.use_user_timezone}
                    title={__("Show dates in user's timezone", 'stec')}
                    description={__(`Enable this option to display the event dates in the user's local timezone`, 'stec')}
                    onChange={value => {
                        settingsCalendar.use_user_timezone = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsCalendar.show_tz_offset}
                    title={__('Show timezone abbreviation', 'stec')}
                    description={__(`Display timezone abbreviation next to the time`, 'stec')}
                    onChange={value => {
                        settingsCalendar.show_tz_offset = value;
                    }}
                />

            </SectionCollapseContent>

            <TopMenuSection settingsCalendar={settingsCalendar} />

            <SectionCollapseContent title={__('Calendar layouts', 'stec')} subtitle={__('Show calendar layouts settings', 'stec')}>
                <UncontrolledInputSelect
                    multiple={true}
                    defaultValue={settingsCalendar.layouts ? settingsCalendar.layouts.split(',') : []}
                    title={__('Calendar layouts', 'stec')}
                    options={layoutsList}
                    description={__(`Set the available layouts for your calendar`, 'stec')}
                    onChange={value => {
                        settingsCalendar.layouts = [value].join(',');
                    }}
                />

                <Spacer />

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.layout}
                    title={__('Default calendar layout', 'stec')}
                    options={layoutsList}
                    description={__(`Select the default calendar layout`, 'stec')}
                    onChange={value => {
                        settingsCalendar.layout = value;
                    }}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Event preview', 'stec')} subtitle={__('Show event preview settings', 'stec')}>

                <UncontrolledInputCheckbox
                    title={__('Display toggle button', 'stec')}
                    defaultValue={settingsCalendar.ep_toggle_button}
                    onChange={value => {
                        settingsCalendar.ep_toggle_button = value;
                    }}
                    description={__(`Display toggle event button at the right side of the preview container`, 'stec')}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Open events & links', 'stec')} subtitle={__('Show open events & links settings', 'stec')}>

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.open_events_in}
                    title={__('Open Events In', 'stec')}
                    options={[
                        {
                            label: __('Calendar', 'stec'),
                            value: 'calendar'
                        },
                        {
                            label: __('Popup', 'stec'),
                            value: 'modal'
                        },
                        {
                            label: __('Single page', 'stec'),
                            value: 'single'
                        },
                        {
                            label: __('Exernal link', 'stec'),
                            value: 'external'
                        },
                    ]}
                    description={__(`Select how to open your events on click`, 'stec')}
                    onChange={value => {
                        settingsCalendar.open_events_in = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.links_target}
                    title={__('Open links In', 'stec')}
                    options={[
                        {
                            label: __('Same window', 'stec'),
                            value: '_self'
                        },
                        {
                            label: __('New window', 'stec'),
                            value: '_blank'
                        },
                    ]}
                    description={__(`Open links in new window or same window`, 'stec')}
                    onChange={value => {
                        settingsCalendar.links_target = value;
                    }}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Organizers & Guests', 'stec')} subtitle={__('Show organizers & guests settings', 'stec')}>

                <UncontrolledInputCheckbox
                    title={__('Conceal publicly visible emails from non-logged-in users', 'stec')}
                    defaultValue={settingsCalendar.hide_emails}
                    onChange={value => {
                        settingsCalendar.hide_emails = value;
                    }}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Other', 'stec')} subtitle={__('Show open "other" settings', 'stec')}>

                <UncontrolledInputSelect
                    defaultValue={settingsCalendar.thumbnail_source}
                    title={__('Front-end event thumbnail source', 'stec')}
                    options={[
                        {
                            label: __('Event', 'stec'),
                            value: 'event'
                        },
                        {
                            label: __('Calendar', 'stec'),
                            value: 'calendar'
                        },
                        {
                            label: __('Category', 'stec'),
                            value: 'category'
                        },
                        {
                            label: __('Organizer', 'stec'),
                            value: 'organizer'
                        },
                    ]}
                    description={__(`Select event thumbnail source`, 'stec')}
                    onChange={value => {
                        settingsCalendar.thumbnail_source = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Auto-focus events', 'stec')}
                    defaultValue={settingsCalendar.scroll_to_event}
                    onChange={value => {
                        settingsCalendar.scroll_to_event = value;
                    }}
                />

            </SectionCollapseContent>

        </Section>
    )
}

export default Calendar;