import DatePicker from '@Stec/CommonComponents/DatePicker';
import InputCheckbox from '@Stec/CommonComponents/InputCheckbox';
import InputSelect from '@Stec/CommonComponents/InputSelect';
import InputText from '@Stec/CommonComponents/InputText';
import InputTextarea from '@Stec/CommonComponents/InputTextarea';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { getImageUrl } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
const { useBlockProps } = wp.blockEditor;

const Edit = (props) => {

    const { attributes: {
        calendar__layout,
        calendar__layouts,
        filter__featured,
        filter__calendar,
        filter__category,
        filter__organizer,
        filter__location,
        filter__guest,
        filter__min_date,
        filter__min_date_custom,
        filter__max_date,
        filter__max_date_custom,
        filter__minmax_intersect,
        filter__start_date,
        filter__author,
        extra
    }, setAttributes, } = props;

    const blockProps = useBlockProps({
        className: 'stec-widget-stec-admin',
    });

    return (
        <StecDiv {...blockProps}>

            <StecDiv className='stec-widget-stec-admin-preview-label'>
                <img src={`${getImageUrl('stachethemes-avatar.jpg')}`} alt="stachethemes" />
                <StecSpan>
                    {__('Full Calendar', 'stachethemes_event_calendar_lite')}
                </StecSpan>
            </StecDiv>

            {
                props.isSelected &&

                <>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('General', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Toggle general settings', 'stachethemes_event_calendar_lite')}>

                        <InputSelect
                            title={__('Layout', 'stachethemes_event_calendar_lite')}
                            description={__('Initial calendar layout', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Agenda', 'stachethemes_event_calendar_lite'),
                                    value: 'agenda'
                                },
                                {
                                    label: __('Month', 'stachethemes_event_calendar_lite'),
                                    value: 'month'
                                },
                                {
                                    label: __('Week', 'stachethemes_event_calendar_lite'),
                                    value: 'week'
                                },
                                {
                                    label: __('Day', 'stachethemes_event_calendar_lite'),
                                    value: 'day'
                                },
                                {
                                    label: __('Grid', 'stachethemes_event_calendar_lite'),
                                    value: 'grid'
                                },
                                {
                                    label: __('Box Grid', 'stachethemes_event_calendar_lite'),
                                    value: 'boxgrid'
                                },
                                {
                                    label: __('Map', 'stachethemes_event_calendar_lite'),
                                    value: 'map'
                                }
                            ]}
                            value={calendar__layout}
                            onChange={(value) => {
                                setAttributes({ calendar__layout: value });
                            }}
                        />

                        <Spacer />

                        <InputSelect
                            multiple={true}
                            title={__('Layouts', 'stachethemes_event_calendar_lite')}
                            description={__('Available layouts', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('Agenda', 'stachethemes_event_calendar_lite'),
                                    value: 'agenda'
                                },
                                {
                                    label: __('Month', 'stachethemes_event_calendar_lite'),
                                    value: 'month'
                                },
                                {
                                    label: __('Week', 'stachethemes_event_calendar_lite'),
                                    value: 'week'
                                },
                                {
                                    label: __('Day', 'stachethemes_event_calendar_lite'),
                                    value: 'day'
                                },
                                {
                                    label: __('Grid', 'stachethemes_event_calendar_lite'),
                                    value: 'grid'
                                },
                                {
                                    label: __('Box Grid', 'stachethemes_event_calendar_lite'),
                                    value: 'boxgrid'
                                },
                                {
                                    label: __('Map', 'stachethemes_event_calendar_lite'),
                                    value: 'map'
                                }
                            ]}
                            value={calendar__layouts}
                            onChange={(value) => {
                                setAttributes({ calendar__layouts: value });
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Filters', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Toggle filters settings', 'stachethemes_event_calendar_lite')}>

                        <InputText
                            title={__('Calendars', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by calendars. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__calendar}
                            onChange={(value) => {
                                setAttributes({ filter__calendar: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Organizers', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by organizers. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__organizer}
                            onChange={(value) => {
                                setAttributes({ filter__organizer: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Guests', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by guests. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__guest}
                            onChange={(value) => {
                                setAttributes({ filter__guest: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Locations', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by locations. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__location}
                            onChange={(value) => {
                                setAttributes({ filter__location: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Categories', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by categories. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__category}
                            onChange={(value) => {
                                setAttributes({ filter__category: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Author', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by authors. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={filter__author}
                            onChange={(value) => {
                                setAttributes({ filter__author: value });
                            }}
                        />


                        <Spacer />

                        <InputSelect
                            title={__('Min date', 'stachethemes_event_calendar_lite')}
                            description={__('Minimum date range', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('None', 'stachethemes_event_calendar_lite'),
                                    value: ''
                                },
                                {
                                    label: __('Now', 'stachethemes_event_calendar_lite'),
                                    value: 'now'
                                },
                                {
                                    label: __('Start of today', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_today'
                                },
                                {
                                    label: __('End of today', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_today'
                                },
                                {
                                    label: __('Start of current week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_week'
                                },
                                {
                                    label: __('End of current week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_week'
                                },
                                {
                                    label: __('Start of previous week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_week'
                                },
                                {
                                    label: __('End of previous week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_week'
                                },
                                {
                                    label: __('Start of next week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_week'
                                },
                                {
                                    label: __('End of next week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_week'
                                },
                                {
                                    label: __('Start of current month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_month'
                                },
                                {
                                    label: __('End of current month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_month'
                                },
                                {
                                    label: __('Start of previous month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_month'
                                },
                                {
                                    label: __('End of previous month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_month'
                                },
                                {
                                    label: __('Start of next month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_month'
                                },
                                {
                                    label: __('End of next month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_month'
                                },
                                {
                                    label: __('Start of current year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_year'
                                },
                                {
                                    label: __('End of current year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_year'
                                },
                                {
                                    label: __('Start of previous year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_year'
                                },
                                {
                                    label: __('End of previous year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_year'
                                },
                                {
                                    label: __('Start of next year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_year'
                                },
                                {
                                    label: __('End of next year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_year'
                                },
                                {
                                    label: __('3 months ahead', 'stachethemes_event_calendar_lite'),
                                    value: '3_months_ahead'
                                },
                                {
                                    label: __('3 months ago', 'stachethemes_event_calendar_lite'),
                                    value: '3_months_ago'
                                },
                                {
                                    label: __('6 months ahead', 'stachethemes_event_calendar_lite'),
                                    value: '6_months_ahead'
                                },
                                {
                                    label: __('6 months ago', 'stachethemes_event_calendar_lite'),
                                    value: '6_months_ago'
                                },
                                {
                                    label: __('1 year ahead', 'stachethemes_event_calendar_lite'),
                                    value: '1_year_ahead'
                                },
                                {
                                    label: __('1 year ago', 'stachethemes_event_calendar_lite'),
                                    value: '1_year_ago'
                                },
                                {
                                    label: __('2 years ahead', 'stachethemes_event_calendar_lite'),
                                    value: '2_years_ahead'
                                },
                                {
                                    label: __('2 years ago', 'stachethemes_event_calendar_lite'),
                                    value: '2_years_ago'
                                },
                                {
                                    label: __('Select Date', 'stachethemes_event_calendar_lite'),
                                    value: 'custom'
                                },
                            ]}
                            value={filter__min_date}
                            onChange={(value) => {

                                if ('custom' !== value) {
                                    setAttributes({ filter__min_date_custom: '' });
                                }

                                setAttributes({ filter__min_date: value });
                            }}
                        />

                        {
                            'custom' === filter__min_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select min date', 'stachethemes_event_calendar_lite')}
                                    description={__('Select min date', 'stachethemes_event_calendar_lite')}
                                    includeTime={false}
                                    value={filter__min_date_custom}
                                    onChange={(value) => {
                                        setAttributes({ filter__min_date_custom: value });
                                    }}
                                />

                            </>
                        }

                        <Spacer />

                        <InputSelect
                            title={__('Max date', 'stachethemes_event_calendar_lite')}
                            description={__('Maximum date range', 'stachethemes_event_calendar_lite')}
                            options={[
                                {
                                    label: __('None', 'stachethemes_event_calendar_lite'),
                                    value: ''
                                },
                                {
                                    label: __('Now', 'stachethemes_event_calendar_lite'),
                                    value: 'now'
                                },
                                {
                                    label: __('Start of today', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_today'
                                },
                                {
                                    label: __('End of today', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_today'
                                },
                                {
                                    label: __('Start of current week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_week'
                                },
                                {
                                    label: __('End of current week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_week'
                                },
                                {
                                    label: __('Start of previous week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_week'
                                },
                                {
                                    label: __('End of previous week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_week'
                                },
                                {
                                    label: __('Start of next week', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_week'
                                },
                                {
                                    label: __('End of next week', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_week'
                                },
                                {
                                    label: __('Start of current month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_month'
                                },
                                {
                                    label: __('End of current month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_month'
                                },
                                {
                                    label: __('Start of previous month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_month'
                                },
                                {
                                    label: __('End of previous month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_month'
                                },
                                {
                                    label: __('Start of next month', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_month'
                                },
                                {
                                    label: __('End of next month', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_month'
                                },
                                {
                                    label: __('Start of current year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_this_year'
                                },
                                {
                                    label: __('End of current year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_this_year'
                                },
                                {
                                    label: __('Start of previous year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_prev_year'
                                },
                                {
                                    label: __('End of previous year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_prev_year'
                                },
                                {
                                    label: __('Start of next year', 'stachethemes_event_calendar_lite'),
                                    value: 'start_of_next_year'
                                },
                                {
                                    label: __('End of next year', 'stachethemes_event_calendar_lite'),
                                    value: 'end_of_next_year'
                                },
                                {
                                    label: __('3 months ahead', 'stachethemes_event_calendar_lite'),
                                    value: '3_months_ahead'
                                },
                                {
                                    label: __('3 months ago', 'stachethemes_event_calendar_lite'),
                                    value: '3_months_ago'
                                },
                                {
                                    label: __('6 months ahead', 'stachethemes_event_calendar_lite'),
                                    value: '6_months_ahead'
                                },
                                {
                                    label: __('6 months ago', 'stachethemes_event_calendar_lite'),
                                    value: '6_months_ago'
                                },
                                {
                                    label: __('1 year ahead', 'stachethemes_event_calendar_lite'),
                                    value: '1_year_ahead'
                                },
                                {
                                    label: __('1 year ago', 'stachethemes_event_calendar_lite'),
                                    value: '1_year_ago'
                                },
                                {
                                    label: __('2 years ahead', 'stachethemes_event_calendar_lite'),
                                    value: '2_years_ahead'
                                },
                                {
                                    label: __('2 years ago', 'stachethemes_event_calendar_lite'),
                                    value: '2_years_ago'
                                },
                                {
                                    label: __('Select Date', 'stachethemes_event_calendar_lite'),
                                    value: 'custom'
                                },
                            ]}
                            value={filter__max_date}
                            onChange={(value) => {

                                if ('custom' !== value) {
                                    setAttributes({ filter__max_date_custom: '' });
                                }

                                setAttributes({ filter__max_date: value });
                            }}
                        />

                        {
                            'custom' === filter__max_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select date', 'stachethemes_event_calendar_lite')}
                                    description={__('Select max date', 'stachethemes_event_calendar_lite')}
                                    includeTime={false}
                                    value={filter__max_date_custom}
                                    onChange={(value) => {
                                        setAttributes({ filter__max_date: value });
                                    }}
                                />

                            </>
                        }

                        <Spacer />

                        <DatePicker
                            title={__('Initial start date', 'stachethemes_event_calendar_lite')}
                            description={__('Select date', 'stachethemes_event_calendar_lite')}
                            includeTime={false}
                            value={filter__start_date}
                            onChange={(value) => {
                                setAttributes({ filter__start_date: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            value={filter__minmax_intersect}
                            title={__('Include events intersecting min/max date', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                setAttributes({ filter__minmax_intersect: value })
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Featured only', 'stachethemes_event_calendar_lite')}
                            value={filter__featured}
                            onChange={value => {
                                setAttributes({ filter__featured: value });
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Misc', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Misc settings', 'stachethemes_event_calendar_lite')}>

                        <InputTextarea
                            title={__('Extra attributes', 'stachethemes_event_calendar_lite')}
                            description={__('Add any extra attributes to the shortcode', 'stachethemes_event_calendar_lite')}
                            value={extra}
                            onChange={(value) => {
                                setAttributes({ extra: value });
                            }}
                        />


                    </SectionCollapseContent>

                </>
            }


        </StecDiv>
    );
};

export default Edit;