import { StecDiv } from '@Stec/WebComponents';
import ContentLoader from 'react-content-loader';

function GridEventSkeleton() {

    return (
        <StecDiv
            className='stec-skeleton'
            style={{
                position: 'relative',
                background: 'var(--stec-ec-bg)',
                borderRadius: 3,
                width: '100%',
            }}>

            <ContentLoader
                speed={2}
                width={'100%'}
                height={350}
                backgroundColor="#E3E3E3"
                foregroundColor="#ECEBEB"
                animate={true}
            >
                <rect x="0" y="0" rx="3" ry="3" width="100%" height="168" />
                <rect x="50%" y="208" rx="3" ry="3" width="100px" height="18" transform="translate(-50, 0)" />
                <rect x="5%" y="238" rx="3" ry="3" width="90%" height="14" />
                <rect x="5%" y="258" rx="3" ry="3" width="90%" height="14" />
                <rect x="5%" y="278" rx="3" ry="3" width="80%" height="14" />
            </ContentLoader>

            <StecDiv style={{
                position: 'absolute',
                left: 'calc(50% - 26px)',
                top: 138,
                width: 52,
                height: 52,
                borderRadius: 3,
                border: '2px solid #fff'
            }}>
                <ContentLoader
                    speed={1}
                    width={'100%'}
                    height={'100%'}
                    backgroundColor="#E3E3E3"
                    foregroundColor="#ECEBEB"
                    animate={true}
                >
                    <rect x="0" y="0" rx="03" ry="0" width="52" height="52" />
                </ContentLoader>

            </StecDiv>
        </StecDiv>
    )
}

export default GridEventSkeleton
