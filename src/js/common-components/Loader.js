import { StecDiv, StecSpan } from '@Stec/WebComponents';

const Loader = ({ title, type, color, style, className }) => {

    const classNameArray = ['stec-loader'];

    if (type === 'small') {
        classNameArray.push('stec-loader-small');
    } else if (type === 'small-wide') {
        classNameArray.push('stec-loader-small-wide');
    }

    if (className) {
        classNameArray.push(className);
    }

    return (
        <StecDiv className={classNameArray.join(' ')} style={style}>
            {'calendar-sprite' !== type && <i className='fa-solid fa-cog' style={{ color: color }} />}
            {'calendar-sprite' === type && <StecSpan className='stec-loader-calendar-sprite' />}
            {title && <StecSpan style={{ color: color }}>{title}</StecSpan>}
        </StecDiv>
    )
}

export default Loader
