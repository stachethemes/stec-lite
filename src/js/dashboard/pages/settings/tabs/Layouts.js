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
            <SectionCollapseContent title={__('Agenda layout', 'stec')} subtitle={__('Show agenda layout settings', 'stec')}>

                <UncontrolledInputCheckbox
                    defaultValue={settingsLayouts.agenda_slider}
                    title={__('Agenda slider', 'stec')}
                    description={__(`Display agenda slider`, 'stec')}
                    onChange={value => {
                        settingsLayouts.agenda_slider = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsLayouts.agenda_list}
                    title={__('Agenda list', 'stec')}
                    description={__(`Display agenda list`, 'stec')}
                    onChange={value => {
                        settingsLayouts.agenda_list = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stec')}
                    defaultValue={settingsLayouts.agenda_list_next_button}
                    onChange={value => {
                        settingsLayouts.agenda_list_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stec')}
                    description={__('Display events in reverse order', 'stec')}
                    defaultValue={settingsLayouts.agenda_list_reverse_order}
                    onChange={value => {
                        settingsLayouts.agenda_list_reverse_order = value ? true : false;
                    }}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.agenda_list_limit}
                    onChange={value => {
                        settingsLayouts.agenda_list_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stec')}
                />

            </SectionCollapseContent>

            <SectionCollapseContent title={__('Month & week layout', 'stec')} subtitle={__('Show month & week layout settings', 'stec')}>

                <UncontrolledInputSelect
                    defaultValue={settingsLayouts.month_week_style}
                    title={__('Month & week cells style', 'stec')}
                    options={[
                        {
                            label: __('Fixed', 'stec'),
                            value: 'fixed'
                        },
                        {
                            label: __('Auto', 'stec'),
                            value: 'auto'
                        }
                    ]}
                    description={__(`Fixed style keeps the cells height static while Auto will expand them depending on the number of events in the cells`, 'stec')}
                    onChange={value => {
                        settingsLayouts.month_week_style = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Quick open', 'stec')}
                    defaultValue={settingsLayouts.month_week_quick_open}
                    onChange={value => {
                        settingsLayouts.month_week_quick_open = value;
                    }}
                    description={__('If checked, the event will open in modal window when clicked over without expanding the entire list', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Tooltip image keep aspect ratio', 'stec')}
                    defaultValue={settingsLayouts.month_week_image_auto_height}
                    onChange={value => {
                        settingsLayouts.month_week_image_auto_height = value;
                    }}
                    description={__('If checked the tooltip images will be displayed with their original proportions preserved', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display event title on all cells', 'stec')}
                    defaultValue={settingsLayouts.month_week_force_title}
                    onChange={value => {
                        settingsLayouts.month_week_force_title = value;
                    }}
                    description={__('If checked the event title will be displayed on each event cell', 'stec')}
                />

            </SectionCollapseContent>


            <SectionCollapseContent title={__('Grid layout', 'stec')} subtitle={__('Show grid layout settings', 'stec')}>

                <UncontrolledQtySelector
                    title={__('Columns', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_columns}
                    onChange={value => {
                        settingsLayouts.grid_columns = value;
                    }}
                    description={__('Columns number may change depending on the screen size', 'stec')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_limit}
                    onChange={value => {
                        settingsLayouts.grid_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stec')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Gutter', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.grid_gutter}
                    onChange={value => {
                        settingsLayouts.grid_gutter = value;
                    }}
                    description={__('Grid space between events in pixels', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Grid image keep aspect ratio', 'stec')}
                    defaultValue={settingsLayouts.grid_image_auto_height}
                    onChange={value => {
                        settingsLayouts.grid_image_auto_height = value;
                    }}
                    description={__('If checked grid images will be displayed with their original proportions preserved', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stec')}
                    defaultValue={settingsLayouts.grid_next_button}
                    onChange={value => {
                        settingsLayouts.grid_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display counter', 'stec')}
                    defaultValue={settingsLayouts.grid_counter}
                    onChange={value => {
                        settingsLayouts.grid_counter = value ? true : false;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stec')}
                    description={__('Display events in reverse order', 'stec')}
                    defaultValue={settingsLayouts.grid_reverse_order}
                    onChange={value => {
                        settingsLayouts.grid_reverse_order = value ? true : false;
                    }}
                />


            </SectionCollapseContent>

            <SectionCollapseContent title={__('Box grid layout', 'stec')} subtitle={__('Show box grid layout settings', 'stec')}>

                <UncontrolledQtySelector
                    title={__('Columns', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_columns}
                    onChange={value => {
                        settingsLayouts.boxgrid_columns = value;
                    }}
                    description={__('Columns number may change depending on the screen size', 'stec')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Events limit', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_limit}
                    onChange={value => {
                        settingsLayouts.boxgrid_limit = value;
                    }}
                    description={__('Number of events to display per request', 'stec')}
                />

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Gutter', 'stec')}
                    min={1}
                    max={100}
                    defaultValue={settingsLayouts.boxgrid_gutter}
                    onChange={value => {
                        settingsLayouts.boxgrid_gutter = value;
                    }}
                    description={__('Grid space between events in pixels', 'stec')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Display "next" button', 'stec')}
                    defaultValue={settingsLayouts.boxgrid_next_button}
                    onChange={value => {
                        settingsLayouts.boxgrid_next_button = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    title={__('Reverse events order', 'stec')}
                    description={__('Display events in reverse order', 'stec')}
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