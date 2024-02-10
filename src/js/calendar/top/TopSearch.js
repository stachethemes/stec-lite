import Event from '@Stec/JS/calendar/event/Event';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import TopButton from './TopButton';
import TopSearchMenu from './TopSearchMenu';
import { __ } from '@wordpress/i18n';

const TopSearch = () => {

    const [activeEvent, setActiveEvent] = useState(false);
    const searchMenuRef = useRef();
    const [active, setActive] = useState(false);

    useOutsideHandler(searchMenuRef, () => {
        if (false === activeEvent) {
            setActive(false);
        }
    });

    const onEventSelect = (event) => {
        setActiveEvent(event);
    }

    return (
        <>

            {
                activeEvent && <Event
                    key={activeEvent.id}
                    forceOpenIn={'modal'}
                    event={activeEvent}
                    active={true}
                    noPreviewWhenModal={true} // Prevents display of the preview container
                    onActiveToggle={() => {
                        setActiveEvent(false);
                    }}
                />
            }

            <StecDiv className='stec-top-menu-search' ref={searchMenuRef}>

                <TopButton
                    label={[
                        <i key='icon' className='stec-top-menu-search-icon fa-solid fa-search' />,
                        <span key='text' className='stec-top-menu-search-label'>{__('Search', 'stachethemes_event_calendar_lite')}</span>
                    ]}
                    active={active}
                    onClick={(e) => {
                        setActive(!active);
                    }} />

                {active && <TopSearchMenu onEventSelect={onEventSelect} />}

            </StecDiv>

        </>
    )
}

export default TopSearch;