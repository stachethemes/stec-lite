import Modal from '@Stec/CommonComponents/Modal';
import { useImagesLoaded } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef, useState } from 'react';

const Thumb = ({ src, active, onClick }) => {

    const classNameArray = ['stec-media-carousel-modal-thumbnail'];

    if (active) {
        classNameArray.push('active');
    }

    return <StecDiv
        className={classNameArray.join(' ')}
        style={{ backgroundImage: `url(${src})` }}
        onClick={onClick}></StecDiv>

}

const Image = ({ src, active, onClick }) => {

    const classNameArray = ['stec-media-carousel-modal-image'];

    const imageRef = useRef();

    if (active) {
        classNameArray.push('active');
    }

    useEffect(() => {

        if (active) {
            imageRef.current.focus();
        }

    }, [active])

    return <img
        onClick={onClick}
        tabIndex='-1'
        style={{ outline: 'none' }}
        ref={imageRef}
        className={classNameArray.join(' ')}
        src={src} />

}

const ModalMediaCarousel = ({ images, active: initActive, isOpen, onClose, onChange }) => {

    const uniqueImages = [...new Map(images.map(item => [item['id'], item])).values()];

    const [active, setActive] = useState(false);
    
    const { ready: imageLoaded } = useImagesLoaded(active ? [
        uniqueImages.find(image => image.id === active)?.sizes?.full
    ] : []);
    const [showThumbs, setShowThumbs] = useState(true);
    const uniqueImagesDep = JSON.stringify(uniqueImages);
    const imagesContainerRef = useRef();

    useEffect(() => {

        setActive(initActive);

    }, [initActive]);

    useEffect(() => {

        if (false === imageLoaded) {
            return;
        }

        function bindKeyboard(e) {

            switch (e.which) {

                // case escape key
                case 27: {
                    onClose();
                    break;
                }

                // case left key
                case 37: {

                    let imageIndex = uniqueImages.findIndex(test => test.id === active);

                    if (imageIndex <= 0) {
                        imageIndex = uniqueImages.length - 1;
                    } else {
                        imageIndex = imageIndex - 1;
                    }

                    let nextImage = uniqueImages[imageIndex].id;

                    setActive(nextImage);

                    break;
                }

                // case right key
                case 39: {

                    let imageIndex = uniqueImages.findIndex(test => test.id === active);

                    if (imageIndex + 1 >= uniqueImages.length) {
                        imageIndex = 0;
                    } else {
                        imageIndex = imageIndex + 1;
                    }

                    let nextImage = uniqueImages[imageIndex].id;

                    setActive(nextImage);

                    break;
                }
            }
        }

        document.addEventListener('keydown', bindKeyboard);

        return () => {
            document.removeEventListener('keydown', bindKeyboard);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, uniqueImagesDep, imageLoaded]);

    // Function to slide images on mobile
    useEffect(() => {

        if (!isMobile || !imagesContainerRef.current || !isOpen) {
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

    }, [images, active, isOpen]);

    if (false === active) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth='100%' plain={true} overlayColor={'rgba(0,0,0,0.95)'}>

            <StecDiv className='stec-media-carousel-modal' style={{ height: 'auto' }} onClick={onClose}>

                {
                    (showThumbs && uniqueImages.length > 1) && <StecDiv className='stec-media-carousel-modal-thumbnails'>
                        {
                            uniqueImages.map(image => {

                                const isActive = image.id === active;

                                return (
                                    <Thumb key={image.id} src={image.sizes.thumbnail} active={isActive} onClick={(e) => {
                                        e.stopPropagation();
                                        setActive(image.id);
                                        if (onChange) {
                                            onChange(image.id);
                                        }
                                    }} />
                                )
                            })
                        }
                    </StecDiv>
                }

                {
                    imageLoaded && <StecDiv
                        ref={imagesContainerRef}
                        onClick={onClose}
                        className={`stec-media-carousel-modal-images ${!showThumbs ? 'no-thumbs' : ''}`}>
                        {
                            uniqueImages.map(image => {

                                const isActive = image.id === active;

                                return (
                                    <Image key={image.id} src={image.sizes.full} active={isActive} onClick={(e) => {
                                        e.stopPropagation();
                                        setShowThumbs(state => !state);
                                    }} />
                                )
                            })
                        }
                    </StecDiv>
                }

            </StecDiv>

        </Modal>
    )
}

export default ModalMediaCarousel