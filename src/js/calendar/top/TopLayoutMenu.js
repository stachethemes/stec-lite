import { useCurrentLayout, useAvailableLayouts } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import TopButton from './TopButton';

import { __ } from '@wordpress/i18n';

const TopLayoutMenu = () => {

    const { value: activeLayout, setValue: setActiveLayout } = useCurrentLayout();
    const availableLayouts = useAvailableLayouts();

    if (availableLayouts.length <= 1) {
        return null;
    }

    return (
        <StecDiv className='stec-top-layout-menu'>

            {
                availableLayouts.map(view => {

                    const isActive = view.id === activeLayout;

                    return (

                        <TopButton key={view.id} label={view.label} active={isActive} onClick={() => {
                            setActiveLayout(view.id);
                        }} />
                    )
                })
            }

        </StecDiv>
    )


}

export default TopLayoutMenu