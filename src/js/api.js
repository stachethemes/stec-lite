import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';

/**
 * Returns the REST URL for the given endpoint name.
 * @param {string} URL - The endpoint name.
 * @returns {string} - The REST URL for the given endpoint name.
 */
export const testFetchUrl = (URL) => {

    const wpNamespace = STEC_VARIABLES.rest_url + 'wp/v2';
    const stecNamespace = STEC_VARIABLES.rest_url + 'stec/v5';

    switch (URL) {

        case 'COMMENTS':
            return `${wpNamespace}/comments`;

        case 'USERS':
            return `${wpNamespace}/users`;

        case 'STEC-USERS':
            return `${stecNamespace}/users`;

        case 'SETTINGS':
            return `${stecNamespace}/settings`;

        case 'PERMISSIONS':
            return `${stecNamespace}/permissions`;

        case 'CALENDARS':
            return `${stecNamespace}/calendars`;

        case 'CATEGORIES':
            return `${stecNamespace}/categories`;

        case 'ORGANIZERS':
            return `${stecNamespace}/organizers`;

        case 'GUESTS':
            return `${stecNamespace}/guests`;

        case 'LOCATIONS':
            return `${stecNamespace}/locations`;

        case 'EVENTS':
            return `${stecNamespace}/events`;

        case 'EVENTS/ARCHIVE':
            return `${stecNamespace}/events/archive`;

        case 'EVENTS/UNARCHIVE':
            return `${stecNamespace}/events/unarchive`;

        case 'EVENTS/EMPTY-ARCHIVE':
            return `${stecNamespace}/events/empty-archive`;

        case 'DELETE-FROM-CALENDAR':
            return `${stecNamespace}/delete-from-calendar`;

        case 'DASHBOARD/COUNTERS':
            return `${stecNamespace}/dashboard-counters`

        case 'UPLOAD-IMAGES':
            return `${stecNamespace}/upload-images`

        default:
            return URL;
    }
}

/**
 * The master cache object
 */
const STEC_CACHE = {};

/**
 * Removes one or more entries from the STEC_CACHE object, which caches API responses.
 *
 * @param {Object} options - An object containing the following properties:
 *   - group (string, optional): The group of cached data to remove.
 *   - key (string, optional): The key of cached data to remove.
 */
export const flushApiCache = ({ group = false, key = false } = {}) => {

    if (group) {
        if (key) {
            // Delete STEC_CACHE[group][key] if it exists
            if (STEC_CACHE[group] && STEC_CACHE[group][key]) {
                delete STEC_CACHE[group][key];
            }
        } else {
            // Delete STEC_CACHE[group] if it exists
            if (STEC_CACHE[group]) {
                delete STEC_CACHE[group];
            }
        }
    } else if (key) {
        // Delete STEC_CACHE[key] if it exists
        if (STEC_CACHE[key]) {
            delete STEC_CACHE[key];
        }
    } else {
        // Delete all keys from STEC_CACHE
        Object.keys(STEC_CACHE).forEach(key => delete STEC_CACHE[key]);
    }
}

/**
 * A React hook for fetching data from an API endpoint.
 * 
 * @param {Object} props - An object containing the following properties:
 *  - route string): The API route to fetch data from.
 * - args (Object, optional): The arguments to pass to the API endpoint.
 * - cacheGroup (string, optional): The group of cached data to use.
 * - cacheKey (string, optional): The key of cached data to use.
 * - errorMessage (string, optional): The error message to display if the API request fails.
 * - waitExec (boolean, optional): Whether to wait for the API request to finish before returning the data.
 * - includeResponseHeaders (boolean, optional): Whether to include the response headers in the returned data.
 * - includeResponseStatus (boolean, optional): Whether to include the response status in the returned data.
 * - headers (Object, optional): The headers to pass to the API endpoint.
 * 
 * @returns {Object} An object containing the following properties:
 * - data (Object): The data returned from the API endpoint.
 * - error (Object): The error returned from the API endpoint.
 * - isLoading (boolean): Whether the API request is still loading.
 * - setData (function): A function to set the data returned from the API endpoint.
 * - setError (function): A function to set the error returned from the API endpoint.
 * - setIsLoading (function): A function to set whether the API request is still loading.
 * - deps (string): A stringified version of the props object.
 */

