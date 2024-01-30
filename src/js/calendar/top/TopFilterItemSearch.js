import { StecDiv } from '@Stec/WebComponents';
import TopSearchInput from './TopSearchInput';

const TopFilterItemSearch = ({ placeholder, onChange }) => {

    return (
        <StecDiv className='stec-top-filter-item-search'
            onClick={(e) => {
                e.stopPropagation();
            }}>
            <TopSearchInput placeholder={placeholder} onChange={onChange} delay={100} />
        </StecDiv>
    )
}

export default TopFilterItemSearch
