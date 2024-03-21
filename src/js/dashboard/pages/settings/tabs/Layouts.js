import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import { UncontrolledQtySelector } from '@Stec/CommonComponents/QtySelector';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';

function Layouts({ settings }) {

    const settingsLayouts = settings.current.layouts;

    return (
        <Section>
            <SectionCollapseContent title={__('Agenda layout', 'stachethemes_event_calendar_lite')} subtitle={__('Show agenda layout settings', 'stachethemes_event_calendar_lite')}>

                <UncontrolledInputCheckbox
                    defaultValue={settingsLayouts.agenda_slider}
                    title={__('Agenda slider', 'stachethemes_event_calendar_lite')}
                    description={__(`Display agenda slider`, 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsLayouts.agenda_slider = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsLayouts.agenda_list}
                    title={__('Agenda list', 'stachethemes_event_calendar_lite')}
                    description={__(`Display agenda list`, 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsLayouts.agenda_list = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.agenda_list_next_button}
                    onChange={value => {
                        settingsLayouts.agenda_list_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stachethemes_event_calendar_lite')}
                    description={__('Display events in reverse order', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.agenda_list_reverse_order}
                    onChange={value => {
                        settingsLayouts.agenda_list_reverse_order = value ? true : false;
                    }}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.agenda_list_limit}
                    onChange={value => {
                        settingsLayouts.agenda_list_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stachethemes_event_calendar_lite')}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Month & week layout', 'stachethemes_event_calendar_lite')} subtitle={__('Show month & week layout settings', 'stachethemes_event_calendar_lite')}>

                <UncontrolledInputSelect
                    defaultValue={settingsLayouts.month_week_style}
                    title={__('Month & week cells style', 'stachethemes_event_calendar_lite')}
                    options={[
                        {
                            label: __('Fixed', 'stachethemes_event_calendar_lite'),
                            value: 'fixed'
                        },
                        {
                            label: __('Auto', 'stachethemes_event_calendar_lite'),
                            value: 'auto'
                        }
                    ]}
                    description={__(`Fixed style keeps the cells height static while Auto will expand them depending on the number of events in the cells`, 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsLayouts.month_week_style = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Quick open', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_quick_open}
                    onChange={value => {
                        settingsLayouts.month_week_quick_open = value;
                    }}
                    description={__('If checked, the event will open in modal window when clicked over without expanding the entire list', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Tooltip', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_tooltip}
                    onChange={value => {
                        settingsLayouts.month_week_tooltip = value;
                    }}
                    description={__('If checked, the event tooltip will be displayed when hovered over', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Tooltip show event description', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_short_desc}
                    onChange={value => {
                        settingsLayouts.month_week_short_desc = value;
                    }}
                    description={__('If checked the event description will be displayed in the tooltip', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Tooltip show counter', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_counter}
                    onChange={value => {
                        settingsLayouts.month_week_counter = value;
                    }}
                    description={__('If checked the event counter will be displayed in the tooltip', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Tooltip image keep aspect ratio', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_image_auto_height}
                    onChange={value => {
                        settingsLayouts.month_week_image_auto_height = value;
                    }}
                    description={__('If checked the tooltip images will be displayed with their original proportions preserved', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display event title on all cells', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.month_week_force_title}
                    onChange={value => {
                        settingsLayouts.month_week_force_title = value;
                    }}
                    description={__('If checked the event title will be displayed on each event cell', 'stachethemes_event_calendar_lite')}
                />

            </SectionCollapseContent>


            <SectionCollapseContent title={__('Grid layout', 'stachethemes_event_calendar_lite')} subtitle={__('Show grid layout settings', 'stachethemes_event_calendar_lite')}>

                <UncontrolledQtySelector
                    title={__('Columns', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_columns}
                    onChange={value => {
                        settingsLayouts.grid_columns = value;
                    }}
                    description={__('Columns number may change depending on the screen size', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_limit}
                    onChange={value => {
                        settingsLayouts.grid_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Gutter', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_gutter}
                    onChange={value => {
                        settingsLayouts.grid_gutter = value;
                    }}
                    description={__('Grid space between events in pixels', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Grid image keep aspect ratio', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.grid_image_auto_height}
                    onChange={value => {
                        settingsLayouts.grid_image_auto_height = value;
                    }}
                    description={__('If checked grid images will be displayed with their original proportions preserved', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.grid_next_button}
                    onChange={value => {
                        settingsLayouts.grid_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display counter', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.grid_counter}
                    onChange={value => {
                        settingsLayouts.grid_counter = value ? true : false;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stachethemes_event_calendar_lite')}
                    description={__('Display events in reverse order', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.grid_reverse_order}
                    onChange={value => {
                        settingsLayouts.grid_reverse_order = value ? true : false;
                    }}
                />


            </SectionCollapseContent>

            <SectionCollapseContent title={__('Box grid layout', 'stachethemes_event_calendar_lite')} subtitle={__('Show box grid layout settings', 'stachethemes_event_calendar_lite')}>

                <UncontrolledQtySelector
                    title={__('Columns', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_columns}
                    onChange={value => {
                        settingsLayouts.boxgrid_columns = value;
                    }}
                    description={__('Columns number may change depending on the screen size', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_limit}
                    onChange={value => {
                        settingsLayouts.boxgrid_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Gutter', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_gutter}
                    onChange={value => {
                        settingsLayouts.boxgrid_gutter = value;
                    }}
                    description={__('Grid space between events in pixels', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.boxgrid_next_button}
                    onChange={value => {
                        settingsLayouts.boxgrid_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stachethemes_event_calendar_lite')}
                    description={__('Display events in reverse order', 'stachethemes_event_calendar_lite')}
                    defaultValue={settingsLayouts.boxgrid_reverse_order}
                    onChange={value => {
                        settingsLayouts.boxgrid_reverse_order = value ? true : false;
                    }}
                />

            </SectionCollapseContent>

        </Section>
    )
}

export default Layouts;