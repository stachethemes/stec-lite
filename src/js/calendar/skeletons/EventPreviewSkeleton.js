import { StecDiv } from '@Stec/WebComponents';
import ContentLoader from 'react-content-loader';

function EventPreviewSkeleton() {

    return (
        <StecDiv
            className='stec-skeleton'
            style={{
                position: 'relative',
                background: '#fff',
                width: '100%',
            }}>

            <ContentLoader
                speed={2}
                width={'100%'}
                height={94}
                backgroundColor="#E3E3E3"
                foregroundColor="#ECEBEB"
                animate={true}
            >
                <rect x="10" y="10" rx="3" ry="3" width="52" height="52" />
                <rect x="72" y="10" rx="3" ry="3" width="40%" height="12" />
                <rect x="72" y="30" rx="3" ry="3" width="70%" height="12" />
                <rect x="72" y="50" rx="3" ry="3" width="70%" height="12" />
                <rect x="72" y="70" rx="3" ry="3" width="70%" height="12" />

            </ContentLoader>

        </StecDiv>
    )
}

export default EventPreviewSkeleton
