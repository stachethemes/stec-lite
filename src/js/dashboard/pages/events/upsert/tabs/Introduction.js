import { UncontrolledInputImages } from '@Stec/CommonComponents/InputImages';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import TextEditor from '@Stec/CommonComponents/TextEditor';
import { __ } from '@wordpress/i18n';

const Introduction = (props) => {

    const postData = props.postData;

    return <Section title={__('Introduction', 'stachethemes_event_calendar_lite')}>

        <UncontrolledInputImages
            title={__('Add images to your event', 'stachethemes_event_calendar_lite')}
            buttonTitle={__('Add Images', 'stachethemes_event_calendar_lite')}
            multiple={true}
            defaultValue={postData.current.meta.images.sort(({ order: a }, { order: b }) => a - b)}
            onChange={images => {

                postData.current.meta.images = images.map((image, index) => {
                    image.order = index;
                    return image;
                });
            }}
        />

        <Spacer />

        <TextEditor
            title={__('Description', 'stachethemes_event_calendar_lite')}
            description={__('Detailed description about the event', 'stachethemes_event_calendar_lite')}
            value={postData.current.content.raw} onChange={value => {
                postData.current.content.raw = value;
            }} />

        <Spacer />

        <UncontrolledInputTextarea
            title={__('Short description', 'stachethemes_event_calendar_lite')}
            description={__('Short description about the event', 'stachethemes_event_calendar_lite')}
            defaultValue={postData.current.excerpt.raw}
            onChange={(value) => {
                postData.current.excerpt.raw = value;
            }} />

        <Spacer />

        <UncontrolledInputText
            title={__('External link', 'stachethemes_event_calendar_lite')}
            description={__('Any url relevant to your event that you may want to include', 'stachethemes_event_calendar_lite')}
            placeholder={__('URL', 'stachethemes_event_calendar_lite')}
            onChange={value => {
                postData.current.meta.external_link.url = value;
            }}
            defaultValue={postData.current.meta.external_link.url}
        />

        <Spacer />

        <UncontrolledInputText
            title={__('External link text', 'stachethemes_event_calendar_lite')}
            description={__('External link text. Leave empty to use the default link text', 'stachethemes_event_calendar_lite')}
            placeholder={__('The external link button text', 'stachethemes_event_calendar_lite')}
            onChange={value => {
                postData.current.meta.external_link.text = value;
            }}
            defaultValue={postData.current.meta.external_link.text}
        />


    </Section>

}

export default Introduction
