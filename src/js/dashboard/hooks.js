import { newApiGet, useApiGet } from '@Stec/JS/api';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { dashboardMenu } from './atoms';

export const useDashboardCounters = () => {

    let args = '';

    const { data, error, isLoading, ready } = useApiGet({
        route: 'DASHBOARD/COUNTERS',
        args: args,
        cacheKey: null
    });

    return { data, error, isLoading, ready }

}

export const useDashboardMenu = () => {

    const [activeMenu, setActiveMenuRecoil] = useRecoilState(dashboardMenu);

    const setActiveMenu = ({ page = '', params = {}, pushState = true }) => {

        const isBackEnd = document.getElementById('stec-admin-dashboard');

        if (isBackEnd && pushState) {

            const url = new URL(window.location.href);

            url.hash = page;
            
            window.history.pushState({
                page: page,
                params: JSON.stringify(params)
            }, url, url);

        }

        setActiveMenuRecoil({
            page: page,
            params: params
        });

    }

    let activeMenuPage = activeMenu.page;
    let activeMenuParams = activeMenu.params;

    if (activeMenu.page === '') {
        // get menu from url #
        const url = new URL(window.location.href);
        const page = url.hash.replace('#', '');

        if (page) {
            activeMenuPage = page;
            activeMenuParams = {};
        }

    }

    return { activeMenuPage: activeMenuPage, activeMenuParams: activeMenuParams, setActiveMenu };
}

export const useSearchEvents = ({
    input = '',
    args = ''
}) => {

    const [data, setData] = useState({
        items: [],
        error: false,
        status: 'idle'
    });

    const inputReactionDelay = 500;
    let timeout = useRef(null);

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;

        const queryApi = async () => {

            try {

                setData({
                    items: [],
                    error: false,
                    status: 'loading'
                });

                const items = await newApiGet({
                    route: 'EVENTS',
                    args: `?search=${input}&${args}`,
                    abortController: controller
                });

                setData({
                    items: items,
                    error: false,
                    status: 'ready'
                });

            } catch (e) {

                // catch error
                if (false === signal.aborted) {
                    setData({
                        items: [],
                        error: true,
                        status: 'ready'
                    });
                }
            }
        }

        if (input.length > 2) {

            timeout.current = setTimeout(() => {
                queryApi();
            }, inputReactionDelay);

        } else {

            setData({
                items: [],
                error: false,
                status: 'idle'
            });

        }

        return () => {
            controller.abort();
            clearTimeout(timeout.current);
        }

    }, [input, args]);

    return data;
}

export const useSettings = () => {

    const { data, ready, error } = useApiGet({
        route: 'SETTINGS',
        args: '',

    });

    return { settings: data, ready, error };

}

export const useUserData = (params) => {

    const { data, ready, error } = useApiGet({
        route: 'STEC-USERS',
        args: `?s=${params.s || ''}`,
        errorMessage: 'auto',
        cacheKey: `STEC-USERS-s-${params.s}`

    });

    return { data, ready, error };

}