import { StecDiv } from '@Stec/WebComponents';

const TopButton = ({ label, active, onClick, extraClass }) => {

    const classNameArray = ['stec-top-menu-button'];

    if (true === active) {
        classNameArray.push('active');
    }

    if (extraClass) {
        classNameArray.push(extraClass);
    }

    return (
        <StecDiv className={classNameArray.join(' ')} onClick={onClick}>{label}</StecDiv>
    )
}

export default TopButton
