import { StecDiv, StecSpan } from '@Stec/WebComponents';
import TopFilterItems from './TopFilterItems';

const TopFilter = ({ filter, active, onClick }) => {

    const classNameArray = ['stec-top-filter'];
    const isActive = active === filter.id;

    if (isActive) {
        classNameArray.push('active');
    }

    classNameArray.push(`stec-top-filter-${filter.id}`);

    return (
        <StecDiv className={classNameArray.join(' ')}

            onClick={() => {
                onClick(filter.id);
            }}>

            <StecSpan className='stec-top-filter-selector'>

                <StecSpan className='stec-top-filter-title'>
                    <i className={filter.icon} />
                    <StecSpan>{filter.label}</StecSpan>
                </StecSpan>

                <StecSpan className='stec-top-filter-selector-toggle-icons'>
                    {isActive ? <i className='fa-solid fa-chevron-down' /> : <i className='fa-solid fa-chevron-right' />}
                </StecSpan>

            </StecSpan>

            {isActive && <TopFilterItems filter={filter} />}

        </StecDiv>
    )
}

export default TopFilter
