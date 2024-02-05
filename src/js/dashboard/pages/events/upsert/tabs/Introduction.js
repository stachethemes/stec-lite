import { UncontrolledInputImages } from '@Stec/CommonComponents/InputImages';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import TextEditor from '@Stec/CommonComponents/TextEditor';
import { __ } from '@wordpress/i18n';

const Introduction = (props) => {

    const postData = props.postData;

    return <Section title={__('Introduction', 'stec')}>

        <UncontrolledInputImages
            title={__('Add images to your event', 'stec')}
            buttonTitle={__('Add Images', 'stec')}
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
            title={__('Description', 'stec')}
            description={__('Detailed description about the event', 'stec')}
            value={postData.current.content.raw} onChange={value => {
                postData.current.content.raw = value;
            }} />

        <Spacer />

        <UncontrolledInputTextarea
            title={__('Short description', 'stec')}
            description={__('Short description about the event', 'stec')}
            defaultValue={postData.current.excerpt.raw}
            onChange={(value) => {
                postData.current.excerpt.raw = value;
            }} />

        <Spacer />

        <UncontrolledInputText
            title={__('External link', 'stec')}
            description={__('Any url relevant to your event that you may want to include', 'stec')}
            placeholder={__('URL', 'stec')}
            onChange={value => {
                postData.current.meta.external_link.url = value;
            }}
            defaultValue={postData.current.meta.external_link.url}
        />

        <Spacer />

        <UncontrolledInputText
            title={__('External link text', 'stec')}
            description={__('External link text. Leave empty to use the default link text', 'stec')}
            placeholder={__('The external link button text', 'stec')}
            onChange={value => {
                postData.current.meta.external_link.text = value;
            }}
            defaultValue={postData.current.meta.external_link.text}
        />


    </Section>

}

export default Introduction
