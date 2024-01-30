import { centerScrollElement } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useRef } from 'react';
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

    const activeElementRef = useRef(0);
    const scrollWrapperRef = useRef(0);

    let classNameArray = ['stec-top-scroll-menu'];

    if (type === 'month') {
        classNameArray.push('stec-top-scroll-menu-month');
    }

    const selectedObject = optionsArray.filter((opt) => {
        return opt.value === selected;
    });

    return (
        <StecDiv className={classNameArray.join(' ')} onMouseEnter={() => {
            centerScrollElement(scrollWrapperRef, activeElementRef)
        }}>
            <TopButton label={selectedObject[0].label} />

            <StecDiv className='stec-top-scroll-menu-dropdown'>
                <StecDiv className='stec-top-scroll-menu-control stec-top-scroll-menu-control-up'
                    onClick={() => scrollList('up', scrollWrapperRef)}>
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
                    onClick={() => scrollList('down', scrollWrapperRef)}>
                    <i className='fa-solid fa-caret-down' />
                </StecDiv>
            </StecDiv>
        </StecDiv>
    )
}

export default TopScrollMenu;