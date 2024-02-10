import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import AuthorControl from '@Stec/JS/dashboard/pages/AuthorControl';
import { __ } from '@wordpress/i18n';

const AboutEdit = (props) => {

    const postData = props.postData;

    return (
        <Section title={__('About', 'stachethemes_event_calendar_lite')} >

            {
                postData.current.meta.anonymous && <>

                    <UncontrolledInputText
                        title={__('Submitted by anonymous user', 'stachethemes_event_calendar_lite')}
                        readOnly={true}
                        defaultValue={__('Yes', 'stachethemes_event_calendar_lite')}
                        description={__('This event was submitted by anonymous user', 'stachethemes_event_calendar_lite')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_name && <>
                    <UncontrolledInputText
                        title={__('Contact name', 'stachethemes_event_calendar_lite')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_name}
                        description={__('Name for contact', 'stachethemes_event_calendar_lite')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_phone && <>
                    <UncontrolledInputText
                        title={__('Contact phone', 'stachethemes_event_calendar_lite')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_phone}
                        description={__('Phone for contact', 'stachethemes_event_calendar_lite')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_email && <>

                    <UncontrolledInputText
                        title={__('Contact email', 'stachethemes_event_calendar_lite')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_email}
                        description={__('Email for contact', 'stachethemes_event_calendar_lite')}
                    />

                    <Spacer />

                </>
            }


            <AuthorControl postData={postData} />

            <Spacer />

            <UncontrolledInputText
                title={__('Created on', 'stachethemes_event_calendar_lite')}
                readOnly={true}
                defaultValue={postData.current.date}
                description={__('The date on which the event was created', 'stachethemes_event_calendar_lite')}
            />

            <Spacer />

            <UncontrolledInputTextarea
                title={__('Author notes', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.author_notes}
                onChange={value => {
                    postData.current.meta.author_notes = value;
                }}
                description={__('Any notes you want to leave for the author', 'stachethemes_event_calendar_lite')}
            />

        </Section >
    );

}

const About = (props) => {

    const postData = props.postData;
    const isEditMode = postData.current.id ? true : false;

    if (isEditMode) {
        return (
            <AboutEdit {...props} />
        )
    }

    return (

        <Section title={__('About the Event', 'stachethemes_event_calendar_lite')} >

            <UncontrolledInputTextarea
                title={__('Author notes', 'stachethemes_event_calendar_lite')}
                defaultValue={postData.current.meta.author_notes}
                onChange={value => {
                    postData.current.meta.author_notes = value;
                }}
                description={__('Any notes you want to left for the author', 'stachethemes_event_calendar_lite')}
            />

        </Section>
    );

}

export default About
