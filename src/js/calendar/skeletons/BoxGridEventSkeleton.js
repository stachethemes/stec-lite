import { StecDiv } from '@Stec/WebComponents';
import ContentLoader from 'react-content-loader';

function BoxGridEventSkeleton() {

    return (
        <StecDiv
            className='stec-skeleton'
            style={{
                position: 'relative',
                background: 'var(--stec-ec-bg)',
                borderRadius: 0,
                width: '100%',
            }}>

            <ContentLoader
                speed={2}
                width={'100%'}
                height={350}
                backgroundColor="#E3E3E3"
                foregroundColor="#ECEBEB"
                animate={true}>

                <rect x="10px" y="10px" rx="3" ry="3" width="60px" height="14" />
                <rect x="10px" y="30px" rx="3" ry="3" width="200px" height="14" />

                <rect x="115px" y="100%" rx="3" ry="3" width="100px" height="14" transform="translate(0, -112)" />
                <rect x="10px" y="100%" rx="3" ry="3" width="100px" height="14" transform="translate(0, -112)" />
                <rect x="10px" y="100%" rx="3" ry="3" width="50%" height="28" transform="translate(0, -85)" />
                <rect x="10px" y="100%" rx="3" ry="3" width="70%" height="14" transform="translate(0, -44)" />
                <rect x="10px" y="100%" rx="3" ry="3" width="90%" height="14" transform="translate(0, -24)" />
            </ContentLoader>

        </StecDiv>
    )
}

export default BoxGridEventSkeleton
