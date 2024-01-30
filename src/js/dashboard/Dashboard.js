import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { useResponsiveClass } from '@Stec/JS/hooks.js';
import '@Stec/LESS/dashboard/style.less';
import { StecDiv } from '@Stec/WebComponents';
import React, { Suspense, useEffect, useRef } from "react";
import DashboardPreloader from "./DashboardPreloader";

// Home page
const Home = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/home/home" */ "./pages/home/Home"));

// Calendars pages
const CalendarsList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/calendars/list" */ "./pages/calendars/List"));
const CalendarsUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/calendars/upsert" */ "./pages/calendars/Upsert"));

// Categories pages
const CategoriesList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/categories/list" */ "./pages/categories/List"));
const CategoriesUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/categories/upsert" */ "./pages/categories/Upsert"));

// Organizers pages
const OrganizersList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/organizers/list" */ "./pages/organizers/List"));
const OrganizersUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/organizers/upsert" */ "./pages/organizers/Upsert"));

// Guests pages
const GuestsList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/guests/list" */ "./pages/guests/List"));
const GuestsUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/guests/upsert" */ "./pages/guests/Upsert"));

// Locations pages
const LocationsList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/locations/list" */ "./pages/locations/List"));
const LocationsUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/locations/upsert" */ "./pages/locations/Upsert"));

// Events pages
const EventsList = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/events/list" */ "./pages/events/List"));
const EventsUpsert = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/events/upsert" */ "./pages/events/upsert/Upsert"));
const EventsArchive = React.lazy(() => import(/* webpackChunkName: "dashboard/pages/events/archive" */ "./pages/events/ListArchive"));

// Settings page
const Settings = React.lazy(() => import(/* webpackChunkName: "dashboard/settings" */ "./pages/settings/Settings"));

/**
 * * Main Dashboard Components (after LazyDashboard.js)
 * * This is the very first component of the Dashboard that includes all sub-components
 */
function Dashboard() {

    const dashboardRef = useRef();
    const { activeMenuPage, setActiveMenu } = useDashboardMenu();

    let PageView = '';

    switch (activeMenuPage) {

        case 'settings':
            PageView = Settings;
            break;

        case 'calendars-list':
            PageView = CalendarsList;
            break;

        case 'calendars-upsert':
            PageView = CalendarsUpsert;
            break;

        case 'categories-list':
            PageView = CategoriesList;
            break;

        case 'categories-upsert':
            PageView = CategoriesUpsert;
            break;

        case 'organizers-list':
            PageView = OrganizersList;
            break;

        case 'organizers-upsert':
            PageView = OrganizersUpsert;
            break;

        case 'guests-list':
            PageView = GuestsList;
            break;

        case 'guests-upsert':
            PageView = GuestsUpsert;
            break;

        case 'locations-list':
            PageView = LocationsList;
            break;

        case 'locations-upsert':
            PageView = LocationsUpsert;
            break;

        case 'events-list':
            PageView = EventsList;
            break;

        case 'events-upsert':
            PageView = EventsUpsert;
            break;

        case 'events-archive':
            PageView = EventsArchive;
            break;

        case 'home':
        default:
            PageView = Home;
            break;

    }

    useResponsiveClass(dashboardRef);

    // WP Dashboard side menu handler
    useEffect(() => {

        const $dashboard = document.getElementById('toplevel_page_stec_lite');

        if (!$dashboard) {
            return;
        }

        const $submenu = $dashboard.querySelector('.wp-submenu');
        const $submenuItems = $submenu.querySelectorAll('li');

        const onSubmenuClick = (e) => {

            if (e.target.id === 'stec-upgrade-menu-item') {
                return;
            }

            e.preventDefault();

            try {

                const href = e.target.href;
                const hrefHash = href.split('#')[1];

                setActiveMenu({
                    page: hrefHash,
                    params: {}
                });

            } catch (e) {

                setActiveMenu({
                    page: 'home',
                    params: {}
                });
            }
        }

        $submenu.addEventListener('click', onSubmenuClick);

        $submenuItems.forEach($submenuItem => {
            $submenuItem.classList.remove('current');
        });

        let hash = '';

        switch (activeMenuPage) {

            case 'settings': {
                hash = 'settings';
                break;
            }


            case 'calendars-list':
            case 'calendars-upsert': {
                hash = 'calendars-list';
                break;
            }
            case 'categories-list':
            case 'categories-upsert': {
                hash = 'categories-list';
                break;
            }

            case 'organizers-list':
            case 'organizers-upsert': {
                hash = 'organizers-list';
                break;
            }

            case 'guests-list':
            case 'guests-upsert': {
                hash = 'guests-list';
                break;
            }

            case 'locations-list':
            case 'locations-upsert': {
                hash = 'locations-list';
                break;
            }

            case 'events-list':
            case 'events-upsert':
            case 'events-archive': {
                hash = 'events-list';
                break;
            }

            case 'home':
            default:
                hash = '';
                break;

        }

        if (hash) {

            const $item = [...$submenuItems].find(item => {

                const itemA = item.querySelector('a');

                if (itemA) {
                    return itemA.href.indexOf('#' + hash) !== -1;
                }

                return false;

            });

            if ($item) {
                $item.classList.add('current');
            }

        } else {

            $submenu.querySelector('.wp-first-item').classList.add('current');
        }

        return () => {
            $submenu.removeEventListener('click', onSubmenuClick)
        }

    }, [activeMenuPage, setActiveMenu]);

    // Listen to popstate in back-end only
    useEffect(() => {

        if (!document.getElementById('stec-admin-dashboard')) {
            return;
        }

        const onPopState = (e) => {
            if (e.state && e.state.page) {
                setActiveMenu({
                    page: e.state.page,
                    params: JSON.parse(e.state.params),
                    pushState: false // prevent pushState
                });
            }
        }

        window.addEventListener('popstate', onPopState);

        return () => {
            window.removeEventListener('popstate', onPopState);
        }

    }, [setActiveMenu]);

    return (
        <StecDiv className={`stec-dashboard`} ref={dashboardRef}>
            <Suspense fallback={<DashboardPreloader />}>
                <PageView />
            </Suspense>
        </StecDiv>
    )
}

export default Dashboard