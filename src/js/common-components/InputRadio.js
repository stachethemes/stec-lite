import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import { StecDiv } from '@Stec/WebComponents';

const InputRadio = ({ title, value, description, onChange }) => {
    return (
        <StecDiv className='stec-radio-wrapper'>
            <label>
                <input type="radio" checked={value} onChange={onChange} />
                <FieldTitle text={title} />
            </label>

            <FieldDescription text={description} />
        </StecDiv>
    )
}

export default InputRadio