export const useApiGet = (props) => {

    const {
        route,
        args,
        cacheGroup,
        cacheKey,
        errorMessage = __('An error occurred while fetching the data.', 'stec'),
        waitExec = false,
        includeResponseHeaders = false,
        includeResponseStatus = false,
        headers = {
            'Content-Type': 'application/json',
            'X-WP-Nonce': STEC_VARIABLES.api_nonce
        },
    } = props;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const deps = JSON.stringify(props);

    useEffect(() => {

        let isMounted = true;
        const abortController = new AbortController();

        const fetchData = async () => {

            setIsLoading(true); // @since 5.1.0

            let cacheValue = false;

            if (cacheKey) {
                cacheValue = cacheGroup ? STEC_CACHE[cacheGroup]?.[cacheKey] : STEC_CACHE[cacheKey];
            }

            if (cacheValue) {

                setData(cacheValue);
                setIsLoading(false);
                setError(false);

            } else {

                try {

                    const result = await newApiGet({
                        route,
                        args,
                        abortController,
                        includeResponseHeaders,
                        includeResponseStatus,
                        cacheGroup,
                        cacheKey,
                        headers,
                        errorMessage
                    });

                    if (isMounted) {

                        setData(result);
                        setIsLoading(false);
                        setError(false);

                        if (cacheKey) {
                            const cache = cacheGroup ? STEC_CACHE[cacheGroup] : STEC_CACHE;
                            cache[cacheKey] = result;
                        }

                    }

                } catch (error) {

                    if (isMounted && !abortController.signal.aborted) {

                        let theErrorMessage = errorMessage;

                        if ('auto' === errorMessage) {

                            if (error.message && typeof error.message === 'string') {
                                theErrorMessage = error.message;
                            }
                        }

                        setError(theErrorMessage);
                    }

                } finally {
                    setIsLoading(false);
                }
            }


        };

        if (!waitExec) {
            fetchData();
        }

        return () => {
            isMounted = false;
            abortController.abort(); // abort the fetch request
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deps]);

    let ready = false;

    if (!isLoading && (data || error)) {
        ready = true;
    }

    let returnData = false;
    let responseHeaders = false;
    let responseStatus = '';

    if (ready && data) {

        if (includeResponseHeaders) {
            responseHeaders = data.headers;
        }

        if (includeResponseStatus) {
            responseStatus = data.status;
        }

        returnData = includeResponseHeaders || includeResponseStatus ? data.data : data;
    }

    return { data: returnData, headers: responseHeaders, status: responseStatus, error, isLoading, ready };
};

/**
 * Calls the WordPress REST API with a GET request.
 * 
 * @param {Object} props - An object containing the following properties:
 * - route (string): The API route to fetch data from.
 * - args (Object, optional): The arguments to pass to the API endpoint.
 * - abortController (Object, optional): The AbortController object to use.
 * - cacheGroup (string, optional): The group of cached data to use.
 * - cacheKey (string, optional): The key of cached data to use.
 * - includeResponseHeaders (boolean, optional): Whether to include the response headers in the returned data.
 * - includeResponseStatus (boolean, optional): Whether to include the response status in the returned data.
 * - headers (Object, optional): The headers to pass to the API endpoint.
 * - translateErrorCode (boolean, optional): Whether to translate the error code to a human-readable message.
 * @returns {Object} The data returned from the API endpoint.
 * @throws {Error} An error if the API request fails.
 */
export const newApiGet = ({
    route,
    args,
    abortController,
    cacheGroup,
    cacheKey,
    includeResponseHeaders = false,
    includeResponseStatus = false,
    headers = {
        'Content-Type': 'application/json',
        'X-WP-Nonce': STEC_VARIABLES.api_nonce
    },
    translateErrorCode = false,
    errorMessage = __('Sorry, something went wrong', 'stec'),
    expectType = 'json'
}) => {

    let fetchUrl = testFetchUrl(route);

    if (args) {
        fetchUrl += `/${args.toString()}`;
    }

    const fetchData = async () => {

        const timeoutDelay = window.stecFilterApiTimeoutDelay || 30000; // 30 seconds

        const fetchOptions = {
            method: 'GET',
            headers,
        }

        if (!abortController) {
            abortController = new AbortController();
        }

        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, timeoutDelay);

        fetchOptions.signal = abortController.signal;

        let cacheValue = false;

        if (cacheKey) {
            cacheValue = cacheGroup ? STEC_CACHE[cacheGroup]?.[cacheKey] : STEC_CACHE[cacheKey];
        }

        if (cacheValue) {

            return cacheValue;

        } else {

            try {
                const response = await fetch(fetchUrl, fetchOptions);

                let result;

                switch (expectType) {
                    case 'json':
                        result = await response.json();
                        break;
                    case 'text':
                        result = await response.text();
                        break;
                    default:
                        result = await response.json();
                }

                if (!response.ok) {

                    if (translateErrorCode && translateErrorCode[result.code]) {
                        errorMessage = translateErrorCode[result.code];
                    } else if (errorMessage === 'auto' && result && result.message) {
                        errorMessage = result.message;
                    } else {
                        errorMessage = errorMessage || __('Sorry, something went wrong', 'stec');
                    }

                    throw new Error(errorMessage);

                }


                /**
                 * When includeResponseHeaders is set to true the function will return an object
                 * { 
                 *     data: the result data
                 *     headers: the response headers
                 * }
                 */
                if (includeResponseHeaders === true) {

                    result = {
                        data: result,
                        headers: response.headers
                    }

                }

                if (includeResponseStatus === true) {

                    if (includeResponseHeaders) {

                        result.status = response.status;

                    } else {

                        result = {
                            data: result,
                            status: response.status
                        }
                    }

                }

                if (cacheKey) {

                    if (cacheGroup && typeof STEC_CACHE[cacheGroup] !== 'object') {
                        STEC_CACHE[cacheGroup] = {};
                    }

                    const cache = cacheGroup ? STEC_CACHE[cacheGroup] : STEC_CACHE;

                    cache[cacheKey] = result;
                }

                return result;

            } catch (error) {

                if (!abortController.signal.aborted) {
                    throw error;
                }


            } finally {

                clearTimeout(timeoutId);
            }

        }
    };

    const theData = fetchData();

    return theData;
};


