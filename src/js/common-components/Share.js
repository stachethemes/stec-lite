import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-hot-toast';

const Share = ({ link, allowedItems = [], hrefTarget = '_SELF', context = 'view', eventData = false }) => {

    const socialLinks = [
        {
            id: 'facebook',
            className: 'stec-share-facebook-color',
            icon: 'fab fa-facebook',
            url: `//www.facebook.com/share.php?u={link}`
        },
        {
            id: 'x',
            className: 'stec-share-twitter-color',
            icon: 'fab fa-x-twitter',
            url: `//twitter.com/intent/tweet?text={link}`
        },
        {
            id: 'whatsapp',
            className: 'stec-share-whatsapp-color',
            icon: 'fab fa-whatsapp',
            url: `//api.whatsapp.com/send?text={link}`
        },
        {
            id: 'messenger',
            className: 'stec-share-messenger-color',
            icon: 'fab fa-facebook-messenger',
            url: `//www.facebook.com/dialog/send?display=popup&amp;app_id=2059281850851840&amp;link={link}&amp;redirect_uri={link}`
        },
        {
            id: 'viber',
            className: 'stec-share-viber-color',
            icon: 'fab fa-viber',
            url: `viber://forward?text={link}`
        },
        {
            id: 'telegram',
            className: 'stec-share-telegram-color',
            icon: 'fab fa-telegram',
            url: `https://t.me/share/url?url={link}`
        }
    ];

    let shareLinks = [
        ...socialLinks.map(socialLink => {
            return {
                ...socialLink,
                url: socialLink.url.replaceAll('{link}', link)
            }
        }),
        {
            id: 'copylink',
            className: 'stec-share-copylink-color',
            icon: 'fa-solid fa-link',
            url: `${link}`,
            onClick: (e) => {

                try {
                    e.preventDefault();
                    navigator.clipboard.writeText(link);
                    toast.success(__('Link copied to clipboard', 'stachethemes_event_calendar_lite'));
                } catch (e) {
                    toast.error(__('Unable to copy link to clipboard', 'stachethemes_event_calendar_lite'));
                }

            }
        }
    ].filter(item => allowedItems.includes(item.id));

    if (typeof window.stecFilterShareLinks !== 'undefined') {
        shareLinks = window.stecFilterShareLinks(shareLinks);
    }

    return (
        <StecDiv className='stec-share'>
            {shareLinks.map(item => {

                try {

                    if (context === 'editor') {
                        return <a
                            key={item.id}
                            style={{ cursor: 'pointer' }}
                            className={item.className}>
                            <i className={item.icon} />
                        </a>
                    }

                    return <a
                        key={item.id}
                        target={hrefTarget}
                        onClick={item.onClick}
                        className={item.className}
                        href={item.url}>
                        <i className={item.icon} />
                    </a>
                } catch (e) {
                    // Silently fail                     
                    return '';
                }
            })}
        </StecDiv>
    )
}

export default Share
