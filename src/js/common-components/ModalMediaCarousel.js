import Modal from '@Stec/CommonComponents/Modal';
import { StecDiv } from '@Stec/WebComponents';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';

import { Keyboard, Mousewheel, Navigation, Zoom, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ModalMediaCarousel = ({ images, active: initActive, isOpen, onClose, onChange }) => {

    const uniqueImages = [...new Map(images.map(item => [item['id'], item])).values()];

    const kbdSettings = { enabled: true, onlyInViewport: true, };
    const arrowsEnabled = true;
    const swipeSpeed = window.stecFilterCarouselSpeed ?? 450;
    const scrollBarSettings = { hide: true }
    const initialIndex = uniqueImages.findIndex((image) => image.id === initActive);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth='100%' plain={true} overlayColor={'rgba(0,0,0,0.95)'}>
            <StecDiv className='stec-media-carousel-modal'>
                <Swiper
                    zoom={true}
                    centeredSlides={true}
                    speed={swipeSpeed}
                    direction={'horizontal'}
                    mousewheel={true}
                    loop={uniqueImages.length > 1}
                    grabCursor={true}
                    slidesPerView={1}
                    keyboard={kbdSettings}
                    modules={[Keyboard, Mousewheel, Navigation, Zoom, Scrollbar]}
                    initialSlide={initialIndex}
                    navigation={arrowsEnabled}
                    scrollbar={scrollBarSettings}
                    spaceBetween={10}
                >
                    {
                        uniqueImages.map((image) => {

                            return (
                                <SwiperSlide key={image.id} >
                                    <div className='swiper-zoom-container'>
                                        <img src={image.sizes.full} />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </StecDiv>
        </Modal>
    )
}

export default ModalMediaCarousel