/**
 * Calls the WordPress REST API with a POST request.
 * 
 * @param {string} route - The REST API route to call.
 * @param {Array} args - An array of arguments to be appended to the route.
 * @param {AbortController} abortController - An AbortController object that can be used to cancel the request.
 * @param {boolean} includeResponseHeaders - A boolean value indicating whether to include the response headers in the returned result.
 * @param {boolean} includeResponseStatus - A boolean value indicating whether to include the response status code in the returned result.
 * @param {boolean} hasFiles - A boolean value indicating whether the request body contains files.
 * @param {*} data - The data to be sent with the POST request.
 * @param {Object} headers - An object containing additional headers to be sent with the request.
 * @param {boolean|Object} translateErrorCode - A boolean value or an object containing error code messages to be translated.
 * @returns {Promise} - A Promise that resolves to the response data or rejects with an error message.
 */
export const newApiPost = async ({
    route,
    args,
    abortController,
    includeResponseHeaders = false,
    includeResponseStatus = false,
    hasFiles = false,
    data,
    headers = {},
    translateErrorCode = false, // handle error code messages so user understand what is going on,
    errorMessage = __('Sorry, something went wrong', 'stec'), // default error message, if set to 'auto' it will extract the content from the .message property of the response
}) => {

    let fetchUrl = testFetchUrl(route);

    if (args) {
        fetchUrl += `/${args.toString()}`;
    }

    if (!headers['X-WP-Nonce']) {
        headers['X-WP-Nonce'] = STEC_VARIABLES.api_nonce
    }

    if (!hasFiles && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchData = async () => {

        const timeoutDelay = window.stecFilterApiTimeoutDelay || 30000; // 30 seconds

        const fetchOptions = {
            method: 'POST',
            body: hasFiles ? data : JSON.stringify(data ? data : ''),
            headers
        }

        if (!abortController) {
            abortController = new AbortController();
        }

        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, timeoutDelay);

        fetchOptions.signal = abortController.signal;

        try {
            const response = await fetch(fetchUrl, fetchOptions);
            let result = await response.json();

            if (!response.ok) {

                if (translateErrorCode && translateErrorCode[result.code]) {
                    errorMessage = translateErrorCode[result.code];
                } else if (errorMessage === 'auto' && result && result.message) {
                    errorMessage = result.message;
                } else {
                    errorMessage = errorMessage || __('Sorry, something went wrong', 'stec');
                }

                throw new Error(errorMessage);

            }

            /**
             * When includeResponseHeaders is set to true the function will return an object
             * { 
             *     data: the result data
             *     headers: the response headers
             * }
             */
            if (includeResponseHeaders === true) {

                result = {
                    data: result,
                    headers: response.headers
                }

            }

            if (includeResponseStatus === true) {

                if (includeResponseHeaders) {

                    result.status = response.status;

                } else {

                    result = {
                        data: result,
                        status: response.status
                    }
                }

            }

            return result;

        } catch (error) {

            if (!abortController.signal.aborted) {
                throw error;
            }

        } finally {

            clearTimeout(timeoutId);
        }
    };

    const theData = fetchData();

    return theData;

}

