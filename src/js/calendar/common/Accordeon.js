import { StecDiv } from '@Stec/WebComponents';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';

const AccordeonItem = (props) => {

    const noAnimation = useSettingsAtt('misc__noanim', false);

    /**
     * window.stecFilterAccordeonAnimationDisabled = true
     * filter to disable animation on accordeon items
     */
    const style = noAnimation || window.stecFilterAccordeonAnimationDisabled ? { animationDuration: `0s`, animationDelay: `0s` } : { animationDelay: `${props.animationDelay}s` };

    return (
        <StecDiv style={{
            perspective: '2000px'
        }}>
            <StecDiv
                style={style}
                className={props.classNameArray.join(' ')}>
                {props.children}
            </StecDiv>
        </StecDiv>
    );
}

/**
 * The dropdown accordeon animation for EventPreview elements and such
 */
const Accordeon = (props) => {

    const items = props.children.slice(0, props.until || props.children.length);
    const animateFrom = props.animateFrom || 0;

    return (
        <>
            {items.map((item, i) => {

                const classNameArray = ['stec-accordeon'];

                if (animateFrom > i) {
                    if (props.noAnim) {
                        classNameArray.push('stec-accordeon-no-animation');
                    }
                }

                const animationDelay = animateFrom ? Math.max(0, i - animateFrom) * 0.17 : i * 0.17;

                return <AccordeonItem
                    key={i}
                    animationDelay={animationDelay}
                    classNameArray={classNameArray}>{item}</AccordeonItem>
            })}
        </>
    )
}

export default Accordeon
