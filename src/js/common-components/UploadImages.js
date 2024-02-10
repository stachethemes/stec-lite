import Button from '@Stec/CommonComponents/Button';
import Modal from '@Stec/CommonComponents/Modal';
import Spacer from '@Stec/CommonComponents/Spacer';
import { newApiPost } from '@Stec/JS/api';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __, _x, sprintf } from '@wordpress/i18n';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const UploadControl = ({ files, onImagesReady }) => {

    const [uploading, setUploading] = useState(false);

    useEffect(() => {

        const controller = new AbortController();
        let mounted = true;

        const uploadFiles = async () => {

            try {

                const postData = new FormData();

                for (let i = 0; i < files.length; i++) {
                    postData.append('file[]', files[i].file);
                }

                const { data: attachments, status } = await newApiPost({
                    route: 'UPLOAD-IMAGES',
                    data: postData,
                    hasFiles: true,
                    errorMessage: 'auto',
                    abortController: controller,
                    includeResponseStatus: true
                });

                if (mounted) {

                    if (200 !== status || attachments.length === 0) {
                        throw new Error(__('Sorry, something went wrong', 'stachethemes_event_calendar_lite'));
                    }

                    onImagesReady(attachments);

                    toast.success(__('Images uploaded successfully', 'stachethemes_event_calendar_lite'));
                }

            } catch (e) {

                const errorMessage = e.message || __('Sorry, something went wrong', 'stachethemes_event_calendar_lite');

                toast.error(<StecDiv dangerouslySetInnerHTML={{ __html: errorMessage }} />);

            } finally {

                if (mounted) {
                    setUploading(false);
                }

            }

        }

        if (uploading) {
            uploadFiles();
        }

        return () => {
            mounted = false;
            controller.abort();
        }

    }, [files, onImagesReady, uploading]);

    if (files.length === 0) {
        return null;
    }

    const buttonIsDisabled = uploading;
    const buttonLabel = uploading ? _x('Please wait', 'Upload images', 'stachethemes_event_calendar_lite') : _x('Upload', 'Upload images', 'stachethemes_event_calendar_lite', 0);

    return (
        <>
            <Spacer />
            <Button
                disabled={buttonIsDisabled}
                label={buttonLabel}
                className='green' style={{
                    width: '100%'
                }} onClick={() => {
                    setUploading(true);
                }} />

        </>
    )

}

const PreviewImages = (props) => {

    if (!props.files || props.files.length === 0) {
        return null;
    }

    return (
        <>
            <Spacer />
            <StecDiv className='stec-upload-images-preview'>
                {
                    props.files.map((fileData, index) => {
                        return (
                            <StecDiv key={index} className='stec-upload-images-preview-item'>
                                <StecSpan
                                    title={__('Remove image', 'stachethemes_event_calendar_lite')}
                                    className='stec-upload-images-preview-item-remove'
                                    onClick={() => {

                                        const updatedFiles = [...props.files];
                                        updatedFiles.splice(index, 1);
                                        props.setFiles(updatedFiles);

                                    }}>
                                    <i className="fa-solid fa-minus"></i>
                                </StecSpan>
                                <img src={fileData.url} alt={`Image ${index + 1}`} />
                            </StecDiv>
                        )
                    })
                }
            </StecDiv>
        </>
    )
}

function UploadImages(props) {

    const [files, setFiles] = useState([]); // [ { file: File, url: String } ]
    const allowedImageTypes = useMemo(() => ['image/jpeg', 'image/png'], []);
    const containerRef = useRef(null);
    const dndContainerRef = useRef(null);
    const inputFieldRef = useRef(null);
    const allowMultiple = props?.multiple ? true : false;
    const maxImageSize = window.stecFilterAnonImageSize ? window.stecFilterAnonImageSize : 1024 * 1024 * 2; // 2MB

    /**
     * Queue files via setFiles
     */
    const queueFiles = useCallback((newFiles) => {

        if (newFiles.length > 0) {

            const updatedFiles = [];

            if (allowMultiple) {
                updatedFiles.push(...files);
            }

            for (let i = 0; i < newFiles.length; i++) {

                if (allowMultiple === false && updatedFiles.length > 0) {
                    break;
                }

                const file = newFiles[i];

                if (allowedImageTypes.indexOf(file.type) === -1) {
                    continue;
                }

                const fileExists = updatedFiles.find((fileData) => {
                    return fileData.file.name === file.name && fileData.file.size === file.size;
                });

                if (!fileExists) {

                    if (newFiles[i].size > maxImageSize) {
                        toast.error(sprintf(__('Image %s is too large. Maximum allowed size is 2MB.', 'stachethemes_event_calendar_lite'), newFiles[i].name));
                        continue;
                    }

                    updatedFiles.push({
                        file: file,
                        url: URL.createObjectURL(file)
                    });
                }
            }

            setFiles(updatedFiles);
        }

    }, [allowMultiple, files, maxImageSize, allowedImageTypes]);

    /**
     * Drag and drop
     */
    useEffect(() => {

        if (!props.isOpen) {
            return;
        }

        const container = dndContainerRef.current;

        const dragEnter = (e) => {
            e.stopPropagation();
            e.preventDefault();
            container.classList.add('drag-over');
        }

        const dragOver = (e) => {
            e.stopPropagation();
            e.preventDefault();
        }

        const dragLeave = (e) => {
            e.stopPropagation();
            e.preventDefault();

            // check if we are really leaving the container before doing container.classList.remove('drag-over');
            const rect = container.getBoundingClientRect();

            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                container.classList.remove('drag-over');
            }

        }

        const drop = (e) => {
            e.stopPropagation();
            e.preventDefault();
            container.classList.remove('drag-over');
            queueFiles(e.dataTransfer.files);
        }

        container.addEventListener('dragenter', dragEnter, false);
        container.addEventListener('dragover', dragOver, false);
        container.addEventListener('dragleave', dragLeave, false);
        container.addEventListener('drop', drop, false);

        return () => {
            container.removeEventListener('dragenter', dragEnter);
            container.removeEventListener('dragover', dragOver);
            container.removeEventListener('dragleave', dragLeave);
            container.removeEventListener('drop', drop);
        }

    }, [props.isOpen, queueFiles]);

    return (
        <Modal
            maxWidth='600px'
            isOpen={props.isOpen}
            onClose={() => {
                setFiles([]);
                props.onClose();
            }}>

            <StecDiv className='stec-upload-images-container' ref={containerRef}>
                <StecDiv className='stec-upload-images-container-dnd' ref={dndContainerRef}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <StecSpan>{__('Drag and drop images here', 'stachethemes_event_calendar_lite')}</StecSpan>
                    <StecSpan>{_x('or', 'Drag and drop images here or...', 'stachethemes_event_calendar_lite')}</StecSpan>
                    <Button className='blue' label={__('Browse files', 'stachethemes_event_calendar_lite')} onClick={() => {
                        inputFieldRef.current.click();
                    }} />
                    <input
                        ref={inputFieldRef}
                        key={`upload-input-${files.length}`}
                        type="file"
                        multiple={allowMultiple}
                        accept={allowedImageTypes.join(',')}
                        onChange={e => queueFiles(e.target.files)}
                    />
                </StecDiv>

                <PreviewImages files={files} setFiles={setFiles} />

                <UploadControl
                    key={`upload-control-${files.length}`}
                    files={files}
                    onImagesReady={(attachments) => {
                        if (typeof props.onSelectedImages === 'function') {
                            props.onSelectedImages(attachments);
                            props.onClose();
                            setFiles([]);
                        }
                    }}
                />
            </StecDiv>

        </Modal>
    )
}

export default UploadImages