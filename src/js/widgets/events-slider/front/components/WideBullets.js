import { StecDiv } from '@Stec/WebComponents';

const WideBullets = ({ pages, currentPage, setCurrentPage }) => {

    if (pages <= 1) {
        return null;
    }

    return (
        <StecDiv className='stec-widget-events-slider-bullets-wide'>
            {
                Array(pages).fill(null).map((_, i) => {

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

export default WideBullets;