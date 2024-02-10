import { newApiPost } from '@Stec/JS/api';
import { StecDiv } from '@Stec/WebComponents';
import { __, sprintf } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from './Button';
import FieldDescription from './FieldDescription';
import Flexbox from './Flexbox';
import Grid from './Grid';
import { UncontrolledInputText } from './InputText';
import InputTextarea, { UncontrolledInputTextarea } from './InputTextarea';
import Modal from './Modal';
import Spacer from './Spacer';

const ModalAIContent = ({ setModalOpen, task, content, onApply }) => {

    const blockActionRef = useRef(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const taskRef = useRef(task);
    const contentRef = useRef(content);
    const messages = useRef([]);

    const submitRequest = () => {

        if (!contentRef.current ) {
            toast.error(__('Context is empty', 'stachethemes_event_calendar_lite'));
            return false;
        }

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function fetchRequest() {

                    try {

                        const message = {
                            role: 'system',
                            content: `${taskRef.current} \n\n "${contentRef.current}"`
                        }

                        // We will disable this
                        // since we won't submit the whole conversation for now
                        // messages.current.push(message);
                        
                        messages.current = [message];

                        const result = await newApiPost({
                            route: 'AI',
                            errorMessage: 'auto',
                            includeResponseStatus: true,
                            data: {
                                messages: messages.current
                            }
                        });

                        const { status, data } = result;

                        if (200 === status) {

                            messages.current.push(data.message);

                            setGeneratedContent(data.message);

                            return resolve(__(`Content generated`, 'stachethemes_event_calendar_lite'));

                        } else {

                            return reject(data.message);
                        }


                    } catch (e) {

                        return reject(e.message);
                    }

                }

                fetchRequest();

            }),
            {
                loading: __('Just a moment...', 'stachethemes_event_calendar_lite'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return <StecDiv dangerouslySetInnerHTML={{ __html: errorMessage }} />;
                },
            }
        )

    }

    return (
        <StecDiv className='stec-modal-ai-content'>

            <StecDiv className='stec-modal-ai-content-title'>
                <i className='fa-solid fa-wand-magic-sparkles'></i>
                {
                    __('Intelligent Content Enhancement', 'stachethemes_event_calendar_lite')
                }
            </StecDiv>

            <UncontrolledInputText
                title={__('Task', 'stachethemes_event_calendar_lite')}
                defaultValue={taskRef.current}
                onChange={value => {
                    taskRef.current = value;
                }}
            />

            <Spacer />

            <Grid gap='10px' columns={'1fr 1fr'}>

                <UncontrolledInputTextarea
                    title={__('Context', 'stachethemes_event_calendar_lite')}
                    defaultValue={contentRef.current}
                    onChange={value => {
                        contentRef.current = value;
                    }}
                />

                <InputTextarea
                    style={{ marginLeft: 6 }}
                    title={__('Suggested Content', 'stachethemes_event_calendar_lite')}
                    value={generatedContent}
                    onChange={value => {
                        setGeneratedContent(value);
                    }}
                />

            </Grid>

            <FieldDescription text={sprintf(__('Note the plugin connects to %s to process your request', 'stachethemes_event_calendar_lite'), 'https://api.openai.com')} />

            <Spacer />

            <Flexbox style={{
                justifyContent: 'flex-start'
            }}>
                <Button disabled={!generatedContent} label={__('Apply changes', 'stachethemes_event_calendar_lite')} className='green' onClick={() => {

                    if (generatedContent) {
                        onApply(generatedContent);
                        setModalOpen(false);
                    }

                }} />
                <Button label={__('Generate', 'stachethemes_event_calendar_lite')} style={{ marginLeft: 6 }} b className='blue' onClick={submitRequest} />
                <Button style={{
                    marginLeft: 6
                }} label={__('Close', 'stachethemes_event_calendar_lite')} className='red' onClick={() => {
                    setModalOpen(false);
                }} />
            </Flexbox>

        </StecDiv>
    )
}

const ModalAI = ({ modalOpen, setModalOpen, task, content, onApply }) => {

    return (
        <Modal
            isOpen={modalOpen}
            onClose={() => {
                setModalOpen(false);
            }}>

            <ModalAIContent setModalOpen={setModalOpen} task={task} content={content} onApply={onApply} />

        </Modal>
    )

}

export default ModalAI;