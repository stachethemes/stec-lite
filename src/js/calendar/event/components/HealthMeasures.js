import { eventHasHealthMeasures } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function HealthMeasures({ event, style }) {

    const hasHealthMeasures = eventHasHealthMeasures(event);

    if (false === hasHealthMeasures) {
        return null;
    }

    return (
        <StecDiv className='stec-event-health-measures' style={style}>

            <StecDiv className='stec-event-health-measures-top'>
                <StecSpan className='stec-event-health-measures-icon'>
                    <i className='fa-solid fa-shield-virus' />
                </StecSpan>

                <StecSpan className='stec-event-health-measures-title'>
                    {__('This event has health safety measures put in place', 'stec')}
                </StecSpan>
            </StecDiv>


            {Object.entries(event.meta.health_measures).map((measure, i) => {

                if ('custom' === measure[0] && '' !== measure[1]) {

                    const customMeasuresArray = measure[1].split('|');

                    return customMeasuresArray.map((customMeasure, j) => {
                        return (
                            <StecSpan key={`custom-measure-${j}`} className='stec-event-health-measures-measure'>
                                <i className='fa-solid fa-check' />
                                <StecSpan>{customMeasure}</StecSpan>
                            </StecSpan>
                        );
                    });
                }

                const measuresLabels = {
                    require_masks: __('All attendees are required to wear face masks', 'stec'),
                    require_temp: __('All attendees will undergo temperature screening upon entry', 'stec'),
                    require_distance: __('All attendees are required to maintain a safe physical distance', 'stec'),
                    require_tracing: __('All attendees are required to provide their contact information for contact tracing purposes', 'stec'),
                    require_certificate: __('All attendees are required to have valid vaccination certificate', 'stec'),
                    require_pcr_test: __('All attendees are required to have negative PCR test result performed 48 hours before the event start date', 'stec'),
                    require_rapid_test: __('All attendees are required to have negative rapid test result performed 48 hours before the event start date', 'stec'),
                };

                if (true === measure[1]) {
                    return (
                        <StecSpan key={i} className='stec-event-health-measures-measure'>
                            <i className='fa-solid fa-check' />
                            <StecSpan>{measuresLabels[measure[0]]}</StecSpan>
                        </StecSpan>
                    );
                } else {
                    return '';
                }


            })}

        </StecDiv >
    )
}

export default HealthMeasures
