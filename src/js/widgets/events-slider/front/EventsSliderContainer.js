import { StecDiv } from '@Stec/WebComponents';
import EventSlide from './EventSlide';
import { isMobile } from '@Stec/JS/helpers';
import { useRef, useEffect, useState } from 'react';
import { isNumber } from 'lodash';
import Controls from './Controls';

function EventsSliderContainer({ events, wrapperRef, widgetProps }) {

    const [pauseAutoSlide, setPauseAutoSlide] = useState(false);
    const mobile = isMobile();
    const desiredColumns = widgetProps.columns || 3;
    const eventsContainerRef = useRef(null);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const columns = useRef(desiredColumns);
    const spacing = isNumber(widgetProps.gutter) ? parseInt(widgetProps.gutter, 10) : 0;

    // This is used to force repositioning of the slider
    const [repositionId, setRepositionId] = useState(0);

    useEffect(() => {

        const wrapperContainer = wrapperRef.current;

        const getColumns = (adjustedColumns) => {

            const minimumBlockWidth = 320;
            const containerWidth = wrapperRef.current.offsetWidth;

            if (containerWidth < adjustedColumns * minimumBlockWidth) {
                return getColumns(adjustedColumns - 1);
            }

            if (adjustedColumns > events.length) {
                adjustedColumns = events.length;
            }

            // Make sure we have at least 1 column
            return Math.max(1, adjustedColumns);

        }

        const adjustDimensions = (containerWidth) => {

            columns.current = getColumns(desiredColumns);

            const wrapperWidth = containerWidth;
            const slideWidthSpacing = spacing * (columns.current - 1) / columns.current;
            const slideWidth = Math.ceil((wrapperWidth / columns.current) - slideWidthSpacing);

            const slides = eventsContainerRef.current.querySelectorAll('.stec-widget-events-slider-event-slide');

            slides.forEach((slide, i) => {

                slide.style.width = `${slideWidth}px`;

                if (i !== slides.length - 1) {
                    slide.style.marginRight = `${spacing}px`;
                }
            });

            eventsContainerRef.current.style.width = `${(slideWidth * events.length) + (spacing * (events.length - 1))}px`;

            const adjustedPages = Math.ceil(events.length / columns.current);

            if (adjustedPages !== pages) {
                setPages(adjustedPages);
                setCurrentPage(0);
            } else {
                // Only reposition if the pages are the same
                setRepositionId((prevId) => prevId + 1);
            }

        }

        const onResizeEnd = (entries) => {

            if (entries[0] && entries[0].contentRect) {

                const containerWidth = entries[0].contentRect.width;

                adjustDimensions(containerWidth);

                eventsContainerRef.current.style.opacity = 1;

            }

        }

        const observer = new ResizeObserver(onResizeEnd);

        if (wrapperContainer) {
            observer.observe(wrapperContainer);
        }

        return () => {

            if (wrapperContainer) {
                observer.unobserve(wrapperContainer);
            }
        }

    }, [desiredColumns, events, pages, spacing, wrapperRef]);

    useEffect(() => {

        const slide = eventsContainerRef.current.querySelector('.stec-widget-events-slider-event-slide');
        const slideWidth = slide.offsetWidth + spacing;

        let offset = columns.current * slideWidth * currentPage;

        // check if the offset is not more than the last slide
        if (offset > eventsContainerRef.current.offsetWidth - wrapperRef.current.offsetWidth) {
            offset = eventsContainerRef.current.offsetWidth - wrapperRef.current.offsetWidth;
        }

        eventsContainerRef.current.style.transform = `translateX(-${offset}px)`;

    }, [currentPage, spacing, wrapperRef, repositionId]);

    useEffect(() => {

        if (!isMobile || !eventsContainerRef.current) {
            return;
        }

        let touchStartX = 0;

        const handleTouchStart = (event) => {
            touchStartX = event.touches[0]?.clientX || 0;
        };

        const handleTouchEnd = (event) => {
            const touchEndX = event.changedTouches[0]?.clientX || 0;
            const deltaX = touchEndX - touchStartX;
            const threshold = 50;

            if (deltaX > threshold && currentPage > 0) {
                setCurrentPage((prevPage) => prevPage - 1);
            } else if (deltaX < -threshold && currentPage < pages - 1) {
                setCurrentPage((prevPage) => prevPage + 1);
            }
        };

        const element = eventsContainerRef.current;

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };

    }, [currentPage, pages, eventsContainerRef]);

    useEffect(() => {
        let interval;

        const start = () => {
            interval = setInterval(() => {
                if (currentPage === pages - 1) {
                    setCurrentPage(0);
                } else {
                    setCurrentPage(currentPage + 1);
                }
            }, widgetProps.auto_slide * 1000);
        };

        const pause = () => {
            clearInterval(interval);
        };

        if (!widgetProps.auto_slide) {
            return;
        }

        if (pauseAutoSlide) {
            pause();
        } else {
            start();
        }

        return () => {
            clearInterval(interval);
        };

    }, [currentPage, pages, widgetProps.auto_slide, pauseAutoSlide]);

    useEffect(() => {

        if (wrapperRef.current) {

            wrapperRef.current.addEventListener('mouseenter', () => {
                setPauseAutoSlide(true);
            });

            wrapperRef.current.addEventListener('mouseleave', () => {
                setPauseAutoSlide(false);
            });

        }

    }, [wrapperRef])

    const onMouseEnter = () => {

        if (!wrapperRef.current || mobile) {
            return;
        }

        wrapperRef.current.classList.add('stec-widget-events-slider-container-hover');
    }

    const onMouseLeave = (e) => {

        if (!wrapperRef.current || mobile) {
            return;
        }

        wrapperRef.current.classList.remove('stec-widget-events-slider-container-hover');

    }

    return (
        <>
            <StecDiv className='stec-widget-events-slider-container-wrapper' >
                <StecDiv className='stec-widget-events-slider-container' ref={eventsContainerRef}

                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}>

                    {
                        events.map(event => {

                            return <EventSlide key={`${event.id}-${event.meta.start_date}`} event={event} widgetProps={widgetProps} />

                        })
                    }


                </StecDiv>
            </StecDiv >

            <Controls
                pages={pages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                widgetProps={widgetProps} />
        </>
    )
}

export default EventsSliderContainer