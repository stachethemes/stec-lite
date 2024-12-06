import React, { useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventSlide from './EventSlide';
import WideBullets from './WideBullets';

const Slider = (props) => {

    const swiperRef = useRef(null);
    const slidesPerView = props.widgetProps.columns;
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState(props.events.length - slidesPerView + 1);

    const handlePageChange = (page) => {
        swiperRef.current.slideTo(page);
    }

    const handleSlideChange = (swiper) => {
        setCurrentPage(swiper.realIndex);
    }

    const updateColums = (swiper) => {

        const breakPoint = window.stecFilterSliderBreakpoint ?? 350;

        let desiredSlidesPerView = props.widgetProps.columns;

        let newSlidesPerView = Math.max(1, Math.min(props.events.length, desiredSlidesPerView, Math.floor(swiper.width / breakPoint)));

        swiper.params.slidesPerView = newSlidesPerView;

        swiper.update();

        setPages(props.events.length - newSlidesPerView + 1);
    }

    const onSwiperInit = (swiper) => {
        swiperRef.current = swiper;
        updateColums(swiper);
    }

    const handleOnResize = (swiper) => {
        updateColums(swiper);
    }

    const autoPlayEnabled = !!props.widgetProps.auto_slide;
    const autoPlaySettings = autoPlayEnabled ? { delay: props.widgetProps.auto_slide * 1000, disableOnInteraction: true } : false
    const kbdSettings = { enabled: true, onlyInViewport: true, };
    const wideBulletsEnabled = !!props.widgetProps.slider_bullets;
    const arrowsEnabled = !!props.widgetProps.slider_arrows;
    const swipeSpeed = window.stecFilterSliderSpeed ?? 500;

    return (
        <>
            <Swiper
                speed={swipeSpeed}
                onInit={onSwiperInit}
                onSlideChange={handleSlideChange}
                onResize={handleOnResize}
                direction={'horizontal'}
                mousewheel={true}
                loop={false}
                grabCursor={true}
                spaceBetween={props.widgetProps.gutter}
                slidesPerView={slidesPerView}
                keyboard={kbdSettings}
                modules={[Keyboard, Mousewheel, Navigation, Autoplay]}
                initialSlide={0}
                navigation={arrowsEnabled}
                autoplay={autoPlaySettings}
            >
                {
                    props.events.map((event) => {
                        return (
                            <SwiperSlide key={`${event.id}-${event.meta.start_date}`} >
                                <EventSlide event={event} widgetProps={props.widgetProps} />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>

            {wideBulletsEnabled && <WideBullets pages={pages} currentPage={currentPage} setCurrentPage={handlePageChange} />}
        </>
    )
}

export default Slider