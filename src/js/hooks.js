import { newApiGet, useApiGet } from '@Stec/JS/api.js';
import { getMediaSizes } from '@Stec/JS/helpers';
import { getWorkerEventsBetween } from '@Stec/JS/workers/WorkerTask';
import { useCallback, useEffect, useState } from 'react';

export const useResponsiveClass = (ref) => {

    useEffect(() => {

        const container = ref.current;
        let t;

        const setScreenType = (containerWidth) => {

            clearTimeout(t);

            t = setTimeout(() => {

                let className = '';

                const { mobile: mobileSize, tablet: tabletSize } = getMediaSizes();

                if (containerWidth < mobileSize) {
                    className = 'mobile';
                } else if (containerWidth < tabletSize) {
                    className = 'tablet'
                }

                container.classList.remove('tablet', 'mobile');

                if (className) {
                    container.classList.add(className);
                }

            }, 100);

        }

        const observer = new ResizeObserver(entries => {

            if (entries[0] && entries[0].contentRect) {
                const containerWidth = entries[0].contentRect.width;
                setScreenType(containerWidth);
            }

        });

        if (container) {
            observer.observe(container);
        }

        return () => {

            clearTimeout(t);

            if (container) {
                observer.unobserve(container);
            }
        }

    }, [ref]);

};

