import EventTags from '@Stec/CommonComponents/EventTags';
import { getDayLabels, getEventPermalink, getEventSortedImages, getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';

function EventSlide({ event, widgetProps }) {

    const classNameArray = ['stec-slide-boxgrid'];
    const hasImages = getEventSortedImages(event);
    const isEventCancelled = event.meta.event_status === 'EventCancelled';
    const eventTitle = isEventCancelled ? <del>{event.title}</del> : event.title;

    const EventDate = ({ event }) => {

        const hideEndFromBoxGrid = widgetProps.hide_end ?? true;
        const showInUserTimezone = STEC_VARIABLES?.use_user_tz || false;

        const getDateInfo = (value = 'start') => {

            if (value === 'end') {

                const eventEndMoment = moment.tz(event.meta.end_date, event.meta.timezone);

                if (showInUserTimezone) {
                    eventEndMoment.local();
                }

                const year = eventEndMoment.year();
                const date = eventEndMoment.date();
                const monthNum = eventEndMoment.month();
                const monthLabel = getMonthLabel(monthNum, 'short');
                const dayLabel = getDayLabels('long')[eventEndMoment.day()];
                const dayLabelShort = getDayLabels('short')[eventEndMoment.day()];

                return {
                    year: year,
                    date: date,
                    monthLabel: monthLabel,
                    dayLabel: dayLabel,
                    dlShort: dayLabelShort
                }

            }

            const eventStartMoment = moment.tz(event.meta.start_date, event.meta.timezone);

            if (showInUserTimezone) {
                eventStartMoment.local();
            }

            const year = eventStartMoment.year();
            const date = eventStartMoment.date();
            const monthNum = eventStartMoment.month();
            const monthLabel = getMonthLabel(monthNum, 'short');
            const dayLabel = getDayLabels('long')[eventStartMoment.day()];
            const dayLabelShort = getDayLabels('short')[eventStartMoment.day()];

            return {
                year: year,
                date: date,
                monthLabel: monthLabel,
                dayLabel: dayLabel,
                dlShort: dayLabelShort
            }


        }

        const Separator = (params) => {

            let style = {
                fontSize: 16,
                verticalAlign: 'middle',
                fontWeight: 'bold',
                margin: '0 10px'
            };

            if (params.style) {
                // add extra css to style 
                style = {
                    ...style,
                    ...params.style
                }
            }


            return (
                <StecSpan style={style}>&ndash;</StecSpan>
            )
        }

        const { year: startYear, date: startDate, monthLabel: startMonthLabel, dayLabel: startDayLabel } = getDateInfo('start');
        const { year: endYear, date: endDate, monthLabel: endMonthLabel, dayLabel: endDayLabel } = getDateInfo('end');

        const isSameDay = startDate === endDate && startMonthLabel === endMonthLabel && startYear === endYear;
        const isSameMonth = startMonthLabel === endMonthLabel && startYear === endYear;
        const hideEnd = event.meta.hide_end || hideEndFromBoxGrid;

        if (isSameDay || hideEnd) {
            return (
                <StecDiv className='stec-slide-boxgrid-event-date'>
                    <StecSpan className='stec-slide-boxgrid-event-date-day'>
                        {startDate}
                    </StecSpan>
                    <StecSpan className='stec-slide-boxgrid-event-date-month-and-year'>
                        <StecSpan className='stec-slide-boxgrid-event-date-year'>
                            {startYear}
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-slide-boxgrid-event-date-month'>
                            {startMonthLabel}
                        </StecSpan>
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-slide-boxgrid-event-date-daylabel'>
                        {startDayLabel}
                    </StecSpan>
                </StecDiv>
            )
        }

        if (isSameMonth) {
            return (
                <StecDiv className='stec-slide-boxgrid-event-date'>
                    <StecSpan className='stec-slide-boxgrid-event-date-day'>
                        {startDate}
                        <Separator />
                        {endDate}
                    </StecSpan>
                    <StecSpan className='stec-slide-boxgrid-event-date-month-and-year'>
                        <StecSpan className='stec-slide-boxgrid-event-date-year'>
                            {startYear}
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-slide-boxgrid-event-date-month'>
                            {startMonthLabel}
                        </StecSpan>
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-slide-boxgrid-event-date-daylabel'>
                        {startDate} {startDayLabel} - {endDate} {endDayLabel}
                    </StecSpan>
                </StecDiv>
            )
        }

        return (
            <StecDiv style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItem: 'center'
            }}>
                <StecDiv className='stec-slide-boxgrid-event-date'>
                    <StecSpan className='stec-slide-boxgrid-event-date-day'>
                        {startDate}
                    </StecSpan>
                    <StecSpan className='stec-slide-boxgrid-event-date-month-and-year'>
                        <StecSpan className='stec-slide-boxgrid-event-date-year'>
                            {startYear}
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-slide-boxgrid-event-date-month'>
                            {startMonthLabel}
                        </StecSpan>
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-slide-boxgrid-event-date-daylabel'>
                        {startDayLabel}
                    </StecSpan>
                </StecDiv>
                <Separator style={{ marginTop: 10 }} />
                <StecDiv className='stec-slide-boxgrid-event-date'>
                    <StecSpan className='stec-slide-boxgrid-event-date-day'>
                        {endDate}
                    </StecSpan>
                    <StecSpan className='stec-slide-boxgrid-event-date-month-and-year'>
                        <StecSpan className='stec-slide-boxgrid-event-date-year'>
                            {endYear}
                        </StecSpan>
                        <br />
                        <StecSpan className='stec-slide-boxgrid-event-date-month'>
                            {endMonthLabel}
                        </StecSpan>
                    </StecSpan>
                    <br />
                    <StecSpan className='stec-slide-boxgrid-event-date-daylabel'>
                        {endDayLabel}
                    </StecSpan>
                </StecDiv>
            </StecDiv>
        )

    }

    const getClickLink = () => {

        const { prefer_external_link } = widgetProps;

        if (prefer_external_link && event.meta?.external_link?.url) {
            return event.meta.external_link.url;
        }

        return getEventPermalink(event);
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            {
                <StecDiv
                    className='stec-slide-boxgrid-background-image'
                    style={
                        hasImages.length > 0 ?
                            { backgroundColor: event.color, backgroundImage: `url(${hasImages[0].sizes.full})` } :
                            {
                                backgroundColor: event.color
                            }
                    }>
                </StecDiv>
            }

            <StecDiv className='stec-slide-boxgrid-container'>
                <StecDiv className='stec-slide-boxgrid-event-top'>
                    <StecDiv className='stec-slide-boxgrid-event-icon'>
                        {event.meta.thumbnail.icon ? <i className={event.meta.thumbnail.icon} /> : ''}
                    </StecDiv>

                    <EventDate event={event} />

                </StecDiv>

                <StecDiv className='stec-slide-boxgrid-event-content'>
                    {widgetProps.display_tags && <EventTags event={event} includeCategories={widgetProps.display_categories || false} />}
                    <StecDiv className='stec-slide-boxgrid-event-title'>{eventTitle}</StecDiv>

                    {
                        (widgetProps.display_description && event.short_description) &&
                        <StecDiv className='stec-slide-boxgrid-event-description'
                            dangerouslySetInnerHTML={{ __html: event.short_description }} />
                    }

                </StecDiv>

                <a target={widgetProps.open_events_in || '_blank'} href={getClickLink()} className='stec-slide-boxgrid-link' />

            </StecDiv>



        </StecDiv>
    )
}

export default EventSlide