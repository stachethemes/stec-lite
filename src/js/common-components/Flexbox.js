import { StecDiv } from '@Stec/WebComponents';

function Flexbox(props) {
    return (
        <StecDiv className={`stec-flexbox ${props.className ? props.className : ''}`} style={props.style}>
            {props.children}
        </StecDiv>
    )
}

export default Flexbox