import Button from '@Stec/CommonComponents/Button';
import Section from '@Stec/CommonComponents/Section';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef } from 'react';
import ManageEvents from './ManageEvents';

function List() {

    const hasItems = useRef([]);

    // active menu dispatcher
    const { setActiveMenu } = useDashboardMenu();

    // Go to Archive page
    const goToArchivePage = () => {
        setActiveMenu({
            page: 'events-archive',
            params: {}
        });
    }

    return (
        <>

            <StecDiv className='stec-dashboard-top-nav'>

                <Button className='stcolor stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-house' />, __('Home', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='green' label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new event', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'events-upsert',
                        params: {}
                    });
                }} />

                <Button className='gray' label={[<i key='icon' className='fa-solid fa-box-archive' />, __('Manage archive', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    goToArchivePage();
                }} />

            </StecDiv>

            <Section title={[<i key='icon' className='fa-solid fa-list' />, __('Manage events', 'stachethemes_event_calendar_lite')]}>
                <ManageEvents hasItemsRef={hasItems} />
            </Section>
        </>
    )
}

export default List