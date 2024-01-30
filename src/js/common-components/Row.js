import { StecDiv } from '@Stec/WebComponents';

function Row(props) {

    return (
        <StecDiv className={'stec-row'} style={props.style}>

            {props.children}

        </StecDiv>
    )
}

export default Row