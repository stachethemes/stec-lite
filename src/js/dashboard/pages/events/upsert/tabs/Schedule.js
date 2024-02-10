import Button from '@Stec/CommonComponents/Button';
import { UncontrolledDatePicker } from '@Stec/CommonComponents/DatePicker';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import { UncontrolledInputThumbType } from '@Stec/CommonComponents/InputThumbType';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import { useRef, useState } from 'react';

const ScheduleItem = React.forwardRef((props, ref) => {

    const { item } = props;

    const sectionRef = useRef(false);

    const sectionDefaultTitle = __('Timespan', 'stachethemes_event_calendar_lite');
    const sectionTitle = item.title || sectionDefaultTitle;

    const updateSectionTitle = (value) => {
        const titleElement = sectionRef.current.querySelector('.stec-section-collapse-title');
        titleElement.textContent = value || sectionDefaultTitle;
    }

    return <SectionCollapseContent
        ref={sectionRef}
        key={item.id}
        title={sectionTitle}
        subtitle={__('Edit timespan...', 'stachethemes_event_calendar_lite')}
        onRemove={() => {

            ref.current.meta.schedule = ref.current.meta.schedule.filter(scheduleItem => {
                return scheduleItem.id !== item.id;
            });

            props.onRequestNewInstance();
        }}>

        <UncontrolledInputText
            title={__('Title', 'stachethemes_event_calendar_lite')}
            placeholder={__('Timespan Title', 'stachethemes_event_calendar_lite')}
            defaultValue={item.title}
            onChange={value => {
                item.title = value;

                updateSectionTitle(value);
            }} />

        <Spacer />

        <UncontrolledDatePicker
            title={__('Date and time', 'stachethemes_event_calendar_lite')}
            includeTime={true}
            defaultValue={item.start}
            onChange={value => {
                item.start = value;
            }}
        />

        <Spacer />

        <UncontrolledInputColor
            title={__('Color', 'stachethemes_event_calendar_lite')}
            defaultValue={item.color}
            onChange={(value) => {
                item.color = value;
            }} />

        <Spacer />

        <UncontrolledInputThumbType defaultValue={item.thumbnail} onChange={value => {
            item.thumbnail = value;
        }} />

        <Spacer />

        <UncontrolledInputTextarea
            title={__('Details', 'stachethemes_event_calendar_lite')}
            defaultValue={item.details}
            onChange={value => {
                item.details = value;
            }}
        />

    </SectionCollapseContent>

});

ScheduleItem.displayName = 'ScheduleItem';

const ScheduleContent = React.forwardRef((props, ref) => {

    return (
        <>

            {ref.current.meta.schedule.map((item, i) => {
                return <ScheduleItem ref={ref} key={item.id} item={item} onRequestNewInstance={props.onRequestNewInstance} />
            })}

        </>
    )

});

ScheduleContent.displayName = 'ScheduleContent';

const Schedule = (props) => {

    const scheduleLength = props.postData.current.meta.schedule.length;

    const [instanceKey, setInstanceKey] = useState(0);

    const resetInstance = () => {
        setInstanceKey(uniqueId());
    }

    const itemTemplate = {
        id: scheduleLength <= 0 ? 1 : scheduleLength + 1,
        title: '',
        start: props.postData.current.meta.start_date,
        color: '#75dd66',
        thumbnail: {
            type: 'icon',
            icon: 'fa-solid fa-flag',
            image: []
        },
        details: ''
    }

    const addItem = () => {
        const newItem = itemTemplate;
        props.postData.current.meta.schedule.push(newItem);
        resetInstance();
    }

    return (
        <Section title={__('Schedule', 'stachethemes_event_calendar_lite')}>

            <ScheduleContent instanceKey={instanceKey} ref={props.postData} onRequestNewInstance={resetInstance} />

            <Button className='blue' style={{ marginTop: 5 }} label={__('Add Timespan', 'stachethemes_event_calendar_lite')} onClick={addItem} />

        </Section>
    )
}

export default Schedule
