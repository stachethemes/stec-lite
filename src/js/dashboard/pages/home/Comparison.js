import Button from '@Stec/CommonComponents/Button';
import Modal from '@Stec/CommonComponents/Modal';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

const ComparisonTable = () => {

    const features = [
        {
            id: 'woocommerce',
            title: __('Tickets & Products', 'stec'),
            desc: __('Integrate WooCommerce with the ability to sell event tickets and products directly from your calendar, add simple or variable tickets, generate Order and Ticket QR codes, set ticket quantity per event occurrence, and scan tickets using a QR code scanner.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'buddypress',
            title: __('BuddyPress', 'stec'),
            desc: __('Integrate with BuddyPress to display events on user profiles, group pages, and the activity page, allowing the creation and display of group events.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'rsvp',
            title: __('RSVP', 'stec'),
            desc: __('Enable users to RSVP to events, set RSVP limits, specify limits per RSVP, define RSVP deadlines, implement a waiting list, and display the RSVP list.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'event-submission-form',
            title: __('Event Submission Form', 'stec'),
            desc: __('Allow users or visitors to submit events from the frontend.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'comments',
            title: __('Comments', 'stec'),
            desc: __('Enable users to comment on events and provide the option to choose between Facebook or an internal comments form.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'forecast',
            title: __('Weather Forecast', 'stec'),
            desc: __('Display weather forecast for your events.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'ai',
            title: __('A.I.', 'stec'),
            desc: __('A.I. Content Enchancer.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'import-export',
            title: __('Import & Export', 'stec'),
            desc: __('Import events from sources such as Facebook or Google Calendar, import events from CSV files, and export events to both CSV and ICS files.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'cron',
            title: __('Cron jobs', 'stec'),
            desc: __('Schedule cron jobs to automate event imports.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'builder',
            title: __('Builder', 'stec'),
            desc: __('Utilize a built-in drag & drop builder to create event layouts and event submission form layouts effortlessly.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'single-page',
            title: __('Event Single Page', 'stec'),
            desc: __('Display events on a single page.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'organizers-page',
            title: __('Organizers Page', 'stec'),
            desc: __('Display organizers on a single page.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'guests-page',
            title: __('Guests Page', 'stec'),
            desc: __('Display organizers on a single page.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'translatable',
            title: __('Translatable', 'stec'),
            desc: __('Translate the plugin to any language.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'multilingual',
            title: __('Multilingual Support', 'stec'),
            desc: __('Support for multilingual websites using WPML, Polylang and similar plugins.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'multi-site',
            title: __('Multi-site Ready', 'stec'),
            desc: __('Use the plugin on a WordPress multi-site network.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'gutenberg',
            title: __('Gutenberg Blocks', 'stec'),
            desc: __('Display the calendar and its widgets with Gutenberg blocks.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'elementor',
            title: __('Elementor Widgets', 'stec'),
            desc: __('Display the calendar and its widgets with Elementor widgets.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'color',
            title: __('Color Customizable', 'stec'),
            desc: __('Customize the calendar colors to match your website.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'share',
            title: __('Social Integration', 'stec'),
            desc: __('Share events on social networks.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'embed',
            title: __('Embed', 'stec'),
            desc: __('Embed events on other websites.', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'repeatability',
            title: __('Repeatability', 'stec'),
            desc: __('Create repeating events with options to add repeat exceptions, set daily, weekly, monthly, and yearly repeating events, repeat events on specific days or dates, and insert custom RRULE repeat schemes.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'agenda',
            title: __('Agenda Layout', 'stec'),
            desc: __('Display events in a list.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'agenda-unbound',
            title: __('Agenda Layout (Unbound)', 'stec'),
            desc: [
                __('Display events in a list.', 'stec'),
                __('Unbound mode will continue to display events that fall outside the current month.', 'stec')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'month',
            title: __('Month & Week Layout', 'stec'),
            desc: __('Display events in a calendar month or week layout.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'month-print',
            title: __('Month & Week Layout Print', 'stec'),
            desc: __('Print option for month & week layouts', 'stec'),
            lite: false,
            pro: true
        },
        {
            id: 'grid',
            title: __('Grid Layout', 'stec'),
            desc: __('Display events in a grid layout.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'grid-unbound',
            title: __('Grid Layout (Unbound)', 'stec'),
            desc: [
                __('Display events in a grid layout.', 'stec'),
                __('Unbound mode will continue to display events that fall outside the current month', 'stec')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'boxgrid',
            title: __('Box Grid Layout', 'stec'),
            desc: __('Display events in a box grid (tile) layout.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'boxgrid-unbound',
            title: __('Box Grid Layout (Unbound)', 'stec'),
            desc: [
                __('Display events in a box grid (tile) layout.', 'stec'),
                __('Unbound mode will continue to display events that fall outside the current month', 'stec')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'day',
            title: __('Day Layout', 'stec'),
            desc: __('Display events in a day layout.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'map',
            title: __('Map Layout ', 'stec'),
            desc: [
                __('Display events on a map using OpenStreetMap or Google Maps.', 'stec'),
                __('Display events near you or near a specific location using the proximity filter.', 'stec')
            ],
            lite: false,
            pro: true
        },
        {
            id: 'event-slider',
            title: __('Events Slider', 'stec'),
            desc: __('Display events in a standalone slider.', 'stec'),
            lite: true,
            pro: true
        },
        {
            id: 'event-list',
            title: __('Events List', 'stec'),
            desc: __('Display events in a standalone list.', 'stec'),
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
                    {__('Comparison Table', 'stec')}
                </StecDiv>
                <StecDiv className='stec-comparison-table-header-item'>
                    <StecSpan>{__('STEC', 'stec')}</StecSpan>
                    <StecSpan>{__('Lite')}</StecSpan>
                </StecDiv>
                <StecDiv className='stec-comparison-table-header-item'>
                    {__('STEC', 'stec')}
                </StecDiv>
            </StecDiv>

            <StecDiv className='stec-comparison-table-body'>
                {features.map(feature => <Item key={feature.id} {...feature} />)}
            </StecDiv>
            <StecDiv className='stec-comparison-table-footer'>

                <StecDiv className='stec-comparison-table-footer-item'></StecDiv>

                <StecDiv className='stec-comparison-table-footer-item'>
                    <Button label={__('Already Installed', 'stec')} disabled={true} />
                </StecDiv>

                <StecDiv className='stec-comparison-table-footer-item'>
                    <Button href="https://codecanyon.net/item/stachethemes-event-calendar-wordpress-events-calendar-plugin/16168229?ref=Stachethemes" label={
                        [
                            <i className='fa-regular fa-circle-up' key='icon' />,
                            __('Upgrade Now', 'stec')
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