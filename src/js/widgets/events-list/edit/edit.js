import DatePicker from '@Stec/CommonComponents/DatePicker';
import InputCheckbox from '@Stec/CommonComponents/InputCheckbox';
import InputSelect from '@Stec/CommonComponents/InputSelect';
import InputText from '@Stec/CommonComponents/InputText';
import InputTextarea from '@Stec/CommonComponents/InputTextarea';
import QtySelector from '@Stec/CommonComponents/QtySelector';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { getImageUrl } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

const { useBlockProps } = wp.blockEditor;

const Edit = (props) => {

    const { attributes: {
        title,
        stec_cal,
        stec_cat,
        stec_loc,
        stec_org,
        author,
        min_date,
        min_date_custom,
        max_date,
        max_date_custom,
        order,
        limit,
        event_status,
        open_events_in,
        prefer_external_link,
        display_tags,
        display_thumbnail,
        display_tickets,
        display_locations,
        display_categories,
        display_description,
        featured_only,
        extra,
        events_prefetch
    }, setAttributes, } = props;

    const blockProps = useBlockProps({
        className: 'stec-widget-events-list-admin',
    });

    return (
        <StecDiv {...blockProps}>

            <StecDiv className='stec-widget-events-list-admin-preview-label'>
                <img src={`${getImageUrl('stachethemes-avatar.jpg')}`} alt="stachethemes" />
                <StecSpan>
                    {__('Events List Widget', 'stec')}
                </StecSpan>
            </StecDiv>

            {
                props.isSelected &&

                <>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('General', 'stec')}
                        subtitle={__('Toggle general settings', 'stec')}>

                        <QtySelector
                            title={__('Events Limit', 'stec')}
                            placeholder={__('Quantity', 'stec')}
                            min={1}
                            max={9999}
                            value={limit}
                            onChange={value => {
                                setAttributes({ limit: value });
                            }}
                        />

                        <Spacer />

                        <InputSelect
                            title={__('Order List', 'stec')}
                            value={order}
                            options={[
                                {
                                    value: 'desc',
                                    label: __('Descending', 'stec')
                                },
                                {
                                    value: 'asc',
                                    label: __('Ascending', 'stec')
                                },
                            ]}
                            onChange={(newValue) => {
                                setAttributes({ order: newValue });
                            }}
                        />

                        <Spacer />

                        <InputSelect
                            title={__('Open events in', 'stec')}
                            value={open_events_in}
                            options={[
                                {
                                    value: '_self',
                                    label: __('Same Window', 'stec')
                                },
                                {
                                    value: '_blank',
                                    label: __('New Window', 'stec')
                                },
                            ]}
                            onChange={(newValue) => {
                                setAttributes({ open_events_in: newValue });
                            }}
                        />

                        <Spacer />
                        <InputCheckbox
                            title={__("Use external link", 'stec')}
                            value={prefer_external_link}
                            onChange={value => {
                                setAttributes({ prefer_external_link: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show Tags', 'stec')}
                            value={display_tags}
                            onChange={value => {
                                setAttributes({ display_tags: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show Thumbnail', 'stec')}
                            value={display_thumbnail}
                            onChange={value => {
                                setAttributes({ display_thumbnail: value });
                            }}
                        />

                        <Spacer />
                        <InputCheckbox
                            title={__('Show Categories', 'stec')}
                            value={display_categories}
                            onChange={value => {
                                setAttributes({ display_categories: value });
                            }}
                        />
                        <Spacer />
                        <InputCheckbox
                            title={__('Show Locations', 'stec')}
                            value={display_locations}
                            onChange={value => {
                                setAttributes({ display_locations: value });
                            }}
                        />
                        <Spacer />
                        <InputCheckbox
                            title={__('Show Tickets', 'stec')}
                            value={display_tickets}
                            onChange={value => {
                                setAttributes({ display_tickets: value });
                            }}
                        />
                        <Spacer />
                        <InputCheckbox
                            title={__('Show Description', 'stec')}
                            value={display_description}
                            onChange={value => {
                                setAttributes({ display_description: value });
                            }}
                        />


                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Filters', 'stec')}
                        subtitle={__('Toggle filters settings', 'stec')}>

                        <InputSelect
                            title={__('Event Status', 'stec')}
                            multiple={true}
                            description={__('Filter events by status', 'stec')}
                            options={
                                [
                                    {
                                        label: __('Scheduled', 'stec'),
                                        value: 'EventScheduled'
                                    },
                                    {
                                        label: __('Moved Online', 'stec'),
                                        value: 'EventMovedOnline'
                                    },
                                    {
                                        label: __('Postponed', 'stec'),
                                        value: 'EventPostponed'
                                    },
                                    {
                                        label: __('Rescheduled', 'stec'),
                                        value: 'EventRescheduled'
                                    },
                                    {
                                        label: __('Cancelled', 'stec'),
                                        value: 'EventCancelled'
                                    },
                                ]
                            }
                            value={event_status}
                            onChange={(value) => {
                                setAttributes({ event_status: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Calendars', 'stec')}
                            description={__('Filter events by calendars. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={stec_cal}
                            onChange={(value) => {
                                setAttributes({ stec_cal: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Categories', 'stec')}
                            description={__('Filter events by categories. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={stec_cat}
                            onChange={(value) => {
                                setAttributes({ stec_cat: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Locations', 'stec')}
                            description={__('Filter events by locations. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={stec_loc}
                            onChange={(value) => {
                                setAttributes({ stec_loc: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Organizers', 'stec')}
                            description={__('Filter events by organizers. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={stec_org}
                            onChange={(value) => {
                                setAttributes({ stec_org: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Author', 'stec')}
                            description={__('Filter events by authors. Comma separated id values', 'stec')}
                            placeholder='101,102,103...'
                            value={author}
                            onChange={(value) => {
                                setAttributes({ author: value });
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
                                }
                            ]}
                            value={min_date}
                            onChange={(value) => {
                                setAttributes({ min_date: value });
                            }}
                        />

                        {
                            'custom' === min_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select min date', 'stec')}
                                    description={__('Select min date', 'stec')}
                                    includeTime={false}
                                    value={min_date_custom}
                                    onChange={(value) => {
                                        setAttributes({ min_date_custom: value });
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
                                }
                            ]}
                            value={max_date}
                            onChange={(value) => {
                                setAttributes({ max_date: value });
                            }}
                        />

                        {
                            'custom' === max_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select date', 'stec')}
                                    description={__('Select max date', 'stec')}
                                    includeTime={false}
                                    value={max_date_custom}
                                    onChange={(value) => {
                                        setAttributes({ max_date_custom: value });
                                    }}
                                />

                            </>
                        }

                        <Spacer />

                        <InputCheckbox
                            title={__('Featured only', 'stec')}
                            value={featured_only}
                            onChange={value => {
                                setAttributes({ featured_only: value });
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Misc', 'stec')}
                        subtitle={__('Toggle misc settings', 'stec')}>

                        <InputCheckbox
                            value={events_prefetch}
                            title={__('Prefetch events', 'stec')}
                            description={__('Prefetch events on page load', 'stec')}
                            onChange={value => {
                                setAttributes({ events_prefetch: value })
                            }}
                        />

                        <Spacer />

                        <InputTextarea

                            title={__('Extra attributes', 'stec')}
                            description={__('Add any extra attributes to the shortcode', 'stec')}
                            includeTime={false}
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