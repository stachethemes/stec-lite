
import Flexbox from '@Stec/CommonComponents/Flexbox';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import Pagination from '@Stec/CommonComponents/Pagination';
import { newApiGet, newApiPost } from '@Stec/JS/api';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyDate, getUtcOffset } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import CommentsPreloader from './CommentsPreloader';

const CommentForm = ({ event, replyTo, onSubmit }) => {

    const blockActionRef = useRef(false);
    const comment = useRef('');

    const submitComment = async () => {

        if (comment.current === '') {
            toast.error(__('Comment is empty', 'stachethemes_event_calendar_lite'));
            return;
        }

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function createItem() {

                    try {

                        const result = await newApiPost({
                            route: 'COMMENTS',
                            data: {
                                parent: replyTo,
                                post: event.id,
                                content: comment.current
                            }
                        });

                        onSubmit();

                        return resolve(__('Comments updated', 'stachethemes_event_calendar_lite'));


                    } catch (e) {

                        return reject(__(`Sorry, something went wrong`, 'stachethemes_event_calendar_lite'));
                    }


                }

                createItem();

            }),
            {
                loading: __('Saving', 'stachethemes_event_calendar_lite'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return errorMessage;
                },
            }
        );

    }

    const placeholderText = replyTo === 0 ? __('Leave a comment', 'stachethemes_event_calendar_lite') : __('Reply to this comment', 'stachethemes_event_calendar_lite', 0);

    if (!STEC_VARIABLES?.current_user?.data?.id) {
        return null;
    }

    return <Flexbox className='stec-comment-form'>

        <img src={STEC_VARIABLES.current_user.data.avatar} alt={STEC_VARIABLES.current_user.data.name} />

        <UncontrolledInputText
            placeholder={placeholderText}
            defaultValue={comment.current}
            onChange={value => {
                comment.current = value;
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    submitComment();
                }
            }}
        />

        <i className='stec-comment-form-submit-button fa-solid fa-comment' onClick={submitComment} />

    </Flexbox>

}

const Comment = ({ replyTo, setReplyTo, theCommentForm, comment, event }) => {

    const showTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const dateFormat = useSettingsAtt('calendar__date_format');
    const timeFormat = useSettingsAtt('calendar__time_format');
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');
    const isActiveReply = replyTo === comment.id;
    const avatarURL = comment.author_avatar_urls['24'];

    const toggleReply = () => {

        if (isActiveReply) {
            setReplyTo(0);
        } else {
            setReplyTo(comment.id);
        }
    }

    const getCommentDate = () => {

        const commentDateInEventTimezone = moment.tz(comment.date_gmt, 'UTC');

        if (showInUserTimezone) {
            commentDateInEventTimezone.local();
        } else {
            commentDateInEventTimezone.tz(event.meta.timezone);
        }

        let submitDateString = beautifyDate(commentDateInEventTimezone, false, dateFormat, timeFormat);

        if (showTzOffset) {

            const displayedTimezone = getUtcOffset(commentDateInEventTimezone);
            
            submitDateString = `${submitDateString} (${displayedTimezone})`;
        }

        return submitDateString;

    }

    const commentDate = getCommentDate();

    return (

        <StecDiv className='stec-comment'>

            <Flexbox className='stec-comment-top'>

                <Flexbox>
                    <StecDiv className='stec-comment-avatar'>
                        <img src={avatarURL} alt={comment.author_name} />
                    </StecDiv>

                    <StecDiv className='stec-comment-author'>
                        {comment.author_name}
                    </StecDiv>

                    <StecDiv className='stec-comment-date'>
                        {commentDate}
                    </StecDiv>
                </Flexbox>

                {
                    STEC_VARIABLES?.current_user?.data?.id &&
                    <i className={`stec-comment-form-reply-button fa-solid fa-comment ${isActiveReply ? 'active' : ''}`}
                        onClick={toggleReply} />
                }

            </Flexbox>

            <StecDiv className='stec-comment-content' dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />


            {isActiveReply && theCommentForm}

        </StecDiv>

    )

}

