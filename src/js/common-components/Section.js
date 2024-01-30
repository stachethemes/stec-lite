import { StecDiv, StecSpan } from '@Stec/WebComponents';
import Spacer from './Spacer';

const Section = (props) => {

    const classNameArray = ['stec-section'];

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <StecDiv className={classNameArray.join(' ')} style={props.style}>
            {props.title && <StecSpan key='title' className='stec-section-title'>{props.title}</StecSpan>}
            {props.subtitle && <StecSpan key='subittle' className='stec-section-subtitle'>{props.subtitle}</StecSpan>}
            {(props.title || props.subtitle) && <Spacer />}
            {props.children}
        </StecDiv>
    )
}

export default Section
