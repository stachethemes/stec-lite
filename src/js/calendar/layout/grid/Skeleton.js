import GridEventSkeleton from '@Stec/JS/calendar/skeletons/GridEventSkeleton';
import { StecDiv } from '@Stec/WebComponents';

import React from 'react';

const Skeleton = ({ columns, gutter }) => {

    const skeletons = [];

    for (let i = 0; i < columns; i++) {
        skeletons.push(<GridEventSkeleton key={i} />);
    }

    return (
        <StecDiv style={{
            width: '100%',
            display: 'grid',
            gap: gutter,
            gridTemplateColumns: `repeat(${columns}, 1fr)`
        }}>
            {skeletons}
        </StecDiv>
    )
}

export default Skeleton