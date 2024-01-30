import {StecDiv} from '@Stec/WebComponents';
import StecSpan from '@Stec/WebComponents/stec-span';

const Toast = (props) => {
    return (
        <StecDiv className='stec-toast'>
            <StecSpan>{props.label}</StecSpan>
        </StecDiv>
    )
}

export default Toast
