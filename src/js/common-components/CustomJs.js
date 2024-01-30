import Highlight from '@Stec/CommonComponents/Highlight';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';

function CustomJs(props) {

    const { js, isBuilder } = props;

    useEffect(() => {

        let mounted = true;
        let script = null;


        if (isBuilder) {
            return;
        }

        setTimeout(() => {

            if (mounted) {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = js;
                document.body.appendChild(script);
            }

        });

        return () => {

            mounted = false;

            if (script) {
                document.body.removeChild(script);
            }
        }

    }, [isBuilder, js])

    if (isBuilder) {
        return (
            <StecDiv className='stec-builder-element-custom-js' style={props.style}>

                <Highlight lang={js ? 'js' : 'plaintext'}>
                    {js || __('Add your custom JS here', 'stec')}
                </Highlight>

            </StecDiv>

        )
    }

    return null;

}

export default CustomJs