import { StecSpan } from '@Stec/WebComponents';

function FieldTitle({ text, style }) {

    if (!text) {
        return '';
    }

    return (
        <StecSpan className='stec-field-title' style={style}>
            {text}
        </StecSpan>
    )
}

export default FieldTitle
