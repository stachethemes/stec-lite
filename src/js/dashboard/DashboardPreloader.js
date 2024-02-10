import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function DashboardPreloader() {
    return (

        <StecDiv className='stec-dashboard-preloader'>
            <StecDiv className='stec-dashboard-preloader-sprite'></StecDiv>
            <StecSpan className='stec-dashboard-preloader-txt'>{__(`Just a moment, we're getting things ready`, 'stachethemes_event_calendar_lite')}</StecSpan>
        </StecDiv>

    )
}

export default DashboardPreloader