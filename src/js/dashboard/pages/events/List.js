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

                <Button className='yellow stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-house' />, __('Home', 'stec')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='green' label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new event', 'stec')]} onClick={() => {
                    setActiveMenu({
                        page: 'events-upsert',
                        params: {}
                    });
                }} />

                <Button className='gray' label={[<i key='icon' className='fa-solid fa-box-archive' />, __('Manage archive', 'stec')]} onClick={() => {
                    goToArchivePage();
                }} />

            </StecDiv>

            <Section title={[<i key='icon' className='fa-solid fa-list' />, __('Manage events', 'stec')]}>
                <ManageEvents hasItemsRef={hasItems} />
            </Section>
        </>
    )
}

export default List