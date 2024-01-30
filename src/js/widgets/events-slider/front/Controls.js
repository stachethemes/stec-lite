import { StecDiv } from '@Stec/WebComponents';

const WideBullets = ({ pages, currentPage, setCurrentPage }) => {

    if (pages <= 1) {
        return null;
    }

    return (
        <StecDiv className='stec-widget-events-slider-bullets-wide'>
            {
                Array(pages).fill().map((_, i) => {

                    const classNameArray = ['stec-widget-events-slider-bullet-wide'];

                    if (i === currentPage) {
                        classNameArray.push('active');
                    }

                    return (
                        <StecDiv key={i} className={classNameArray.join(' ')} onClick={() => {
                            setCurrentPage(i);
                        }}>
                            <StecDiv className='stec-widget-events-slider-bullet-wide-visual'>
                            </StecDiv>

                        </StecDiv>
                    )
                })
            }

        </StecDiv>

    )

}

const Arrows = ({ pages, currentPage, setCurrentPage }) => {

    if (pages <= 1) {
        return null;
    }

    const prevPage = () => {

        if (currentPage === 0) {
            return;
        }

        setCurrentPage(currentPage - 1);

    }

    const nextPage = () => {

        if (currentPage === pages - 1) {
            return;
        }

        setCurrentPage(currentPage + 1);

    }

    return (
        <>

            <StecDiv className={`stec-widget-events-slider-arrow-prev ${currentPage <= 0 ? 'hide' : ''}`} onClick={prevPage}>
                <i className='fa-solid fa-chevron-left'></i>
            </StecDiv>

            <StecDiv className={`stec-widget-events-slider-arrow-next ${currentPage >= pages - 1 ? 'hide' : ''}`} onClick={nextPage}>
                <i className='fa-solid fa-chevron-right'></i>
            </StecDiv>

        </>

    )
}

const Controls = ({ pages, currentPage, setCurrentPage, widgetProps }) => {

    return (
        <>
            {
                widgetProps.slider_bullets &&
                <WideBullets pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            }

            {
                widgetProps.slider_arrows &&
                <Arrows pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            }
        </>
    )

}

export default Controls;