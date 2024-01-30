import {StecDiv} from '@Stec/WebComponents';

function ProgressBar({ value }) {

    return (
        <StecDiv className='stec-progress-bar'>
            <StecDiv style={{
                width: parseInt(value, 10) + '%'
            }} className='stec-progress-bar-percents'></StecDiv>
        </StecDiv>
    )
}

export default ProgressBar