import Highlight from '@Stec/CommonComponents/Highlight';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function CustomHtml(props) {

    const { html, isBuilder, preview = false } = props;

    if (isBuilder && !preview) {

        return (
            <StecDiv className='stec-builder-element-custom-html' style={props.style}>
                <Highlight lang={html ? 'html' : 'plaintext'}>
                    {html || __('Add your custom HTML here', 'stec')}
                </Highlight>
            </StecDiv>
        )
    }

    return (
        <StecDiv style={props.style}>
            <StecDiv dangerouslySetInnerHTML={{ __html: html }} />
        </StecDiv>
    )

}

export default CustomHtml