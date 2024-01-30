import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useState } from 'react';

const SectionCollapseContent = React.forwardRef((props, ref) => {

    const classNameArray = ['stec-section-collapse-content'];
    const [isCollapsed, setIsCollapsed] = useState(props.collapsed ? props.collapsed : false);
    const toggleCollapse = () => {

        const newState = !isCollapsed;

        setIsCollapsed(newState);

        if (typeof props.onToggle === 'function') {
            props.onToggle(newState);
        }
    }

    if (isCollapsed) {
        classNameArray.push('collapsed');
    }

    return (
        <StecDiv className={classNameArray.join(' ')} ref={ref}>

            <StecDiv className='stec-section-collapse-top'>
                {
                    props.title && <StecSpan key='title' className='stec-section-collapse-title'
                        onClick={toggleCollapse} >{props.title}</StecSpan>
                }

                {isCollapsed ?
                    <i className='fas fa-plus' onClick={toggleCollapse} /> :
                    <i className='fas fa-minus' onClick={toggleCollapse} />}

                {
                    props.onRemove &&
                    <i className='fas fa-trash' onClick={props.onRemove} />
                }
            </StecDiv>

            {props.subtitle && <StecSpan key='subittle' className='stec-section-collapse-subtitle' onClick={toggleCollapse}>{props.subtitle}</StecSpan>}

            <StecDiv className='stec-section-collapse-inner'>
                {props.children}
            </StecDiv>
        </StecDiv>
    )
});

SectionCollapseContent.displayName = 'SectionCollapseContent';

export default SectionCollapseContent
