import { StecSpan } from '@Stec/WebComponents';

function InvalidField({ text, floating = false, display = false }) {

    if (false === display || !text) {
        return '';
    }

    const classNameArray = ['stec-invalid-field'];

    if (true === floating) {
        classNameArray.push('stec-invalid-field-floating');
    }

    return (
        <StecSpan className={classNameArray.join(' ')}>
            {text}
        </StecSpan>
    )
}

export default InvalidField