const InternalCommentsRender = ({ event, style }) => {

    const [ready, setReady] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(0);
    const [commentFormId, setCommentFormId] = useState(0);

    useEffect(() => {

        let subscribed = true;
        const controller = new AbortController();

        const fetchComments = async () => {

            const result = await newApiGet({
                route: 'COMMENTS',
                args: `?post=${event.id}&per_page=5&page=${page}&orderby=date_gmt&order=desc`,
                abortController: controller,
                includeResponseHeaders: true
            });


            if (subscribed) {

                const pages = parseInt(result.headers.get('x-wp-totalpages'), 10);

                setPages(pages);
                setComments(result.data);
                setReady(true);
            }

        }

        if (false === ready) {
            fetchComments();
        }

        return () => {
            subscribed = false;
            controller.abort();
        }

    }, [event.id, page, ready]);

    const theCommentForm = <CommentForm
        key={commentFormId}
        replyTo={replyTo}
        event={event}
        onSubmit={() => {
            const d = new Date();
            setCommentFormId(d.getTime());
            setComments([]);
            setPage(1);
            setReplyTo(0);
            setReady(false);
        }} />;

    return (
        <StecDiv className='stec-event-comments' style={style}>

            {false === ready && <CommentsPreloader />}

            <StecDiv style={false === ready ? { display: 'none' } : {}}>

                {
                    comments.length <= 0 && <>
                        <StecDiv className='stec-event-comments-empty'>
                            <i className='stec-event-comments-empty-icon fa-solid fa-comments' />
                            <StecSpan className='stec-event-comments-empty-big'>{__('No Comments Yet', 'stachethemes_event_calendar_lite')}</StecSpan>
                            <StecSpan className='stec-event-comments-empty-small'>{__('Be the first to share what you think!', 'stachethemes_event_calendar_lite')}</StecSpan>
                            {!STEC_VARIABLES?.current_user?.data?.id && <StecSpan className='stec-event-comments-empty-small'>({__('You must log-in first', 'stachethemes_event_calendar_lite')})</StecSpan>}
                        </StecDiv>
                    </>
                }

                {
                    comments.length > 0 && <>

                        {
                            comments.map(comment => {

                                return <Comment
                                    key={comment.id}
                                    event={event}
                                    comment={comment}
                                    comments={comments}
                                    theCommentForm={theCommentForm}
                                    replyTo={replyTo}
                                    setReplyTo={setReplyTo}
                                />
                            })
                        }

                        <Pagination
                            prevLabel={__('Newer', 'stachethemes_event_calendar_lite')}
                            nextLabel={__('Older', 'stachethemes_event_calendar_lite')}
                            pages={pages}
                            currentPage={page}
                            onClick={page => {
                                setReady(false);
                                setPage(page);
                            }} />

                    </>
                }

                {0 === replyTo && theCommentForm}

            </StecDiv>

        </StecDiv>
    )

}

const InternalComments = ({ event, style, isBuilder }) => {

    if (isBuilder) {
        return (
            <StecDiv className='stec-event-comments' style={style}>

                <StecDiv>

                    <StecDiv className='stec-event-comments-empty'>
                        <i className='stec-event-comments-empty-icon fa-solid fa-comments' />
                        <StecSpan className='stec-event-comments-empty-big'>{__('No Comments Yet', 'stachethemes_event_calendar_lite')}</StecSpan>
                        <StecSpan className='stec-event-comments-empty-small'>{__('Be the first to share what you think!', 'stachethemes_event_calendar_lite')}</StecSpan>
                    </StecDiv>

                    <CommentForm />

                </StecDiv>

            </StecDiv>
        )
    }

    return <InternalCommentsRender event={event} style={style} />


}

export default InternalComments;