import { Portal } from 'react-portal';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';

function Modal(props) {

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

            if (modalWindows.length <= 1) {
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

    if (true !== props.isOpen) {
        return null;
    }

    return (
        <Portal>
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

                <StecDiv className='stec-modal-close' onClick={(e)=>{
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
        </Portal>
    )
}

export default Modal