/**
 * Calls the WordPress REST API with a PUT request.
 * 
 * @param {string} route - The REST API route to call.
 * @param {Array} args - An array of arguments to be appended to the route.
 * @param {AbortController} abortController - An AbortController object that can be used to cancel the request.
 * @param {boolean} includeResponseHeaders - A boolean value indicating whether to include the response headers in the returned result.
 * @param {boolean} includeResponseStatus - A boolean value indicating whether to include the response status code in the returned result.
 * @param {boolean} hasFiles - A boolean value indicating whether the request body contains files.
 * @param {*} data - The data to be sent with the PUT request.
 * @param {Object} headers - An object containing additional headers to be sent with the request.
 * @param {boolean|Object} translateErrorCode - A boolean value or an object containing error code messages to be translated.
 * 
 * @returns {Promise} - A Promise that resolves to the response data or rejects with an error message.
 */
export const newApiPut = async ({
    route,
    args,
    abortController,
    includeResponseHeaders = false,
    includeResponseStatus = false,
    hasFiles = false,
    data,
    headers = {},
    translateErrorCode = false,
    errorMessage = __('Sorry, something went wrong', 'stec'),
}) => {

    let fetchUrl = testFetchUrl(route);

    if (args) {
        fetchUrl += `/${args.toString()}`;
    }

    if (!headers['X-WP-Nonce']) {
        headers['X-WP-Nonce'] = STEC_VARIABLES.api_nonce
    }

    if (!hasFiles && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchData = async () => {

        const timeoutDelay = window.stecFilterApiTimeoutDelay || 30000; // 30 seconds

        const fetchOptions = {
            method: 'PUT',
            body: hasFiles ? data : JSON.stringify(data ? data : ''),
            headers
        }

        if (!abortController) {
            abortController = new AbortController();
        }

        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, timeoutDelay);

        fetchOptions.signal = abortController.signal;

        try {
            const response = await fetch(fetchUrl, fetchOptions);
            let result = await response.json();

            if (!response.ok) {

                if (translateErrorCode && translateErrorCode[result.code]) {
                    errorMessage = translateErrorCode[result.code];
                } else if (errorMessage === 'auto' && result && result.message) {
                    errorMessage = result.message;
                } else {
                    errorMessage = errorMessage || __('Sorry, something went wrong', 'stec');
                }

                throw new Error(errorMessage);

            }

            /**
             * When includeResponseHeaders is set to true the function will return an object
             * { 
             *     data: the result data
             *     headers: the response headers
             * }
             */
            if (includeResponseHeaders === true) {

                result = {
                    data: result,
                    headers: response.headers
                }

            }

            if (includeResponseStatus === true) {

                if (includeResponseHeaders) {

                    result.status = response.status;

                } else {

                    result = {
                        data: result,
                        status: response.status
                    }
                }

            }

            return result;

        } catch (error) {

            if (!abortController.signal.aborted) {
                throw error;
            }

        } finally {

            clearTimeout(timeoutId);
        }
    };

    const theData = fetchData();

    return theData;

}

