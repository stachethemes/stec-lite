import Button from '@Stec/CommonComponents/Button';
import Section from '@Stec/CommonComponents/Section';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { StecDiv } from '@Stec/WebComponents';
import { useRef } from 'react';
import ManageTerms from './ManageTerms';
import { __, sprintf } from '@wordpress/i18n';

function List(props) {

    const hasItems = useRef([]);

    // active menu dispatcher
    const { setActiveMenu } = useDashboardMenu();

    // Go to Import page
    const goToImportPage = () => {
        setActiveMenu({
            page: props.importPageId,
            params: props
        });
    }

    return (
        <>

            <StecDiv className='stec-dashboard-top-nav'>

                <Button className='stcolor stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-home' />, __('Home', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

                <Button className='green' label={[<i key='icon' className='fa-solid fa-plus' />, sprintf(__('Add new %s', 'stachethemes_event_calendar_lite'), props.termLabelSingle)]} onClick={() => {
                    setActiveMenu({
                        page: props.upsertPageId,
                        params: {}
                    });
                }} />

            </StecDiv >

            <Section className='stec-manage-terms-wrapper' title={[<i key='icon' className='fa-solid fa-list' />, sprintf(__('Manage %s', 'stachethemes_event_calendar_lite'), props.termLabelPlural)]}>

                <ManageTerms hasItemsRef={hasItems} {...props} />

            </Section>
        </>
    )
}

export default List