import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { calculateMasonryColumns } from '@Stec/JS/helpers';
import { useElementWidth } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useRef } from 'react';

const LayoutGridOuter = ({ Component }) => {

    const containerRef = useRef(null);
    const containerWidth = useElementWidth(containerRef);
    const hasWidth = containerWidth !== 'init';

    const gutter = useSettingsAtt('layouts__grid_gutter');
    const minWidth = useSettingsAtt('layouts__grid_breakpoint');
    const columnsCount = useSettingsAtt('layouts__grid_columns');

    const displayColumns = hasWidth ? calculateMasonryColumns({
        gridContainerWidth: containerWidth,
        columnsCount,
        minWidth,
        gutter
    }) : columnsCount;

    return (
        <StecDiv ref={containerRef} className='stec-layout-grid-outer' style={{
            minHeight: hasWidth ? 0 : 350
        }}>

            {hasWidth && <Component columns={displayColumns} />}

        </StecDiv>
    )
}

export default LayoutGridOuter