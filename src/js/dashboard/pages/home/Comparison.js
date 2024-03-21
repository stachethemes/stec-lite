import Button from '@Stec/CommonComponents/Button';
import Modal from '@Stec/CommonComponents/Modal';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

const ComparisonTable = () => {

    const features = [
        {
            id: 'woocommerce',
            title: __('Tickets & Products', 'stachethemes_event_calendar_lite'),
            desc: __('Integrate WooCommerce with the ability to sell event tickets and products directly from your calendar, add simple or variable tickets, generate Order and Ticket QR codes, set ticket quantity per event occurrence, and scan tickets using a QR code scanner.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'buddypress',
            title: __('BuddyPress', 'stachethemes_event_calendar_lite'),
            desc: __('Integrate with BuddyPress to display events on user profiles, group pages, and the activity page, allowing the creation and display of group events.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'rsvp',
            title: __('RSVP', 'stachethemes_event_calendar_lite'),
            desc: __('Enable users to RSVP to events, set RSVP limits, specify limits per RSVP, define RSVP deadlines, implement a waiting list, and display the RSVP list.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'event-submission-form',
            title: __('Event Submission Form', 'stachethemes_event_calendar_lite'),
            desc: __('Allow users or visitors to submit events from the frontend.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'comments',
            title: __('Comments', 'stachethemes_event_calendar_lite'),
            desc: __('Enable users to comment on events and provide the option to choose between Facebook or an internal comments form.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'forecast',
            title: __('Weather Forecast', 'stachethemes_event_calendar_lite'),
            desc: __('Display weather forecast for your events.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'ai',
            title: __('A.I.', 'stachethemes_event_calendar_lite'),
            desc: __('A.I. Content Enhancer.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'import-export',
            title: __('Import & Export', 'stachethemes_event_calendar_lite'),
            desc: __('Import events from sources such as Facebook or Google Calendar, import events from CSV files, and export events to both CSV and ICS files.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'cron',
            title: __('Cron jobs', 'stachethemes_event_calendar_lite'),
            desc: __('Schedule cron jobs to automate event imports.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'builder',
            title: __('Builder', 'stachethemes_event_calendar_lite'),
            desc: __('Utilize a built-in drag & drop builder to create event layouts and event submission form layouts effortlessly.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'single-page',
            title: __('Event Single Page', 'stachethemes_event_calendar_lite'),
            desc: __('Display events on a single page.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'organizers-page',
            title: __('Organizers Page', 'stachethemes_event_calendar_lite'),
            desc: __('Display organizers on a single page.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'guests-page',
            title: __('Guests Page', 'stachethemes_event_calendar_lite'),
            desc: __('Display organizers on a single page.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'locations-page',
            title: __('Locations Page', 'stachethemes_event_calendar_lite'),
            desc: __('Display locations on a single page.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'translatable',
            title: __('Translatable', 'stachethemes_event_calendar_lite'),
            desc: __('Translate the plugin to any language.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'multilingual',
            title: __('Multilingual Support', 'stachethemes_event_calendar_lite'),
            desc: __('Support for multilingual websites using WPML, Polylang and similar plugins.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'multi-site',
            title: __('Multi-site Ready', 'stachethemes_event_calendar_lite'),
            desc: __('Use the plugin on a WordPress multi-site network.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'gutenberg',
            title: __('Gutenberg Blocks', 'stachethemes_event_calendar_lite'),
            desc: __('Display the calendar and its widgets with Gutenberg blocks.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'elementor',
            title: __('Elementor Widgets', 'stachethemes_event_calendar_lite'),
            desc: __('Display the calendar and its widgets with Elementor widgets.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'color',
            title: __('Color Customizable', 'stachethemes_event_calendar_lite'),
            desc: __('Customize the calendar colors to match your website.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'share',
            title: __('Social Integration', 'stachethemes_event_calendar_lite'),
            desc: __('Share events on social networks.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'embed',
            title: __('Embed', 'stachethemes_event_calendar_lite'),
            desc: __('Embed events on other websites.', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'repeatability',
            title: __('Repeatability', 'stachethemes_event_calendar_lite'),
            desc: __('Create repeating events with options to add repeat exceptions, set daily, weekly, monthly, and yearly repeating events, repeat events on specific days or dates, and insert custom RRULE repeat schemes.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'agenda',
            title: __('Agenda Layout', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a list.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'agenda-unbound',
            title: __('Agenda Layout (Unbound)', 'stachethemes_event_calendar_lite'),
            desc: [
                __('Display events in a list.', 'stachethemes_event_calendar_lite'),
                __('Unbound mode will continue to display events that fall outside the current month.', 'stachethemes_event_calendar_lite')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'month',
            title: __('Month & Week Layout', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a calendar month or week layout.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'month-print',
            title: __('Month & Week Layout Print', 'stachethemes_event_calendar_lite'),
            desc: __('Print option for month & week layouts', 'stachethemes_event_calendar_lite'),
            lite: false,
            pro: true
        },
        {
            id: 'grid',
            title: __('Grid Layout', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a grid layout.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'grid-unbound',
            title: __('Grid Layout (Unbound)', 'stachethemes_event_calendar_lite'),
            desc: [
                __('Display events in a grid layout.', 'stachethemes_event_calendar_lite'),
                __('Unbound mode will continue to display events that fall outside the current month', 'stachethemes_event_calendar_lite')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'boxgrid',
            title: __('Box Grid Layout', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a box grid (tile) layout.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'boxgrid-unbound',
            title: __('Box Grid Layout (Unbound)', 'stachethemes_event_calendar_lite'),
            desc: [
                __('Display events in a box grid (tile) layout.', 'stachethemes_event_calendar_lite'),
                __('Unbound mode will continue to display events that fall outside the current month', 'stachethemes_event_calendar_lite')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'day',
            title: __('Day Layout', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a day layout.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'map',
            title: __('Map Layout ', 'stachethemes_event_calendar_lite'),
            desc: [
                __('Display events on a map using OpenStreetMap or Google Maps.', 'stachethemes_event_calendar_lite'),
                __('Display events near you or near a specific location using the proximity filter.', 'stachethemes_event_calendar_lite')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'event-slider',
            title: __('Events Slider', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a standalone slider.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
        {
            id: 'event-list',
            title: __('Events List', 'stachethemes_event_calendar_lite'),
            desc: __('Display events in a standalone list.', 'stachethemes_event_calendar_lite'),
            lite: true,
            pro: true
        },
    ]

    const Item = (props) => {

        const { id, title, desc, lite, pro } = props;


        return (
            <StecDiv className='stec-comparison-table-body-item'>

                <StecDiv className='stec-comparison-table-body-item-wrap'>

                    <StecDiv className='stec-comparison-table-body-item-title'>
                        {title}
                    </StecDiv>

                    <StecDiv className='stec-comparison-table-body-item-desc'>
                        {Array.isArray(desc) ? desc.map((item, i) => <p key={i}>{item}</p>) : <p>{desc}</p>}
                    </StecDiv>

                </StecDiv>

                <StecDiv className='stec-comparison-table-body-item-value'>
                    {lite ? <i className='fa-solid fa-check' /> : <i className='fa-solid fa-times' />}
                </StecDiv>

                <StecDiv className='stec-comparison-table-body-item-value'>
                    {pro ? <i className='fa-solid fa-check' /> : <i className='fa-solid fa-times' />}
                </StecDiv>

            </StecDiv>
        )

    }

    return (
        <StecDiv className='stec-comparison-table'>

            <StecDiv className='stec-comparison-table-header'>
                <StecDiv className='stec-comparison-table-header-title'>
                    {__('Comparison Table', 'stachethemes_event_calendar_lite')}
                </StecDiv>
                <StecDiv className='stec-comparison-table-header-item'>
                    <StecSpan>{__('stachethemes_event_calendar_lite', 'stachethemes_event_calendar_lite')}</StecSpan>
                    <StecSpan>{__('Lite')}</StecSpan>
                </StecDiv>
                <StecDiv className='stec-comparison-table-header-item'>
                    {__('stachethemes_event_calendar_lite', 'stachethemes_event_calendar_lite')}
                </StecDiv>
            </StecDiv>

            <StecDiv className='stec-comparison-table-body'>
                {features.map(feature => <Item key={feature.id} {...feature} />)}
            </StecDiv>
            <StecDiv className='stec-comparison-table-footer'>

                <StecDiv className='stec-comparison-table-footer-item'></StecDiv>

                <StecDiv className='stec-comparison-table-footer-item'>
                    <Button label={__('Already Installed', 'stachethemes_event_calendar_lite')} disabled={true} />
                </StecDiv>

                <StecDiv className='stec-comparison-table-footer-item'>
                    <Button href="https://codecanyon.net/item/stachethemes-event-calendar-wordpress-events-calendar-plugin/16168229?ref=Stachethemes" label={
                        [
                            <i className='fa-regular fa-circle-up' key='icon' />,
                            __('Upgrade Now', 'stachethemes_event_calendar_lite')
                        ]
                    } className='green' />
                </StecDiv>
            </StecDiv>
        </StecDiv>
    )

}

const CompareButton = (props) => {

    const [open, setOpen] = useState(false);

    return <>

        <Modal
            maxWidth='900px'
            isOpen={open}
            onClose={() => {
                setOpen(false);
            }}>

            <ComparisonTable />

        </Modal>

        <Button {...props} onClick={() => {
            setOpen(true);
        }} />
    </>

}

export default CompareButton;