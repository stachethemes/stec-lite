
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import CommentsDisabled from './CommentsDisabled';
import FacebookComments from './FacebookComments';
import InternalComments from './InternalComments';

const EventComments = ({ event, style, isBuilder }) => {

    const commentsType = useSettingsAtt('comments__type');

    if (isBuilder) {
        return <InternalComments event={event} style={style} isBuilder={isBuilder} />
    }

    if (true === window.STEC_FORCE_DISABLE?.internal_comments) {

        return <CommentsDisabled style={style} />

    }

    switch (commentsType) {
        case 'facebook': {
            return <FacebookComments event={event} style={style} />
        }

        default: {
            return <InternalComments event={event} style={style} />
        }
    }


}

export default EventComments;