/**
 * Sends a DELETE request to the WordPress REST API.
 * 
 * @param {string} route - The REST API route.
 * @param {string|number} args - The optional arguments to pass to the route.
 * @param {AbortController} abortController - The abort controller to use for the fetch request.
 * @param {boolean} includeResponseHeaders - Whether or not to include the response headers in the returned data.
 * @param {boolean} includeResponseStatus - Whether or not to include the response status in the returned data.
 * @param {object} headers - The headers to include in the request.
 * @param {boolean} translateErrorCode - Whether or not to translate error code messages so the user can understand what went wrong.
 * 
 * @returns {Promise} - A promise that resolves to the fetched data.
 * 
 */
export const newApiDelete = ({
    route,
    args,
    abortController,
    includeResponseHeaders = false,
    includeResponseStatus = false,
    headers = {},
    translateErrorCode = false,
    errorMessage = __(`Sorry, something went wrong`, 'stec')

}) => {

    let fetchUrl = testFetchUrl(route);

    if (args) {
        fetchUrl += `/${args.toString()}`;
    }

    if (!headers['X-WP-Nonce']) {
        headers['X-WP-Nonce'] = STEC_VARIABLES.api_nonce;
    }

    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchData = async () => {

        const timeoutDelay = window.stecFilterApiTimeoutDelay || 30000; // 30 seconds

        const fetchOptions = {
            method: 'DELETE',
            headers,
        }

        if (!abortController) {
            abortController = new AbortController();
        }

        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, timeoutDelay);

        fetchOptions.signal = abortController.signal;

        try {
            const response = await fetch(fetchUrl, fetchOptions);
            let result = await response.json();

            if (!response.ok) {

                if (translateErrorCode && translateErrorCode[result.code]) {
                    errorMessage = translateErrorCode[result.code];
                } else if (errorMessage === 'auto' && result && result.message) {
                    errorMessage = result.message;
                } else {
                    errorMessage = errorMessage || __('Sorry, something went wrong', 'stec');
                }

                throw new Error(errorMessage);

            }

            /**
             * When includeResponseHeaders is set to true the function will return an object
             * { 
             *     data: the result data
             *     headers: the response headers
             * }
             */
            if (includeResponseHeaders === true) {

                result = {
                    data: result,
                    headers: response.headers
                }

            }

            if (includeResponseStatus === true) {

                if (includeResponseHeaders) {

                    result.status = response.status;

                } else {

                    result = {
                        data: result,
                        status: response.status
                    }
                }

            }

            return result;

        } catch (error) {

            if (!abortController.signal.aborted) {
                throw error;
            }


        } finally {

            clearTimeout(timeoutId);
        }

    };

    const theData = fetchData();

    return theData;
};