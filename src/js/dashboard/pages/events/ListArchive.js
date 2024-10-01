import Button from '@Stec/CommonComponents/Button';
import ConfirmButton from '@Stec/CommonComponents/ConfirmButton';
import Section from '@Stec/CommonComponents/Section';
import { newApiDelete } from '@Stec/JS/api';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ManageEvents from './ManageEvents';

function ListArchive() {

    const [instanceKey, setInstanceKey] = useState(0);

    const blockActionRef = useRef(false);

    const hasItems = useRef([]);

    // active menu dispatcher
    const { setActiveMenu } = useDashboardMenu();

    // Go to List page
    const goToEventsPage = () => {
        setActiveMenu({
            page: 'events-list',
            params: {}
        });
    }

    const emptyArchive = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteEvents() {

                    try {

                        const result = await newApiDelete({
                            route: 'EVENTS/EMPTY-ARCHIVE',
                            errorMessage: 'auto'
                        });

                        setInstanceKey(state => state + 1);

                        return resolve(__('Archive deleted', 'stachethemes_event_calendar_lite'));

                    } catch (e) {

                        return reject(e.message);
                    }


                }

                deleteEvents();

            }),
            {
                loading: __('Deleting', 'stachethemes_event_calendar_lite'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return errorMessage;
                },
            }
        );
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

                <Button className='blue' label={[<i key='icon' className='fa-solid fa-list' />, __('Manage events', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    goToEventsPage();
                }} />

                <ConfirmButton
                    promptText={__('Are you sure you want to delete all archived events?', 'stachethemes_event_calendar_lite')}
                    yesLabel={__('Delete', 'stachethemes_event_calendar_lite')}
                    className='red'
                    label={[<i key='icon' className='fa-solid fa-list' />,
                    __('Empty archive', 'stachethemes_event_calendar_lite')]}
                    onClick={emptyArchive} />

            </StecDiv>

            <Section key={instanceKey} title={[<i key='icon' className='fa-solid fa-list' />, __('Archived events', 'stachethemes_event_calendar_lite')]}>

                <ManageEvents hasItemsRef={hasItems} status='stec_archived' />

            </Section>
        </>
    )
}

export default ListArchive