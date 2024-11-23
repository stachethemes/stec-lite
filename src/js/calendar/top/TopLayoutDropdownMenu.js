import { useAvailableLayouts, useCurrentLayout } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useRef } from 'react';
import TopButton from './TopButton';

const TopLayoutDropdownMenu = () => {

    const isMobileDevice = isMobile();
    const containerRef = useRef(null);
    const { value: activeLayout, setValue: setActiveLayout } = useCurrentLayout();
    const availableLayouts = useAvailableLayouts();

    useOutsideHandler(containerRef, isMobileDevice ? () => {
        setActive(false);
    } : false);

    if (availableLayouts.length <= 1) {
        return null;
    }

    const controllers = {};

    if (isMobileDevice) {
        controllers.onClick = () => {
            setActive(!active);
        }
    } else {
        controllers.onMouseEnter = () => {
            setActive(true);
        }
        controllers.onMouseLeave = () => {
            setActive(false);
        }
    }

    return (
        <StecDiv ref={containerRef} className={`stec-top-layout-dropdown-menu ${active ? 'active' : ''}`.trim()}
            {...controllers}
        >
            <TopButton label={<i className='fa-solid fa-bars' />} />
            <StecDiv className="stec-top-layout-dropdown-menu-list">

                {availableLayouts.map(view => {

                    const classNameArray = ['stec-top-layout-dropdown-menu-list-item'];
                    const isActive = view.id === activeLayout;

                    if (isActive) {
                        classNameArray.push('active');
                    }

                    return (
                        <StecDiv key={view.id}
                            className={classNameArray.join(' ')}
                            onClick={() => {
                                setActiveLayout(view.id);
                            }}>{view.label}</StecDiv>
                    )

                })}

            </StecDiv>
        </StecDiv>
    )
}

export default TopLayoutDropdownMenu
