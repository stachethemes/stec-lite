import { getPluginUrl } from '@Stec/JS/helpers';
import { useEffect, useRef } from 'react';

function Highlight(props) {

    const container = useRef(null);
    const propsDep = JSON.stringify(props);

    useEffect(() => {

        let mounted = true;

        const initHlJs = () => {

            if (mounted) {

                window.hljs.configure({
                    // react by default escapes html
                    // hljs triggers false positive ?
                    ignoreUnescapedHTML: true 
                });

                window.hljs.highlightElement(container.current);

                container.current.parentElement.style.display = 'block'

            }

        }

        if (window.hljs) {
            initHlJs();
            return;
        }

        const script = document.createElement('script');
        script.src = getPluginUrl('assets/js/libs/highlight.min.js');
        script.async = true;
        script.onload = () => {
            initHlJs();
        };

        document.body.appendChild(script);

        return () => {
            mounted = false;
            document.body.removeChild(script);
        }

    }, [propsDep]);

    return (
        <pre className='stec-highlight' style={{ display: 'none' }}>
            <code className={`language-${props.lang}`} ref={container}>
                {props.children}
            </code>
        </pre>
    )
}

export default Highlight