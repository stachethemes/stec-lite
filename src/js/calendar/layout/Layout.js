import { useCurrentLayout } from '@Stec/JS/calendar/hooks';
import LayoutSkeleton from '@Stec/JS/calendar/skeletons/LayoutSkeleton';
import { StecDiv } from '@Stec/WebComponents';
import { lazy, Suspense } from 'react';
const LayoutAgenda = lazy(() => import(/* webpackChunkName: "calendar/layout/agenda" */ '@Stec/JS/calendar/layout/agenda/LayoutAgenda'));
const LayoutMonth = lazy(() => import(/* webpackChunkName: "calendar/layout/month" */ '@Stec/JS/calendar/layout/month-and-week/LayoutMonth'));
const LayoutWeek = lazy(() => import(/* webpackChunkName: "calendar/layout/week" */ '@Stec/JS/calendar/layout/month-and-week/LayoutWeek'));
const LayoutDay = lazy(() => import(/* webpackChunkName: "calendar/layout/day" */ '@Stec/JS/calendar/layout/day/LayoutDay'));
const LayoutGrid = lazy(() => import(/* webpackChunkName: "calendar/layout/grid" */ '@Stec/JS/calendar/layout/grid/LayoutGrid'));
const LayoutBoxGrid = lazy(() => import(/* webpackChunkName: "calendar/layout/boxgrid" */ '@Stec/JS/calendar/layout/boxgrid/LayoutBoxGrid'));

const Layout = () => {

    const { value: activeLayout } = useCurrentLayout();

    let layoutCurrent = '';

    try {
        switch (activeLayout) {
            case 'agenda':
                layoutCurrent = <LayoutAgenda />
                break;
            case 'month':
                layoutCurrent = <LayoutMonth />;
                break;
            case 'week':
                layoutCurrent = <LayoutWeek />;
                break;
            case 'day':
                layoutCurrent = <LayoutDay />;
                break;
            case 'grid':
                layoutCurrent = <LayoutGrid />;
                break;
            case 'boxgrid':
                layoutCurrent = <LayoutBoxGrid />;
                break;
            default:
                return null; // layout not found return nothing
        }
    } catch (e) {
        layoutCurrent = null;
    }

    return (
        <StecDiv className='stec-layout'>
            <Suspense fallback={<LayoutSkeleton />}>
                {layoutCurrent}
            </Suspense>
        </StecDiv>
    )
}

export default Layout
