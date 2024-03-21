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
        author,
        stec_cal,
        stec_cat,
        stec_loc,
        stec_org,
        min_date,
        min_date_custom,
        max_date,
        max_date_custom,
        minmax_intersect,
        order,
        limit,
        gutter,
        event_status,
        open_events_in,
        prefer_external_link,
        display_tags,
        display_categories,
        display_tickets,
        display_description,
        featured_only,
        slider_bullets,
        slider_arrows,
        columns,
        extra,
        auto_slide,
        events_prefetch
    }, setAttributes } = props;

    const blockProps = useBlockProps({
        className: 'stec-widget-events-list-admin',
    });

    return (
        <StecDiv {...blockProps}>

            <StecDiv className='stec-widget-events-list-admin-preview-label'>
                <img src={`${getImageUrl('stachethemes-avatar.jpg')}`} alt="stachethemes" />
                <StecSpan>
                    {__('Events Slider Widget', 'stachethemes_event_calendar_lite')}
                </StecSpan>
            </StecDiv>

            {
                props.isSelected &&

                <>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('General', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Toggle general settings', 'stachethemes_event_calendar_lite')}>

                        <QtySelector
                            title={__('Events limit', 'stachethemes_event_calendar_lite')}
                            placeholder={__('Quantity', 'stachethemes_event_calendar_lite')}
                            min={1}
                            max={9999}
                            value={limit}
                            onChange={value => {
                                setAttributes({ limit: value });
                            }}
                        />


                        <Spacer />

                        <InputSelect
                            title={__('Order list', 'stachethemes_event_calendar_lite')}
                            value={order}
                            options={[
                                {
                                    value: 'desc',
                                    label: __('Descending', 'stachethemes_event_calendar_lite')
                                },
                                {
                                    value: 'asc',
                                    label: __('Ascending', 'stachethemes_event_calendar_lite')
                                },
                            ]}
                            onChange={(newValue) => {
                                setAttributes({ order: newValue });
                            }}
                        />

                        <Spacer />

                        <InputSelect
                            title={__('Open events in', 'stachethemes_event_calendar_lite')}
                            value={open_events_in}
                            options={[
                                {
                                    value: '_self',
                                    label: __('Same Window', 'stachethemes_event_calendar_lite')
                                },
                                {
                                    value: '_blank',
                                    label: __('New Window', 'stachethemes_event_calendar_lite')
                                },
                            ]}
                            onChange={(newValue) => {
                                setAttributes({ open_events_in: newValue });
                            }}
                        />

                        <Spacer />

                        <QtySelector
                            title={__('Columns', 'stachethemes_event_calendar_lite')}
                            min={1}
                            max={6}
                            value={columns}
                            onChange={value => {
                                setAttributes({ columns: value });
                            }}
                        />
                        <Spacer />

                        <QtySelector
                            title={__('Gutter', 'stachethemes_event_calendar_lite')}
                            min={0}
                            max={9999}
                            value={gutter}
                            onChange={value => {
                                setAttributes({ gutter: value });
                            }}
                        />

                        <Spacer />


                        <InputCheckbox
                            title={__("Use external link", 'stachethemes_event_calendar_lite')}
                            value={prefer_external_link}
                            onChange={value => {
                                setAttributes({ prefer_external_link: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show tags', 'stachethemes_event_calendar_lite')}
                            value={display_tags}
                            onChange={value => {
                                setAttributes({ display_tags: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show categories', 'stachethemes_event_calendar_lite')}
                            value={display_categories}
                            onChange={value => {
                                setAttributes({ display_categories: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show description', 'stachethemes_event_calendar_lite')}
                            value={display_description}
                            onChange={value => {
                                setAttributes({ display_description: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Show tickets', 'stachethemes_event_calendar_lite')}
                            value={display_tickets}
                            onChange={value => {
                                setAttributes({ display_tickets: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Featured only', 'stachethemes_event_calendar_lite')}
                            value={featured_only}
                            onChange={value => {
                                setAttributes({ featured_only: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Slider bullets', 'stachethemes_event_calendar_lite')}
                            value={slider_bullets}
                            onChange={value => {
                                setAttributes({ slider_bullets: value });
                            }}
                        />

                        <Spacer />

                        <InputCheckbox
                            title={__('Slider arrows', 'stachethemes_event_calendar_lite')}
                            value={slider_arrows}
                            onChange={value => {
                                setAttributes({ slider_arrows: value });
                            }}
                        />

                        <Spacer />

                        <QtySelector
                            title={__('Auto slide', 'stachethemes_event_calendar_lite')}
                            description={__('Auto slide delay in seconds. Set to 0 to turn off', 'stachethemes_event_calendar_lite')}
                            min={1}
                            max={10}
                            value={auto_slide}
                            onChange={value => {
                                setAttributes({ auto_slide: value });
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Filters', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Toggle filters settings', 'stachethemes_event_calendar_lite')}>

                        <InputSelect
                            title={__('Event Status', 'stachethemes_event_calendar_lite')}
                            multiple={true}
                            description={__('Filter events by status', 'stachethemes_event_calendar_lite')}
                            options={
                                [
                                    {
                                        label: __('Scheduled', 'stachethemes_event_calendar_lite'),
                                        value: 'EventScheduled'
                                    },
                                    {
                                        label: __('Moved Online', 'stachethemes_event_calendar_lite'),
                                        value: 'EventMovedOnline'
                                    },
                                    {
                                        label: __('Postponed', 'stachethemes_event_calendar_lite'),
                                        value: 'EventPostponed'
                                    },
                                    {
                                        label: __('Rescheduled', 'stachethemes_event_calendar_lite'),
                                        value: 'EventRescheduled'
                                    },
                                    {
                                        label: __('Cancelled', 'stachethemes_event_calendar_lite'),
                                        value: 'EventCancelled'
                                    },
                                ]
                            }
                            value={event_status}
                            onChange={(value) => {
                                setAttributes({ event_status: value });
                            }}
                        />

                        <InputText
                            title={__('Calendars', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by calendars. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={stec_cal}
                            onChange={(value) => {
                                setAttributes({ stec_cal: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Categories', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by categories. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={stec_cat}
                            onChange={(value) => {
                                setAttributes({ stec_cat: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Locations', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by locations. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={stec_loc}
                            onChange={(value) => {
                                setAttributes({ stec_loc: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Organizers', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by organizers. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={stec_org}
                            onChange={(value) => {
                                setAttributes({ stec_org: value });
                            }}
                        />

                        <Spacer />

                        <InputText
                            title={__('Author', 'stachethemes_event_calendar_lite')}
                            description={__('Filter events by authors. Comma separated id values', 'stachethemes_event_calendar_lite')}
                            placeholder='101,102,103...'
                            value={author}
                            onChange={(value) => {
                                setAttributes({ author: value });
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
                            value={min_date}
                            onChange={(value) => {
                                setAttributes({ min_date: value });
                            }}
                        />

                        {
                            'custom' === min_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select min date', 'stachethemes_event_calendar_lite')}
                                    description={__('Select min date', 'stachethemes_event_calendar_lite')}
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
                            value={max_date}
                            onChange={(value) => {
                                setAttributes({ max_date: value });
                            }}
                        />

                        {
                            'custom' === max_date && <>
                                <Spacer />

                                <DatePicker
                                    title={__('Select date', 'stachethemes_event_calendar_lite')}
                                    description={__('Select max date', 'stachethemes_event_calendar_lite')}
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
                            value={minmax_intersect}
                            title={__('Include events intersecting min/max date', 'stec')}
                            onChange={value => {
                                setAttributes({ minmax_intersect: value })
                            }}
                        />

                    </SectionCollapseContent>

                    <SectionCollapseContent
                        collapsed={true}
                        title={__('Misc', 'stachethemes_event_calendar_lite')}
                        subtitle={__('Toggle misc settings', 'stachethemes_event_calendar_lite')}>

                        <InputCheckbox
                            value={events_prefetch}
                            title={__('Prefetch events', 'stachethemes_event_calendar_lite')}
                            description={__('Prefetch events on page load', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                setAttributes({ events_prefetch: value })
                            }}
                        />

                        <Spacer />

                        <InputTextarea

                            title={__('Extra attributes', 'stachethemes_event_calendar_lite')}
                            description={__('Add any extra attributes to the shortcode', 'stachethemes_event_calendar_lite')}
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