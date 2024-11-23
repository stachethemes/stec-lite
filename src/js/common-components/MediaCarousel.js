import React, { useEffect, useState } from 'react';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import ModalMediaCarousel from './ModalMediaCarousel';
import { StecDiv } from '@Stec/WebComponents';

const ImageItem = ({ src }) => {

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setLoaded(true);
        }

    }, [src, loaded]);

    if (!loaded) {
        return <StecDiv className='stec-media-carousel-placeholder'></StecDiv>
    }

    return (
        <StecDiv className='stec-media-carousel-image'><img src={src} alt='media' /></StecDiv>
    )

}

const MediaCarousel = ({ images, classes, style }) => {

    const [active, setActive] = useState(false);

    const classNameArray = ['stec-media-carousel'];

    if (classes) {
        classNameArray.push(classes);
    }

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const uniqueImages = [...new Map(images.map(item =>
        [item['id'], item])).values()];


    const hasThumbnails = uniqueImages.length > 1;

    const getThumbnailsPerView = (imagesLength) => {

        if (typeof window.stecFilterMediaCarouselThumbsPerView === 'function') {
            return window.stecFilterMediaCarouselThumbsPerView(imagesLength);
        }

        return imagesLength > 4 ? 4 : imagesLength;
    }

    const thumbsPerView = getThumbnailsPerView(uniqueImages.length);

    const swipeSpeed = window.stecFilterMediaCarouselSpeed ?? 500;

    return (
        <>
            <ModalMediaCarousel
                active={active}
                images={images}
                isOpen={!!active}
                onClose={() => {
                    setActive(false)
                }}
            />

            <StecDiv className={classNameArray.join(' ')} style={style}>

                {/* Main swiper */}
                <Swiper
                    speed={swipeSpeed}
                    className='stec-media-carousel-main'
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={true}
                    loop={uniqueImages.length > 1}
                    modules={[Thumbs, Navigation]}
                    thumbs={{ swiper: thumbsSwiper }}>
                    {uniqueImages.map(item => {
                        return (
                            <SwiperSlide key={item.id} onClick={() => {
                                setActive(item.id);
                            }}>
                                <ImageItem src={item.sizes.full} />
                            </SwiperSlide>
                        )
                    })}
                </Swiper>

                {/* Thumbs Swiper */}
                {hasThumbnails && <StecDiv className='stec-media-carousel-thumbs-wrapper'>
                    <Swiper
                        className='stec-media-carousel-thumbs'
                        modules={[Thumbs]}
                        watchSlidesProgress
                        spaceBetween={10}
                        slidesPerView={thumbsPerView}
                        onSwiper={setThumbsSwiper}
                    >
                        {uniqueImages.map(item => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <ImageItem src={item.sizes.large} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </StecDiv>
                }
            </StecDiv>

        </>

    )

}

export default MediaCarousel