import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import AuthorControl from '@Stec/JS/dashboard/pages/AuthorControl';
import { __ } from '@wordpress/i18n';

const AboutEdit = (props) => {

    const postData = props.postData;

    return (
        <Section title={__('About', 'stec')} >

            {
                postData.current.meta.anonymous && <>

                    <UncontrolledInputText
                        title={__('Submitted by anonymous user', 'stec')}
                        readOnly={true}
                        defaultValue={__('Yes', 'stec')}
                        description={__('This event was submitted by anonymous user', 'stec')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_name && <>
                    <UncontrolledInputText
                        title={__('Contact name', 'stec')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_name}
                        description={__('Name for contact', 'stec')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_phone && <>
                    <UncontrolledInputText
                        title={__('Contact phone', 'stec')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_phone}
                        description={__('Phone for contact', 'stec')}
                    />

                    <Spacer />
                </>
            }

            {
                '' !== postData.current.meta.contact_email && <>

                    <UncontrolledInputText
                        title={__('Contact email', 'stec')}
                        readOnly={true}
                        defaultValue={postData.current.meta.contact_email}
                        description={__('Email for contact', 'stec')}
                    />

                    <Spacer />

                </>
            }


            <AuthorControl postData={postData} />

            <Spacer />

            <UncontrolledInputText
                title={__('Created on', 'stec')}
                readOnly={true}
                defaultValue={postData.current.date}
                description={__('The date on which the event was created', 'stec')}
            />

            <Spacer />

            <UncontrolledInputTextarea
                title={__('Author notes', 'stec')}
                defaultValue={postData.current.meta.author_notes}
                onChange={value => {
                    postData.current.meta.author_notes = value;
                }}
                description={__('Any notes you want to leave for the author', 'stec')}
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

        <Section title={__('About the Event', 'stec')} >

            <UncontrolledInputTextarea
                title={__('Author notes', 'stec')}
                defaultValue={postData.current.meta.author_notes}
                onChange={value => {
                    postData.current.meta.author_notes = value;
                }}
                description={__('Any notes you want to left for the author', 'stec')}
            />

        </Section>
    );

}

export default About