export const useOutsideHandler = (ref, action) => {

    const handleClickOutside = useCallback(event => {

        if (ref.current && !ref.current.contains(event.target)) {
            if (typeof action === 'function') {
                action(event);
            }
        }

    }, [ref, action]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
};

/**
 * Hook for quering taxonomy terms
 * does not use cache
 */
export const useTaxonomyItems = (props) => {

    let fetchURL = false;

    switch (props.taxonomy) {
        case 'stec_cal': {
            fetchURL = 'CALENDARS';
            break;
        }

        case 'stec_cat': {
            fetchURL = 'CATEGORIES';
            break;
        }

        case 'stec_loc': {
            fetchURL = 'LOCATIONS';
            break;
        }

        case 'stec_org': {
            fetchURL = 'ORGANIZERS';
            break;
        }

        case 'stec_gst': {
            fetchURL = 'GUESTS';
            break;
        }

        default: {
            fetchURL = false;
        }
    }

    const { data, ready, headers, error } = useApiGet({
        route: fetchURL,
        args: `?search=${props.search || ''}&page=${props.page}&permission_type=${props.permissionType}&per_page=${props.perPage}`,
        includeResponseHeaders: true,
        cacheKey: false,
        seed: props.seed || 0 // seed is used to force refresh
    });

    let items = [];
    let totalPages = 0;

    if (ready && data && !error) {
        totalPages = parseInt(headers.get('x-wp-totalpages'), 10);
        items = data;
    }

    return {
        items,
        totalPages,
        ready,
        error
    };

}

/**
 * Hook for quering all taxonomy terms
 * uses Cache
 */
export const useTaxonomyItemsAll = (props) => {

    let initialState = {
        items: [],
        totalPages: 0,
        ready: false,
        error: false
    };

    const [data, setData] = useState(initialState);

    useEffect(() => {

        let mounted = true;
        const controller = new AbortController();
        let fetchURL = false;

        switch (props.taxonomy) {
            case 'stec_cal': {
                fetchURL = 'CALENDARS';
                break;
            }

            case 'stec_cat': {
                fetchURL = 'CATEGORIES';
                break;
            }

            case 'stec_loc': {
                fetchURL = 'LOCATIONS';
                break;
            }

            case 'stec_org': {
                fetchURL = 'ORGANIZERS';
                break;
            }

            case 'stec_gst': {
                fetchURL = 'GUESTS';
                break;
            }

            default: {
                fetchURL = false;
            }
        }

        const fetchStep = async (page = 1, current = []) => {

            if (false === mounted) {
                return;
            }

            const argsString = `?page=${page}&permission_type=${props.permissionType}&per_page=${props.perPage}`;

            const cacheGroup = `taxonomy-${props.taxonomy}`;

            const cacheKey = JSON.stringify({
                route: fetchURL,
                args: argsString,
            });

            const result = await newApiGet({
                route: fetchURL,
                args: argsString,
                abortController: controller,
                cacheGroup: cacheGroup,
                cacheKey: cacheKey,
                includeResponseHeaders: true,
                seed: props.seed || 0 // seed is used to force refresh
            });

            const pages = parseInt(result.headers.get('x-wp-totalpages'), 10);
            const items = result.data;

            current = [...current, ...items];

            if (pages > page) {
                return await fetchStep(page + 1, current);
            }

            result.data = current;

            return result;
        }

        const fetch = async () => {

            try {

                const result = await fetchStep();
                const pages = parseInt(result.headers.get('x-wp-totalpages'), 10);
                const items = result.data;

                const stateData = {
                    items: items,
                    totalPages: pages,
                    ready: true,
                    error: false
                }

                setData(stateData);

            } catch (e) {

                if (controller.signal.aborted || false === mounted) {
                    return;
                }

                setData({
                    items: [],
                    totalPages: 0,
                    ready: true,
                    error: true
                });
            }

        }

        fetch();

        return () => {

            mounted = false;

            setData({
                items: [],
                totalPages: 0,
                ready: false,
                error: false
            });

            controller.abort();
        }

    }, [props.perPage, props.permissionType, props.seed, props.taxonomy]);

    return data;

}

/**
 * Hook for quering posts
 * does not use cache
 */
export const usePostItems = (props) => {

    let fetchURL = false;

    switch (props.postType) {

        case 'stec_event': {
            fetchURL = 'EVENTS';
            break;
        }

        default: {
            fetchURL = false;
        }
    }

    let context = 'view';

    if (props.permissionType === 'edit_permission') {
        context = 'edit';
    }

    const fetchArgs = [
        `page=${props.page}`,
        `context=${context}`,
        `permission_type=${props.permissionType || 'read_permission'}`,
        `per_page=${props.perPage}`,
    ];

    const filterArgs = {
        search: props.search,
        calendar: props.calendar,
        category: props.category,
        guest: props.guest,
        organizer: props.organizer,
        location: props.location,
        min_date: props.min_date,
        max_date: props.max_date,

        status: props.status
    }

    Object.entries(filterArgs).forEach(pairs => {
        const [key, value] = pairs;
        if (value) {
            fetchArgs.push(`${key}=${value}`);
        }
    });

    const { data, ready, error, headers } = useApiGet({
        route: fetchURL,
        args: `?${fetchArgs.join('&')}`,
        includeResponseHeaders: true,
        cacheKey: false,
        seed: props.seed || 0 // seed is used to force refresh
    });

    let items = [];
    let totalPages = 0;

    if (ready && data && !error) {
        totalPages = parseInt(headers.get('x-wp-totalpages'), 10);
        items = data;
    }

    return {
        items,
        totalPages,
        ready,
        error
    }

}

/**
 * Hook for quering all posts
 * does not use cache
 * generally used to retrieve the events
 */
export const usePostItemsAll = (props) => {

    const [data, setData] = useState({
        items: [],
        ready: false,
        error: false,
    });

    const deps = JSON.stringify(props);

    useEffect(() => {

        let mounted = true;
        const controller = new AbortController();
        let fetchURL = false;

        switch (props.post_type) {

            case 'stec_event': {
                fetchURL = 'EVENTS';
                break;
            }

            default: {
                fetchURL = false;
            }
        }

        const fetchStep = async (page = 1, current = []) => {

            if (false === mounted) {
                return;
            }

            let context = props.context || 'view';

            if (props.permissionType === 'edit_permission') {
                context = 'edit';
            }

            const fetchArgs = [
                `page=${page}`,
                `context=${context}`,
                `permission_type=${props.permissionType || 'read_permission'}`,
                `per_page=${props.perPage}`,
                `calendar=${props.calendar}`,
                `category=${props.category}`,
                `guest=${props.guest}`,
                `organizer=${props.organizer}`,
                `location=${props.location}`,
                `min_date=${props.minDate}`,
                `max_date=${props.maxDate}`,
                `minmax_intersect=${props.minMaxIntersect}`,
                `featured=${props.featured}`,
                `read_permission=${props.readPermission}`,
                `author=${props.author}`,
                `status=${props.status}`,
                `event_status=${props.eventStatus}`,
                `include=${props.include}`,
                `template_type=${props.templateType}`,
            ].filter(arg => {
                const value = arg.split('=')[1];
                return value !== undefined && value !== 'undefined' && value !== '';
            });

            const result = await newApiGet({
                route: fetchURL,
                args: `?${fetchArgs.join('&')}`,
                abortController: controller,
                includeResponseHeaders: true,
                seed: props.seed || 0 // seed is used to force refresh
            })

            const pages = parseInt(result.headers.get('x-wp-totalpages'), 10);

            const items = result.data;

            current = [...current, ...items];

            if (pages > page) {
                return await fetchStep(page + 1, current);
            }

            return current;

        }

        const fetch = async () => {

            try {

                const result = await fetchStep();
                const items = result;

                if (mounted) {
                    setData({
                        items: items,
                        ready: true,
                        error: false
                    });
                }

            } catch (e) {

                if (mounted) {
                    setData({
                        items: [],
                        ready: true,
                        error: true
                    });
                }
            }
        }

        fetch();

        return () => {

            mounted = false;

            setData({
                items: [],
                ready: false,
                error: false
            });

            controller.abort();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deps]);

    return data;

}

/**
 * Permissions list
 */
export const usePermissions = () => {

    const { data, ready, error } = useApiGet({
        route: 'PERMISSIONS',
        cacheKey: 'usePermissions'
    });

    return { items: data, ready, error };

};


/**
 * Users list
 */
export const useUsers = () => {

    let initialState = {
        ready: false,
        error: false,
        items: []
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {

        let mounted = true;

        const controller = new AbortController();

        const fetchStep = async (page = 1, current = []) => {

            const cacheKey = JSON.stringify({
                route: 'USERS',
                args: `?page=${page}`
            });

            const fetchUsers = await newApiGet({
                route: 'USERS',
                args: `?page=${page}`,
                cacheKey: cacheKey,
                abortController: controller,
                includeResponseHeaders: true,
            });

            const pages = parseInt(fetchUsers.headers.get('x-wp-totalpages'), 10);
            const users = fetchUsers.data;

            current = [...current, ...users];

            if (pages > page) {
                return await fetchStep(page + 1, current);
            }

            return current;
        }

        const fetch = async () => {

            try {

                const fetchedUsers = await fetchStep();

                const stateData = {
                    items: fetchedUsers,
                    ready: true
                };

                if (mounted) {
                    setState(stateData);
                }

            } catch (e) {

                if (controller.signal.aborted || false === mounted) {
                    return;
                }

                setState({
                    items: [],
                    ready: true,
                    error: true
                });
            }

        }

        if (false === state.ready) {
            fetch();
        }

        return () => {
            controller.abort();
        }

    }, [setState, state.ready]);

    return state;

}

export const useEventById = ({
    id,
    permissionType = 'read_permission',
    offsetDate = false
}) => {

    const [data, setData] = useState({
        item: [],
        ready: false,
        error: false,
    });

    useEffect(() => {

        let mounted = true;
        const controller = new AbortController();

        const fetch = async () => {

            try {

                let context = 'event';

                if (permissionType === 'edit_permission') {
                    context = 'edit';
                }

                const result = await newApiGet({
                    route: 'EVENTS',
                    args: `${id}?context=${context}&permission_type=${permissionType}&start_date=${offsetDate || ''}`,
                    abortController: controller
                });

                if (!mounted) {
                    return;
                }

                let event;

                if (offsetDate && offsetDate !== result.meta.start_date) {

                    const eventDate = moment.tz(offsetDate, result.meta.timezone);

                    const events = await getWorkerEventsBetween({
                        startRange: moment(eventDate).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                        endRange: moment(eventDate).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                        minDate: moment(eventDate).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                        limit: 1,
                        filters: {},
                        threadIndex: `SINGLE_PAGE_EVENT_RECURRENCE`,
                        events: [result]
                    });

                    if (Array.isArray(events) && events.length > 0) {
                        event = events[0];
                    } else {
                        throw 'occurrence_not_found';
                    }

                } else {

                    event = result;
                }

                if (mounted) {
                    setData({
                        item: event,
                        ready: true,
                        error: false
                    });
                }

            } catch (e) {

                if (mounted) {
                    setData({
                        item: [],
                        ready: true,
                        error: true
                    });
                }

            }

        }

        fetch();

        return () => {
            mounted = false;
            controller.abort();
        }

    }, [id, permissionType, offsetDate]);

    return data;

}

/**
 *  This component will render its children only
 *  if the permissions are not enforced
 * @param {Object} props
 * @param {String} props.type The permission type to check expects 'read_permission', 'use_permission', 'edit_permission'
 * @param {React.ReactNode} props.children
 */
export const WithMaybeDisplayPermissions = ({ children, type = '' }) => {

    let display = false;

    switch (type) {
        case 'read_permission': {
            display = !STEC_VARIABLES?.enforce_private_front;
            break;
        }

        case 'use_permission':
        case 'edit_permission': {
            display = !STEC_VARIABLES?.enforce_private_admin;
            break;
        }

        default: {
            display = false;
        }
    }

    if (false === display) {
        return null;
    }

    return children;

}