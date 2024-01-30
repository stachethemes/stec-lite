import { StecDiv } from '@Stec/WebComponents';

function PageHeading(props) {
    return (
        <StecDiv className='stec-page-heading'>{props.label}</StecDiv>
    )
}

export default PageHeading