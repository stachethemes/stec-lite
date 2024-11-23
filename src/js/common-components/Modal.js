import { Portal } from 'react-portal';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';

const DefaultComponent = (props) => {

    const modalId = props.id || `stec-modal-${Math.random().toString(36).substring(7)}`;

    const modalRef = useRef();

    // helper for nervous mouse clicking could accidentally close modal
    const shouldClose = useRef(true);

    useEffect(() => {

        const modalWindows = document.querySelectorAll('.stec-modal-overlay');

        if (props.isOpen) {
            document.body.classList.add('stec-modal-is-open');
        } else {
            if (modalWindows.length <= 0) {
                document.body.classList.remove('stec-modal-is-open');
            }
        }

        return () => {

            if (document.querySelectorAll('.stec-modal-overlay').length <= 0) {
                document.body.classList.remove('stec-modal-is-open');
            }

        }

    }, [props.isOpen]);

    useEffect(() => {

        // bind esc key
        const escFunction = (e) => {
            if (e.keyCode === 27) {
                props.onClose();
            }
        }

        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        }

    }, [props])

    useEffect(() => {

        if (!modalId) {
            return;
        }

        const getLastModalId = () => {
            const lastModal = document.querySelectorAll('.stec-modal-overlay-filter');
            const lastAddedModal = lastModal[lastModal.length - 1];
            return lastAddedModal?.id || null;
        };

        const handleCloseLastModal = () => {
            const lastDivChildId = getLastModalId();

            if (lastDivChildId === modalId) {
                // ? Timeout prevents escape key propagation to other modal components
                setTimeout(() => {
                    props.onClose();
                }, 0);
            }
        };

        const handlePopState = (event) => {
            event.preventDefault();
            handleCloseLastModal();
        };


        if (props.isOpen) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
        } else {
            window.removeEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    // Intentionally omitting onClose from the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalId, props.isOpen]);

    if (true !== props.isOpen) {
        return null;
    }

    return (
        <Portal>
            <StecDiv id={modalId} className='stec-modal-overlay-filter'>
                <StecDiv
                    ref={modalRef}
                    className={`stec-modal-overlay`}

                    style={props.overlayColor ? { backgroundColor: props.overlayColor } : {}}

                    onMouseDown={(e) => {

                        if ('stec-modal-overlay' === e.target.className) {
                            shouldClose.current = true;
                        } else {
                            shouldClose.current = false;
                        }

                    }}

                    onMouseUp={(e) => {

                        if ('stec-modal-overlay' === e.target.className && shouldClose.current) {
                            e.stopPropagation();
                            props.onClose();
                        }
                    }}>

                    <StecDiv className='stec-modal-close' onClick={(e) => {
                        e.stopPropagation();
                        props.onClose();
                    }}>
                        <i className='fa-solid fa-times' />
                    </StecDiv>

                    {props.plain && props.children}

                    {!props.plain && <StecDiv
                        className='stec-modal'
                        style={props.maxWidth ? { maxWidth: props.maxWidth } : {}}>

                        <StecDiv className='stec-modal-content'>
                            {props.children}
                        </StecDiv>

                        <StecDiv className='stec-modal-after-content' onClick={(e) => {
                            e.stopPropagation();
                            props.onClose();
                        }} />

                    </StecDiv>
                    }


                </StecDiv>
            </StecDiv>
        </Portal>
    )

}

function Modal(props) {

     if (typeof window.stecOverrideModalComponent === 'function') {
        return window.stecOverrideModalComponent({
            componentProps: props,
            StecDiv: StecDiv,
            Portal: Portal
        });
    }

    return <DefaultComponent {...props} />
   
}

export default Modal