import Thumbnail from '@Stec/CommonComponents/Thumbnail';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyDate, getEventMomentWithOffset, getMonthLabel, getUtcOffset } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useState } from 'react';

const ScheduleItem = ({ schedule, offset, eventTimezone }) => {

    const [active, setActive] = useState(false);

    const showTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const dateFormat = useSettingsAtt('date_format');
    const timeFormat = useSettingsAtt('time_format');
    const classNameArray = ['stec-event-schedule-item'];
    
    const scheduleMoment = getEventMomentWithOffset(schedule.start, offset, eventTimezone);

    if (showInUserTimezone) {
        scheduleMoment.local();
    }

    let dateString = beautifyDate(scheduleMoment, false, dateFormat, timeFormat);

    if (showTzOffset) {

        const displayedTimezone = getUtcOffset(scheduleMoment);

        dateString = `${dateString} (${displayedTimezone})`;
    }

    const scheduleComplete = moment().isAfter(scheduleMoment);

    let theThumbnail = '';

    if (scheduleComplete) {
        classNameArray.push('stec-event-schedule-item-completed');
        schedule.thumbnail.type = 'icon';
        schedule.thumbnail.icon = 'fa-solid fa-check';
    }

    switch (schedule.thumbnail.type) {

        case 'image':
            theThumbnail = <Thumbnail
                type='image'
                image={schedule.thumbnail.image[0].sizes.thumbnail}
                backgroundColor={schedule.color}
            />

            break;

        case 'date': {

            const date = scheduleMoment.date();
            const monthNum = scheduleMoment.month();
            const monthLabel = getMonthLabel(monthNum, 'short');

            theThumbnail = <Thumbnail
                type='date'
                day={date}
                month={monthLabel}
                backgroundColor={schedule.color}
            />

            break;
        }

        case 'icon':
        default:
            theThumbnail = <Thumbnail
                type='icon'
                icon={schedule.thumbnail.icon}
                backgroundColor={schedule.color}
            />

    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            <StecDiv style={schedule.details ? { cursor: 'pointer' } : {}} className='stec-event-schedule-item-overview' onClick={() => {
                setActive(!active);
            }}>

                <StecDiv className='stec-event-schedule-item-overview'>
                    {theThumbnail}
                    <StecDiv className='stec-event-schedule-item-overview-content'>
                        <StecSpan className='stec-event-schedule-item-title'>{schedule.title}</StecSpan>
                        <StecSpan className='stec-event-schedule-item-date'><i className='fa-solid fa-clock' />{dateString}</StecSpan>
                    </StecDiv>
                </StecDiv>

                {schedule.details &&
                    <StecDiv className='stec-event-schedule-toggle-button'>
                        {active ? <i className='fa-solid fa-minus' /> : <i className='fa-solid fa-plus' />}
                    </StecDiv>
                }

            </StecDiv>

            {active && schedule.details && <StecDiv className='stec-event-schedule-item-details' dangerouslySetInnerHTML={{ __html: schedule.details }} />}
        </StecDiv>
    )
}

function EventSchedule({ event, style, classes = '' }) {

    return (
        <StecDiv className={`stec-event-schedule ${classes}`} style={style}>

            {
                event.meta.schedule.sort((scheduleA, scheduleB) => {
                    const a = Number(scheduleA.start.replace(/[-:T]/g, ''));
                    const b = Number(scheduleB.start.replace(/[-:T]/g, ''));
                    return b > a ? -1 : 1;
                }).map((schedule, i) => {
                    return <ScheduleItem
                        key={i}
                        schedule={schedule}
                        offset={event.repeat_offset}
                        eventTimezone={event.meta.timezone}
                    />
                })
            }

        </StecDiv>
    )
}

export default EventSchedule