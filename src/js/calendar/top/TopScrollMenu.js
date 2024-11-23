import { isMobile } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import { useOutsideHandler } from '@Stec/JS/hooks';
import TopButton from './TopButton';

const scrollList = (direction, scrollWrapperRef) => {
    var currentX = scrollWrapperRef.current.scrollTop,
        offset = scrollWrapperRef.current.clientHeight;


    if ('down' === direction) {
        offset = -1 * offset;
    }

    scrollWrapperRef.current.scrollTo({
        top: currentX - offset,
        behavior: 'smooth'
    });
}

const TopScrollMenu = ({ type, selected, optionsArray, onClick }) => {

    const isMobileDevice = isMobile();
    const activeElementRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const containerRef = useRef(null);
    const [active, setActive] = useState(false);

    let classNameArray = ['stec-top-scroll-menu'];

    if (type === 'month') {
        classNameArray.push('stec-top-scroll-menu-month');
    }

    if (active) {
        classNameArray.push('active');
    }

    const selectedObject = optionsArray.filter((opt) => {
        return opt.value === selected;
    });

    const controllers = {};

    if (isMobileDevice) {
        controllers.onClick = () => {
            setActive(!active);
        }
    } else {
        controllers.onMouseEnter = () => {
            setActive(true);
        }
        controllers.onMouseLeave = () => {
            setActive(false);
        }
    }

    useOutsideHandler(containerRef, isMobileDevice ? () => {
        setActive(false);
    } : false);

    return (
        <StecDiv ref={containerRef} className={classNameArray.join(' ')} {...controllers}>
            <TopButton label={selectedObject[0].label} />

            <StecDiv className='stec-top-scroll-menu-dropdown'>
                <StecDiv className='stec-top-scroll-menu-control stec-top-scroll-menu-control-up'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollList('up', scrollWrapperRef);
                    }}>
                    <i className='fa-solid fa-caret-up' />
                </StecDiv>

                <StecDiv className='stec-top-scroll-menu-dropdown-list' ref={scrollWrapperRef}>
                    {Object.keys(optionsArray).map((i) => {

                        const classNameArray = ['stec-top-scroll-menu-dropdown-option'];
                        const opt = optionsArray[i];
                        const value = opt.value;
                        const label = opt.label;
                        let ref;

                        if (selected === value) {
                            classNameArray.push('active');
                            ref = activeElementRef;
                        }

                        return <StecDiv
                            key={value}
                            ref={ref}
                            className={classNameArray.join(' ')}
                            onClick={() => onClick(value, type)}>
                            {label}
                        </StecDiv>;
                    })}
                </StecDiv>

                <StecDiv
                    className='stec-top-scroll-menu-control stec-top-scroll-menu-control-down'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollList('down', scrollWrapperRef);
                    }}>
                    <i className='fa-solid fa-caret-down' />
                </StecDiv>
            </StecDiv>
        </StecDiv>
    )
}

export default TopScrollMenu;