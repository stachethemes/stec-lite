import { StecSpan } from '@Stec/WebComponents';

const FieldDescription = ({ text, style, allowHtml = false }) => {

    if (!text) {
        return '';
    }

    if (true === allowHtml) {

        return (
            <StecSpan className='stec-field-description' style={style} dangerouslySetInnerHTML={{ __html: text }} />
        )

    }

    return (
        <StecSpan className='stec-field-description' style={style}>
            {text}
        </StecSpan>
    )
}

export default FieldDescription
