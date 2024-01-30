import Button from '@Stec/CommonComponents/Button';
import Section from '@Stec/CommonComponents/Section';
import { MediaFrame } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import { useState } from 'react';

const AttachmentItem = React.forwardRef((props, ref) => {

    const item = props.item;

    return (
        <StecDiv key={item.id} className='stec-dashboard-event-upsert-attachment'>
            <StecSpan className='stec-dashboard-event-upsert-attachment-url'>{item.url}</StecSpan>
            <StecSpan className='stec-dashboard-event-upsert-attachment-remove' onClick={() => {

                ref.current.meta.attachments = ref.current.meta.attachments.filter(attachmentItem => {
                    return attachmentItem.id !== item.id;
                });

                props.onRequestNewInstance();

            }}><i className='fa-solid fa-trash' /></StecSpan>
        </StecDiv>
    );

});

AttachmentItem.displayName = 'AttachmentItem';

const AttachmentsContent = React.forwardRef((props, ref) => {

    return (
        <StecDiv className='stec-dashboard-event-upsert-attachment-list'>

            {ref.current.meta.attachments.map((attachment, i) => {
                return <AttachmentItem key={attachment.id} item={attachment} ref={ref} onRequestNewInstance={props.onRequestNewInstance} />
            })}

        </StecDiv>
    );

});

AttachmentsContent.displayName = 'AttachmentsContent';

const Attachments = (props) => {

    const postData = props.postData;

    const [instanceKey, setInstanceKey] = useState(0);

    const resetInstance = () => {
        setInstanceKey(uniqueId());
    }

    const addAttachments = async () => {

        if (typeof window.wp.media === 'undefined' || !STEC_VARIABLES?.current_user?.capability?.upload_files) {
            return;
        }

        const selection = await MediaFrame({
            title: __('Attachments', 'stec'),
            buttonText: __('Add attachments', 'stec'),
            libraryType: '',
            multiple: true
        });

        const attachments = [...postData.current.meta.attachments];

        if (selection && Array.isArray(selection)) {

            selection.forEach((attachment) => {

                const attachmentData = {
                    id: attachment.id,
                    url: attachment.url,
                    caption: attachment.caption
                }

                if (!attachments.some(existingAttachment => {
                    return existingAttachment.id === attachment.id;
                })) {
                    attachments.push(attachmentData);
                }
            });
        }

        postData.current.meta.attachments = attachments;

        resetInstance();

    }

    return (
        <Section title={__('Attachments', 'stec')} >

            <AttachmentsContent key={instanceKey} ref={postData} onRequestNewInstance={resetInstance} />

            <Button
                disabled={typeof window.wp.media === 'undefined' || !STEC_VARIABLES?.current_user?.capability?.upload_files}
                className='blue'
                label={__('Add Attachments', 'stec')}
                onClick={addAttachments} />

        </Section>
    )
}

export default Attachments
