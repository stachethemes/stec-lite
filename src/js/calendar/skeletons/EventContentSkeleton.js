import ContentLoader from 'react-content-loader';
import { StecDiv } from '@Stec/WebComponents';

function EventContentSkeleton() {

    return (
        <StecDiv
            className='stec-skeleton no-delay'
            style={{
                position: 'relative',
                background: '#fff',
                padding: '20px',
                boxSizing: 'border-box',
                width: '100%'
            }}>

            <ContentLoader
                speed={2}
                width={'100%'}
                height={278}
                backgroundColor="#E3E3E3"
                foregroundColor="#ECEBEB"
                animate={true}
            >
                <rect x="0" y="0" rx="3" ry="3" width="100%" height="200" />
                <rect x="0" y="200" rx="3" ry="3" width="100%" height="12" />
                <rect x="0" y="222" rx="3" ry="3" width="100%" height="12" />
                <rect x="0" y="244" rx="3" ry="3" width="100%" height="12" />
                <rect x="0" y="266" rx="3" ry="3" width="100%" height="12" />


            </ContentLoader>

        </StecDiv>
    )
}

export default EventContentSkeleton