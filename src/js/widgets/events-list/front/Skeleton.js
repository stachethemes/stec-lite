import { StecDiv } from '@Stec/WebComponents';
import ContentLoader from 'react-content-loader';

function Skeleton({ quantity }) {

    const content = [];

    while (quantity > 0) {

        content.push(
            <StecDiv
                key={quantity}
                className='stec-skeleton'>

                <ContentLoader
                    speed={2}
                    width={'100%'}
                    height={76}
                    backgroundColor="#E3E3E3"
                    foregroundColor="#ECEBEB"
                    animate={true}>
                    <rect x="10" y="10" rx="3" ry="3" width="34" height="34" />
                    <rect x="52" y="16" rx="3" ry="3" width="40%" height="8" />
                    <rect x="52" y="32" rx="3" ry="3" width="40%" height="8" />
                    <rect x="10" y="50" rx="3" ry="3" width="90%" height="8" />
                    <rect x="10" y="65" rx="3" ry="3" width="90%" height="8" />

                </ContentLoader>
            </StecDiv>

        );

        quantity--;
    }

    return (
        <StecDiv className='stec-widget-events-list-skeleton'>
            {content}
        </StecDiv>
    )
}

export default Skeleton

