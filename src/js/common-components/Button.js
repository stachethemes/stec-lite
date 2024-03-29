import { StecDiv, StecSpan } from '@Stec/WebComponents';

const Button = (props) => {

    const classNameArray = ['stec-button'];

    if (Array.isArray(props.className)) {
        classNameArray.push(...props.className);
    } else if (props.className && typeof props.className === 'string') {
        classNameArray.push(props.className);
    }

    if (props.disabled) {
        classNameArray.push('stec-button-disabled');
    }

    if (props.href) {
        return (
            <a
                {...props.extra}
                style={props.style}
                target={props.target ? props.target : '_SELF'}
                href={props.href}
                className={classNameArray.join(' ')}
                onClick={props.onClick}>{
                    Array.isArray(props.label) ?
                        props.label.map((item, i) => <StecSpan key={i}>{item}</StecSpan>) :
                        props.label
                }
            </a>
        )
    } else {
        return (
            <StecDiv
                {...props.extra}
                style={props.style}
                className={classNameArray.join(' ')}
                onClick={props.onClick}>{Array.isArray(props.label) ? props.label.map((item, i) => {
                    return <StecSpan key={i}>{item}</StecSpan>;
                }) : props.label}</StecDiv>
        )
    }
}

export default Button
