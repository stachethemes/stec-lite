import { useState, useEffect } from 'react';

const WithAjaxNonce = (props) => {

    const [ready, setReady] = useState(false);

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;
        let mounted = true;
        let isFetching = false;
        let timeout;

        async function fetchNonce() {

            try {
                isFetching = true;
                STEC_VARIABLES.api_nonce_status = 'fetching';

                const response = await fetch(STEC_VARIABLES.ajax_url + '?action=stec_rest_nonce', { signal });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { success, data: nonce } = await response.json();

                if (success) {

                    STEC_VARIABLES.api_nonce = nonce;
                    STEC_VARIABLES.api_nonce_status = 'fetched';

                    if (mounted) {
                        setReady(true);
                    }

                } else {
                    throw new Error('Nonce error');
                }

            } catch (error) {

                if (!controller.signal.aborted) {
                    STEC_VARIABLES.api_nonce_status = 'error';
                }

            }
        }

        const run = () => {

            /**
             * * Check if nonce is already fetched or fetching
             * * If it is, wait for it to be fetched
             * * If it is not, fetch it
             * ! This is done to prevent multiple fetches
             */
            switch (STEC_VARIABLES.api_nonce_status) {

                case 'fetching': {

                    timeout = setTimeout(() => {
                        if (mounted) {
                            run();
                        }
                    }, 100);

                    break;
                }

                case 'fetched': {
                    setReady(true);
                    break;
                }

                case 'error': {
                    break;
                }

                default: {
                    fetchNonce();
                }
            }
        }

        if (!ready) {
            run();
        }

        return () => {
            mounted = false;
            controller.abort();
            clearTimeout(timeout);
            
            if (isFetching) {
                STEC_VARIABLES.api_nonce_status = '';
            }
        }

    }, [ready]);

    if (!ready) {

        if (props.fallback) {
            return props.fallback;
        }

        return null;
    }

    return (
        props.children
    )
}

/**
 * * This component fetches nonce from the server and stores it in the global variable STEC_VARIABLES.api_nonce
 * * This is done to bypass the caching of the nonce by cache plugins
 * * This option should be turned on as a last resort if nonce is not working properly
 * 
 */
function AjaxNonce(props) {


    // * If option is on and nonce is not fetched yet
    if (STEC_VARIABLES.ajax_nonce && STEC_VARIABLES.api_nonce_status !== 'fetched') {
        return <WithAjaxNonce {...props} />
    }

    return (
        props.children
    )
}

export default AjaxNonce