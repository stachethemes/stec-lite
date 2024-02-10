import Modal from '@Stec/CommonComponents/Modal';
import { dashboardChangesNotice } from '@Stec/JS/calendar/atoms';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import LazyDashboard from '@Stec/JS/dashboard/LazyDashboard.js';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { Suspense, useState } from 'react';
import { useRecoilState } from 'recoil';

const ChangesNotice = () => {

    const [display, setDisplay] = useRecoilState(dashboardChangesNotice);

    if (false === display) {
        return null;
    }

    return (
        <StecDiv className='stec-dashboard-changes-notice'>
            <i className='notice-icon fas fa-exclamation-triangle' />
            {__('Please note that certain changes may require you to reload the page in order to see them take effect on the front-end', 'stachethemes_event_calendar_lite')}
            <StecSpan className='close-button' onClick={() => {
                setDisplay(false);
            }}>
                <i className='fa-solid fa-times' />
            </StecSpan>
        </StecDiv>
    )
}

const DashboardButton = () => {

    const showDashboard = useSettingsAtt('dashboard__in_calendar');
    const [active, setActive] = useState(false);
    const { setActiveMenu } = useDashboardMenu();

    const resetDashboardPage = () => {

        setActiveMenu({
            page: 'home',
            params: {}
        });
    }

    const classNameArray = ['stec-calendar-dashboard-button'];

    if (active) {
        classNameArray.push('active');
    }

    if (true !== STEC_VARIABLES?.current_user?.capability?.access_dashboard) {
        return null;
    }

    if (!showDashboard) {
        return (
            null
        )
    }

    return (
        <>
            <StecDiv className={classNameArray.join(' ')} onClick={() => {

                const isActive = !active;

                if (false === isActive) {

                    setActive(false);

                    resetDashboardPage();

                } else {
                    setActive(true);
                }

            }}>{[
                <i key='icon' className='fa-solid fa-cog' />,
                <StecSpan key='text'>{__('Calendar Dashboard', 'stachethemes_event_calendar_lite')}</StecSpan>
            ]}</StecDiv>

            <Suspense fallback=''>
                <Modal
                    maxWidth='1280px'
                    isOpen={active}
                    onClose={() => {
                        setActive(false);
                        resetDashboardPage();
                    }}>
                    <>
                        <ChangesNotice />
                        <LazyDashboard />
                    </>
                </Modal>
            </Suspense>
        </>
    )
}

export default DashboardButton