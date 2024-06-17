import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useEffect } from 'react';
import { Portal } from 'react-portal';

const DefaultComponent = (props) => {

    useEffect(() => {

        const modalWindows = document.querySelectorAll('.stec-light-modal-overlay');

        if (props.isOpen) {
            document.body.classList.add('stec-light-modal-is-open');
        } else {
            if (modalWindows.length <= 0) {
                document.body.classList.remove('stec-light-modal-is-open');
            }
        }

        return () => {
            document.body.classList.remove('stec-light-modal-is-open');
        }

    }, [props.isOpen]);

    if (true !== props.isOpen) {
        return null;
    }

    const header = props.noHeader !== true && <StecDiv className='stec-light-modal-header' style={props.headerStyle || {}}>
        {
            props.headerTags && <StecDiv className='stec-light-modal-header-tags'>
                {props.headerTags}
            </StecDiv>
        }
        <StecSpan><i className={props.headerIcon} /></StecSpan>
    </StecDiv>

    const classNameArray = ['stec-light-modal-overlay'];

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <Portal>
            <StecDiv className={classNameArray.join(' ')} onClick={props.onClose}>
                <StecDiv className='stec-light-modal' onClick={(e) => {
                    e.stopPropagation();
                }}>

                    {header}

                    <StecDiv className='stec-light-modal-title'>{props.title}</StecDiv>
                    <StecDiv className='stec-light-modal-content'>
                        {props.children}
                        <StecDiv className='stec-light-modal-content-buttons'>
                            {props.buttons}
                        </StecDiv>
                    </StecDiv>
                </StecDiv>
            </StecDiv>
        </Portal>
    )

}

function LightModal(props) {

    if (typeof window.stecOverrideLightModalComponent === 'function') {
        return window.stecOverrideLightModalComponent({
            componentProps: props,
            StecDiv: StecDiv,
            StecSpan: StecSpan,
            Portal: Portal
        });
    }

    return <DefaultComponent {...props} />

}

export default LightModal