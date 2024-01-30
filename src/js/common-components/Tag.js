import { StecDiv } from '@Stec/WebComponents';

function Tag(props) {
    return (
        <StecDiv onClick={props.onClick} title={props.title} className='stec-tag' style={{
            color: props.color, backgroundColor: props.backgroundColor,
            ...props.style
        }}>
            {props.label}
        </StecDiv>
    )
}

export default Tag
