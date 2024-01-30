import Tag from '@Stec/CommonComponents/Tag';
import VerifiedBadgeTag from '@Stec/CommonComponents/VerifiedBadgeTag';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';
import { _x, __ } from '@wordpress/i18n';

const EventPersonSocial = ({ person }) => {

    if (!person.email && Array.isArray(person.social) === false) {
        return null;
    }

    return (
        <StecDiv className='stec-event-person-content-social'>

            {
                person.email && <a href={`mailto:${person.email}`}>
                    <i className='fa-solid fa-envelope' />
                </a>
            }

            {
                Array.isArray(person.social) && person.social.map((social, i) => {
                    return <a key={i} href={social.url}><i className={social.icon} /></a>
                })
            }

        </StecDiv>
    )

}

const EventPersonDescription = ({ person }) => {

    const descriptionRef = useRef();

    // Call "on description render" global trigger
    useEffect(() => {

        if (person?.description) {
            if (typeof window.stecOnEventPersonDescriptionRender === 'function') {
                window.stecOnEventPersonDescriptionRender({
                    data: person,
                    element: descriptionRef.current
                });
            }
        }

    }, [person]);

    if (!person.description) {
        return null;
    }

    return <StecDiv ref={descriptionRef} className='stec-event-person-content-about' dangerouslySetInnerHTML={{ __html: person.description }} />

}

const EventPerson = ({ person, tagLabel = false, tagBackgroundColor = '', verifiedTitle = _x('Verified', 'person', 'stec') }) => {

    const classNameArray = ['stec-event-person'];

    const hasImage = person?.photo?.sizes?.thumbnail;

    if (!hasImage) {
        classNameArray.push('no-image')
    }

    const isVerified = person?.verified;

    return (
        <StecDiv className={classNameArray.join(' ')}>

            {
                hasImage &&
                <StecDiv className='stec-event-person-image'>
                    {
                        person.permalink && <a href={person.permalink}>
                            <img src={person.photo.sizes.thumbnail} alt={person.title} />
                        </a>
                    }
                    {
                        !person.permalink && <img src={person.photo.sizes.thumbnail} alt={person.title} />
                    }
                </StecDiv>
            }

            <StecDiv className='stec-event-person-head'>

                {
                    tagLabel && <Tag backgroundColor={tagBackgroundColor} label={tagLabel} />
                }

                {
                    isVerified && <VerifiedBadgeTag title={verifiedTitle} />
                }

                <StecDiv className='stec-event-person-head-title'>
                    {person.permalink && <a href={person.permalink}>{person.title}</a>}
                    {!person.permalink && person.title}
                </StecDiv>

                {
                    person.subtitle &&
                    <StecDiv className='stec-event-person-head-subtitle'>{person.subtitle}</StecDiv>
                }

            </StecDiv>

            <StecDiv className='stec-event-person-content'>

                <EventPersonDescription person={person} />

                <EventPersonSocial person={person} />

                {person.afterContent && person.afterContent}

            </StecDiv>

        </StecDiv >
            )
}

            export default EventPerson