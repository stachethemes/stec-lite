import { StecDiv } from '@Stec/WebComponents';

function Column(props) {

    return (
        <StecDiv className={'stec-column'} style={props.style}>
            
            {props.children}

        </StecDiv>
    )
}

export default Column