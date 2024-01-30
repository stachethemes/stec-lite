import { StecDiv, StecSpan } from '@Stec/WebComponents';

const Thumbnail = (props) => {

    const type = props.type ? props.type : 'icon';
    const textColor = props.textColor ? props.textColor : '#fff';
    const backgroundColor = props.backgroundColor ? props.backgroundColor : '#000';

    return (
        <StecDiv className={`stec-thumbnail ${props.size || ''}`} style={{ backgroundColor: backgroundColor }}>

            {'icon' === type && props.icon &&
                <StecDiv className='stec-thumbnail-icon' style={{ color: textColor }}>
                    <i className={props.icon} />
                </StecDiv>}

            {'date' === type && props.month && props.day && <>
                <StecDiv className='stec-thumbnail-date'>
                    <StecSpan className='stec-thumbnail-date-day' style={{ color: textColor }}>{props.day}</StecSpan>
                    <StecSpan className='stec-thumbnail-date-month' style={{ color: textColor }}>{props.month}</StecSpan>
                </StecDiv>
            </>}

            {'image' === type && props.image && <>
                <StecDiv className='stec-thumbnail-image' style={{ backgroundImage: `url(${props.image})` }}></StecDiv>
            </>}
        </StecDiv>
    )
}

export default Thumbnail
