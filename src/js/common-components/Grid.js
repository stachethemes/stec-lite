import { StecDiv } from '@Stec/WebComponents';

function Grid(props) {

    const style = {
        ...
        {
            display: 'grid',
            gridTemplateColumns: props.columns,
            gap: props.gap
        },
        ...props.style
    }


    return (
        <StecDiv className={`stec-grid-block ${props.className ? props.className : ''}`} style={style}>
            {props.children}
        </StecDiv>
    )
}

export default Grid