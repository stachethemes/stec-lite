import { StecDiv } from '@Stec/WebComponents';
import ContentLoader from 'react-content-loader';

function LayoutSkeleton() {
    return (
        <StecDiv
            className='stec-skeleton'
            style={{
                position: 'relative',
                width: '100%',
            }}>

            <ContentLoader
                speed={1}
                width={'100%'}
                height={94}
                backgroundColor="var(--stec-ec-bg)"
                foregroundColor="#ff5f5f"
                animate={true}
            >
                <rect x="0" y="10" rx="3" ry="3" width="100%" height="2" />

            </ContentLoader>

        </StecDiv>
    )
}

export default LayoutSkeleton