import Event from '@Stec/JS/calendar/event/Event';
import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import TopButton from './TopButton';
import TopSearchMenu from './TopSearchMenu';

const TopSearch = () => {

    const [activeEvent, setActiveEvent] = useState(false);
    const searchMenuRef = useRef();
    const [active, setActive] = useState(false);
    const topSingleLine = useSettingsAtt('calendar__top_single_line');
    const topLabels = useSettingsAtt('calendar__top_labels');
    const isMobileScreen = useCalendarScreenTypeValue() === 'mobile';

    const hideLabels = !topLabels || (topSingleLine && isMobileScreen);

    useOutsideHandler(searchMenuRef, () => {
        if (false === activeEvent) {
            setActive(false);
        }
    });

    const onEventSelect = (event) => {
        setActiveEvent(event);
    }

    const label = [
        <i key='icon' className='stec-top-menu-search-icon fa-solid fa-search' />,
    ];

    if (!hideLabels) {
        label.push(
            <span key='text' className='stec-top-menu-search-label'>{__('Search', 'stachethemes_event_calendar_lite')}</span>
        );
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
                    extraClass={'stec-top-menu-search-button'}
                    label={label}
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