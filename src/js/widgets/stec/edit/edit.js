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
                    {__('Full Calendar', 'stec')}
                </StecSpan>
            </StecDiv>

            {
                props.isSelected &&

                <>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('General', 'stec')}
                        subtitle={__('Toggle general settings', 'stec')}>

                        <InputSelect
                            title={__('Layout', 'stec')}
                            description={__('Initial calendar layout', 'stec')}
                            options={[
                                {
                                    label: __('Agenda', 'stec'),
                                    value: 'agenda'
                                },
                                {
                                    label: __('Month', 'stec'),
                                    value: 'month'
                                },
                                {
                                    label: __('Week', 'stec'),
                                    value: 'week'
                                },
                                {
                                    label: __('Day', 'stec'),
                                    value: 'day'
                                },
                                {
                                    label: __('Grid', 'stec'),
                                    value: 'grid'
                                },
                                {
                                    label: __('Box Grid', 'stec'),
                                    value: 'boxgrid'
                                },
                                {
                                    label: __('Map', 'stec'),
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
                            title={__('Layouts', 'stec')}
                            description={__('Available layouts', 'stec')}
                            options={[
                                {
                                    label: __('Agenda', 'stec'),
                                    value: 'agenda'
                                },
                                {
                                    label: __('Month', 'stec'),
                                    value: 'month'
                                },
                                {
                                    label: __('Week', 'stec'),
                                    value: 'week'
                                },
                                {
                                    label: __('Day', 'stec'),
                                    value: 'day'
                                },
                                {
                                    label: __('Grid', 'stec'),
                                    value: 'grid'
                                },
                                {
                                    label: __('Box Grid', 'stec'),
                                    value: 'boxgrid'
                                },
                                {
                                    label: __('Map', 'stec'),
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
                        title={__('Filters', 'stec')}
                        subtitle={__('Toggle filters settings', 'stec')}>

                        <InputText
                            title={__('Calendars', 'stec')}
                            description={__('Filter events by calendars. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__calendar}
                            onChange={(value) => {
                                setAttributes({ filter__calendar: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Organizers', 'stec')}
                            description={__('Filter events by organizers. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__organizer}
                            onChange={(value) => {
                                setAttributes({ filter__organizer: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Guests', 'stec')}
                            description={__('Filter events by guests. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__guest}
                            onChange={(value) => {
                                setAttributes({ filter__guest: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Locations', 'stec')}
                            description={__('Filter events by locations. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__location}
                            onChange={(value) => {
                                setAttributes({ filter__location: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Categories', 'stec')}
                            description={__('Filter events by categories. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__category}
                            onChange={(value) => {
                                setAttributes({ filter__category: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Author', 'stec')}
                            description={__('Filter events by authors. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={filter__author}
                            onChange={(value) => {
                                setAttributes({ filter__author: value });
                            }}
                        />


                        <Spacer />

                        <InputSelect
                            title={__('Min date', 'stec')}
                            description={__('Minimum date range', 'stec')}
                            options={[
                                {
                                    label: __('None', 'stec'),
                                    value: ''
                                },
                                {
                                    label: __('Now', 'stec'),
                                    value: 'now'
                                },
                                {
                                    label: __('Start of today', 'stec'),
                                    value: 'start_of_today'
                                },
                                {
                                    label: __('End of today', 'stec'),
                                    value: 'end_of_today'
                                },
                                {
                                    label: __('Start of current week', 'stec'),
                                    value: 'start_of_this_week'
                                },
                                {
                                    label: __('End of current week', 'stec'),
                                    value: 'end_of_this_week'
                                },
                                {
                                    label: __('Start of previous week', 'stec'),
                                    value: 'start_of_prev_week'
                                },
                                {
                                    label: __('End of previous week', 'stec'),
                                    value: 'end_of_prev_week'
                                },
                                {
                                    label: __('Start of next week', 'stec'),
                                    value: 'start_of_next_week'
                                },
                                {
                                    label: __('End of next week', 'stec'),
                                    value: 'end_of_next_week'
                                },
                                {
                                    label: __('Start of current month', 'stec'),
                                    value: 'start_of_this_month'
                                },
                                {
                                    label: __('End of current month', 'stec'),
                                    value: 'end_of_this_month'
                                },
                                {
                                    label: __('Start of previous month', 'stec'),
                                    value: 'start_of_prev_month'
                                },
                                {
                                    label: __('End of previous month', 'stec'),
                                    value: 'end_of_prev_month'
                                },
                                {
                                    label: __('Start of next month', 'stec'),
                                    value: 'start_of_next_month'
                                },
                                {
                                    label: __('End of next month', 'stec'),
                                    value: 'end_of_next_month'
                                },
                                {
                                    label: __('Start of current year', 'stec'),
                                    value: 'start_of_this_year'
                                },
                                {
                                    label: __('End of current year', 'stec'),
                                    value: 'end_of_this_year'
                                },
                                {
                                    label: __('Start of previous year', 'stec'),
                                    value: 'start_of_prev_year'
                                },
                                {
                                    label: __('End of previous year', 'stec'),
                                    value: 'end_of_prev_year'
                                },
                                {
                                    label: __('Start of next year', 'stec'),
                                    value: 'start_of_next_year'
                                },
                                {
                                    label: __('End of next year', 'stec'),
                                    value: 'end_of_next_year'
                                },
                                {
                                    label: __('3 months ahead', 'stec'),
                                    value: '3_months_ahead'
                                },
                                {
                                    label: __('3 months ago', 'stec'),
                                    value: '3_months_ago'
                                },
                                {
                                    label: __('6 months ahead', 'stec'),
                                    value: '6_months_ahead'
                                },
                                {
                                    label: __('6 months ago', 'stec'),
                                    value: '6_months_ago'
                                },
                                {
                                    label: __('1 year ahead', 'stec'),
                                    value: '1_year_ahead'
                                },
                                {
                                    label: __('1 year ago', 'stec'),
                                    value: '1_year_ago'
                                },
                                {
                                    label: __('2 years ahead', 'stec'),
                                    value: '2_years_ahead'
                                },
                                {
                                    label: __('2 years ago', 'stec'),
                                    value: '2_years_ago'
                                },
                                {
                                    label: __('Select Date', 'stec'),
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
                                    title={__('Select min date', 'stec')}
                                    description={__('Select min date', 'stec')}
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
                            title={__('Max date', 'stec')}
                            description={__('Maximum date range', 'stec')}
                            options={[
                                {
                                    label: __('None', 'stec'),
                                    value: ''
                                },
                                {
                                    label: __('Now', 'stec'),
                                    value: 'now'
                                },
                                {
                                    label: __('Start of today', 'stec'),
                                    value: 'start_of_today'
                                },
                                {
                                    label: __('End of today', 'stec'),
                                    value: 'end_of_today'
                                },
                                {
                                    label: __('Start of current week', 'stec'),
                                    value: 'start_of_this_week'
                                },
                                {
                                    label: __('End of current week', 'stec'),
                                    value: 'end_of_this_week'
                                },
                                {
                                    label: __('Start of previous week', 'stec'),
                                    value: 'start_of_prev_week'
                                },
                                {
                                    label: __('End of previous week', 'stec'),
                                    value: 'end_of_prev_week'
                                },
                                {
                                    label: __('Start of next week', 'stec'),
                                    value: 'start_of_next_week'
                                },
                                {
                                    label: __('End of next week', 'stec'),
                                    value: 'end_of_next_week'
                                },
                                {
                                    label: __('Start of current month', 'stec'),
                                    value: 'start_of_this_month'
                                },
                                {
                                    label: __('End of current month', 'stec'),
                                    value: 'end_of_this_month'
                                },
                                {
                                    label: __('Start of previous month', 'stec'),
                                    value: 'start_of_prev_month'
                                },
                                {
                                    label: __('End of previous month', 'stec'),
                                    value: 'end_of_prev_month'
                                },
                                {
                                    label: __('Start of next month', 'stec'),
                                    value: 'start_of_next_month'
                                },
                                {
                                    label: __('End of next month', 'stec'),
                                    value: 'end_of_next_month'
                                },
                                {
                                    label: __('Start of current year', 'stec'),
                                    value: 'start_of_this_year'
                                },
                                {
                                    label: __('End of current year', 'stec'),
                                    value: 'end_of_this_year'
                                },
                                {
                                    label: __('Start of previous year', 'stec'),
                                    value: 'start_of_prev_year'
                                },
                                {
                                    label: __('End of previous year', 'stec'),
                                    value: 'end_of_prev_year'
                                },
                                {
                                    label: __('Start of next year', 'stec'),
                                    value: 'start_of_next_year'
                                },
                                {
                                    label: __('End of next year', 'stec'),
                                    value: 'end_of_next_year'
                                },
                                {
                                    label: __('3 months ahead', 'stec'),
                                    value: '3_months_ahead'
                                },
                                {
                                    label: __('3 months ago', 'stec'),
                                    value: '3_months_ago'
                                },
                                {
                                    label: __('6 months ahead', 'stec'),
                                    value: '6_months_ahead'
                                },
                                {
                                    label: __('6 months ago', 'stec'),
                                    value: '6_months_ago'
                                },
                                {
                                    label: __('1 year ahead', 'stec'),
                                    value: '1_year_ahead'
                                },
                                {
                                    label: __('1 year ago', 'stec'),
                                    value: '1_year_ago'
                                },
                                {
                                    label: __('2 years ahead', 'stec'),
                                    value: '2_years_ahead'
                                },
                                {
                                    label: __('2 years ago', 'stec'),
                                    value: '2_years_ago'
                                },
                                {
                                    label: __('Select Date', 'stec'),
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
                                    title={__('Select date', 'stec')}
                                    description={__('Select max date', 'stec')}
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
                            title={__('Initial start date', 'stec')}
                            description={__('Select date', 'stec')}
                            includeTime={false}
                            value={filter__start_date}
                            onChange={(value) => {
                                setAttributes({ filter__start_date: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Featured only', 'stec')}
                            value={filter__featured}
                            onChange={value => {
                                setAttributes({ filter__featured: value });
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Misc', 'stec')}
                        subtitle={__('Misc settings', 'stec')}>

                        <InputTextarea
                            title={__('Extra attributes', 'stec')}
                            description={__('Add any extra attributes to the shortcode', 'stec')}
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