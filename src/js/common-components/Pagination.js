import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function Pagination({
    pages,
    currentPage,
    onClick, prevLabel = __('Previous', 'stachethemes_event_calendar_lite'),
    nextLabel = __('Next', 'steec')
}) {

    if (pages <= 1) {
        return '';
    }

    return (
        <StecDiv className='stec-pagination'>

            {currentPage > 1 && <StecSpan onClick={() => {

                const prevPage = Math.max(1, currentPage - 1);

                if (prevPage !== currentPage) {
                    onClick(prevPage);
                }

            }}>{prevLabel}</StecSpan>
            }
            {[...Array(pages).keys()].map(i => {
                const pageNumber = i + 1;
                return <StecSpan className={`${currentPage === pageNumber ? 'active' : ''}`} key={`page-${i}`} onClick={() => {

                    if (currentPage !== pageNumber) {
                        onClick(pageNumber);
                    }

                }}>{pageNumber}</StecSpan>
            })}
            {

                currentPage !== pages && 

                <StecSpan onClick={() => {

                    const nextPage = Math.min(pages, currentPage + 1);

                    if (nextPage !== currentPage) {
                        onClick(nextPage);
                    }

                }}>{nextLabel}</StecSpan>
            }
        </StecDiv>
    )
}

export default Pagination