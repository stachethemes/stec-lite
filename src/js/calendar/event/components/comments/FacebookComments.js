
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useState } from 'react';
import { Comments, FacebookProvider } from 'react-facebook';
import CommentsPreloader from './CommentsPreloader';
import { getEventPermalink } from '@Stec/JS/helpers';
import { __ } from '@wordpress/i18n';

const FacebookComments = ({ event, style }) => {

    const appId = useSettingsAtt('comments__fb_app_id');
    const eventPermalink = getEventPermalink(event);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        let unsubscribe = false;
        let interval = null;

        const subscribeToFBEvent = () => {
            if (typeof window.FB !== 'undefined' && !ready) {

                window.FB.Event.subscribe("xfbml.render", () => {
                    if (false === unsubscribe) {
                        setReady(true);
                    }
                    clearInterval(interval);
                });

            }
        }

        if (false === ready) {

            interval = setInterval(() => {
                subscribeToFBEvent();
            }, 300);

        }

        return () => {
            unsubscribe = true;
            clearInterval(interval);
        }

    }, [ready]);

    return (
        <StecDiv className='stec-event-comments' style={style}>

            {false === ready && <CommentsPreloader />}

            <StecDiv style={false === ready ? { display: 'none' } : {}}>
                <FacebookProvider appId={appId}>
                    <Comments
                        numPosts={5}
                        href={eventPermalink}
                        width='100%'
                    />
                </FacebookProvider>
            </StecDiv>
        </StecDiv>
    )
}

export default FacebookComments;