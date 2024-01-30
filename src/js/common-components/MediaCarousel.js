import { useImagesLoaded } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef, useState } from 'react';
import ModalMediaCarousel from './ModalMediaCarousel';

const Thumb = ({ src, active, onClick }) => {

    const classNameArray = ['stec-media-carousel-thumbnail'];

    if (active) {
        classNameArray.push('active');
    }

    return <StecDiv
        className={classNameArray.join(' ')}
        style={{ backgroundImage: `url(${src})` }}
        onClick={onClick}></StecDiv>
}

const Image = ({ src, active, onClick }) => {

    const classNameArray = ['stec-media-carousel-image'];

    if (active) {
        classNameArray.push('active');
    }

    return <StecDiv
        className={classNameArray.join(' ')}
        onClick={onClick}
        style={{ backgroundImage: `url(${src})` }}></StecDiv>

}

const MediaCarouselContent = ({ images }) => {

    const [active, setActive] = useState(images[0].id);
    const [modalOpen, setModalOpen] = useState(false);

    const imagesContainerRef = useRef();
    const showThumbs = images.length > 1;

    // Function to mouse move image position if images don't comform the aspect ratio
    useEffect(() => {
        const activeElement = imagesContainerRef.current.getElementsByClassName('active')[0];

        const imageMouseOut = () => {
            activeElement.style.backgroundPositionX = '50%';
            activeElement.style.backgroundPositionY = '50%';
            activeElement.style.transition = 'opacity .5s linear, background-position .5s ease';
        };

        const imageMouseMove = (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const w = activeElement.offsetWidth;
            const h = activeElement.offsetHeight;

            const xPos = Math.max(0, Math.round((x / w) * 100));
            const yPos = Math.max(0, Math.round((y / h) * 100));

            activeElement.style.transition = 'none';
            activeElement.style.backgroundPosition = `${xPos}% ${yPos}%`;
        };

        activeElement.addEventListener('mousemove', imageMouseMove, { passive: true });
        activeElement.addEventListener('mouseout', imageMouseOut, { passive: true });

        return () => {
            activeElement.removeEventListener('mousemove', imageMouseMove);
            activeElement.removeEventListener('mouseout', imageMouseOut);
        };

    }, [active]);

    // Function to slide images on mobile
    useEffect(() => {

        if (!isMobile || !imagesContainerRef.current) {
            return;
        }

        let touchStartX = 0;

        const slidePrev = () => {

            const prevId = images[images.findIndex(image => image.id === active) - 1]?.id;

            if (prevId) {
                setActive(prevId);
            }
   
        }

        const slideNext = () => {

            const nextId = images[images.findIndex(image => image.id === active) + 1]?.id;

            if (nextId) {
                setActive(nextId);
            }
     
        }

        const handleTouchStart = (event) => {
            touchStartX = event.touches[0]?.clientX || 0;
        };

        const handleTouchEnd = (event) => {
            const touchEndX = event.changedTouches[0]?.clientX || 0;
            const deltaX = touchEndX - touchStartX;
            const threshold = 50;

            if (deltaX > threshold) {
                slidePrev();
            } else if (deltaX < -threshold) {
                slideNext();
            }
        };

        const element = imagesContainerRef.current;

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };

    }, [images, active]);

    return (
        <>
            {
                <ModalMediaCarousel
                    active={active}
                    onChange={value => {
                        setActive(value);
                    }}
                    images={images}
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false)
                    }}
                />
            }

            {
                showThumbs &&
                <StecDiv className='stec-media-carousel-thumbnails'>
                    {
                        images.map(image => {

                            const isActive = image.id === active;

                            return (
                                <Thumb key={image.id} src={image.sizes.thumbnail} active={isActive} onClick={() => {
                                    setActive(image.id);
                                }} />
                            )
                        })
                    }
                </StecDiv>
            }

            <StecDiv className='stec-media-carousel-images' ref={imagesContainerRef}>
                {
                    images.map(image => {

                        const isActive = image.id === active;

                        return (
                            <Image key={image.id} src={image.sizes.full} active={isActive} onClick={() => {
                                setModalOpen(true);
                            }} />
                        )
                    })
                }
            </StecDiv>

        </>
    )

}

const MediaCarousel = ({ images, style }) => {

    const uniqueImages = [...new Map(images.map(item =>
        [item['id'], item])).values()];

    const { ready: imagesLoaded } = useImagesLoaded(uniqueImages.map(image => image.sizes.full));

    const classNameArray = ['stec-media-carousel'];

    const showThumbs = uniqueImages.length > 1;

    const hasDimensionsData = images[0].dimensions ? true : false;

    const paddingTop = images.length === 1 && hasDimensionsData ?
        `calc(100% / ${images[0].dimensions.full.ar} )` :
        `calc(100% / var(--stec-media-carousel-ratio) )`;

    const withPaddingTopStyle = {
        ...style,
        paddingTop: paddingTop
    }

    if (imagesLoaded) {
        classNameArray.push('stec-media-carousel-images-ready');
    }

    if (!showThumbs) {
        classNameArray.push('no-thumbs');
    }

    return (
        <StecDiv
            className={classNameArray.join(' ')}
            style={withPaddingTopStyle}>

            {
                imagesLoaded && <MediaCarouselContent images={uniqueImages} />
            }

        </StecDiv>
    )

}

export default MediaCarousel