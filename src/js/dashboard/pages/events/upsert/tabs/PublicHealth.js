import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';

const PublicHealth = (props) => {

    const postData = props.postData;

    if ( !postData.current.meta.health_measures) {

        postData.current.meta.health_measures = {
            require_masks: false,
            require_temp: false,
            require_distance: false,
            require_tracing: false,
            require_rapid_test: false,
            require_pcr_test: false,
            require_certificate: false,
            custom: ''
        };
        
    }

    return (
        <Section title={__('Public health measures', 'stachethemes_event_calendar_lite')} >

            <UncontrolledInputCheckbox
                title={__('Require face masks', 'stachethemes_event_calendar_lite')}
                description={__('Require event attendees to wear face masks', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_masks}
                onChange={checked => {
                    postData.current.meta.health_measures.require_masks = checked;
                }}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require temperature screening', 'stachethemes_event_calendar_lite')}
                description={__('Require event attendees to undergo temperature screening upon entry', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_temp}
                onChange={checked => {
                    postData.current.meta.health_measures.require_temp = checked;
                }}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require safe distance', 'stachethemes_event_calendar_lite')}
                description={__('Require event attendees to maintain safe physical distance', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_distance}
                onChange={checked => {
                    postData.current.meta.health_measures.require_distance = checked;
                }}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require tracing', 'stachethemes_event_calendar_lite')}
                description={__('Require event attendees to provide their contact information for contact tracing purposes', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_tracing}
                onChange={checked => {
                    postData.current.meta.health_measures.require_tracing = checked;
                }}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require negative rapid antigen test', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_rapid_test}
                onChange={checked => {
                    postData.current.meta.health_measures.require_rapid_test = checked;
                }}
                description={__('Require event attendees to have negative rapid antigen test', 'stachethemes_event_calendar_lite')}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require negative PCR test', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_pcr_test}
                onChange={checked => {
                    postData.current.meta.health_measures.require_pcr_test = checked;
                }}
                description={__('Require event attendees to have negative PCR test', 'stachethemes_event_calendar_lite')}
            />

            <Spacer />

            <UncontrolledInputCheckbox
                title={__('Require vaccination certificate', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.require_certificate}
                onChange={checked => {
                    postData.current.meta.health_measures.require_certificate = checked;

                }}
                description={__('Require event attendees to have valid vaccination certificate', 'stachethemes_event_calendar_lite')}
            />

            <Spacer />

            <UncontrolledInputTextarea
                title={__('Custom requirements', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.health_measures.custom}
                onChange={value => {
                    postData.current.meta.health_measures.custom = value;
                }}
                description={__('Add your own requirement here separated by | character', 'stachethemes_event_calendar_lite')}
            />

        </Section>
    )
}

export default PublicHealth
