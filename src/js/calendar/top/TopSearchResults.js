
import { useCalendarMoment, useCalendarEvents, useSearchEventsByText, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import TopSearchResult from './TopSearchResult';
import { __, sprintf } from '@wordpress/i18n';

const TopSearchResults = ({ searchText, onEventSelect }) => {

    const { safeValue: activeCalendarDate } = useCalendarMoment();
    let searchStartRangeDateString = moment(activeCalendarDate).startOf('day').format('YYYY-MM-DDTHH:mm');
    let searchEndRangeDateString = moment(activeCalendarDate).startOf('day').add(12, 'months').format('YYYY-MM-DDTHH:mm');

    // check if global function stecFilterTopMenuSearchRanges exists
    // if it does, use it to get search range
    if (typeof window.stecFilterTopMenuSearchRanges === 'function') {

        const ranges = window.stecFilterTopMenuSearchRanges({
            startRange: searchStartRangeDateString,
            endRange: searchEndRangeDateString,
            current: moment(activeCalendarDate).format('YYYY-MM-DDTHH:mm')
        });

        if (typeof ranges === 'object') {

            if (typeof ranges.startRange === 'string') {
                searchStartRangeDateString = ranges.startRange;
            }
            
            if (typeof ranges.endRange === 'string') {
                searchEndRangeDateString = ranges.endRange;
            }

        }
    }
    
    const { value: events } = useCalendarEvents();
    const calendarId = useSettingsAtt('id');
    const threadIndex = `top-menu-search-${calendarId}`;
    const { items: searchResults, ready: searchResultsReady } = useSearchEventsByText({
        searchText: searchText,
        events: events,
        startRange: searchStartRangeDateString,
        endRange: searchEndRangeDateString,
        threadIndex: threadIndex
    });

    if (!searchText) {
        return null;
    }

    if (true === searchResultsReady && searchResults.length <= 0) {
        return (
            <StecSpan className='stec-top-menu-search-result-message'>
                <i className='fa-solid fa-search' />{__('No events found', 'stec')}
            </StecSpan>
        )
    }

    if (true !== searchResultsReady) {
        return (
            <StecSpan className='stec-top-menu-search-result-message'>
                <i className='fa-solid fa-search' />{sprintf(__('Searching for %s', 'stec'), searchText)}
            </StecSpan>
        )
    }

    return (

        <StecDiv className='stec-top-search-menu-results'>
            {searchResults.map(event => {
                return <TopSearchResult key={`${event.id}-${event.meta.start_date}`} event={event} onEventSelect={event => {
                    onEventSelect(event);
                }} />
            })}

        </StecDiv>
    )
}

export default TopSearchResults