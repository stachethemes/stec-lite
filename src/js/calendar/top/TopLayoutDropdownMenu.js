import { StecDiv } from '@Stec/WebComponents';
import TopButton from './TopButton';
import { useCurrentLayout, useAvailableLayouts } from '@Stec/JS/calendar/hooks';

const TopLayoutDropdownMenu = () => {

    const { value: activeLayout, setValue: setActiveLayout } = useCurrentLayout();
    const availableLayouts = useAvailableLayouts();
    
    if (availableLayouts.length <= 1) {
        return null;
    }

    return (
        <StecDiv className='stec-top-layout-dropdown-menu'>
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
