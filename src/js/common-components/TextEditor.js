import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import { MediaFrame, getPluginUrl } from '@Stec/JS/helpers.js';
import { StecDiv } from '@Stec/WebComponents';
import { Editor } from '@tinymce/tinymce-react';
import { __, _x } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import Flexbox from './Flexbox';

function TextEditorPlain(props) {

    return (
        <StecDiv className='stec-text-editor'>
            <label>
                <UncontrolledInputTextarea
                    title={props.title}
                    defaultValue={props.value}
                    onChange={value => {
                        props.onChange(value);
                    }}
                    description={props.description}
                />

            </label>
        </StecDiv>
    )
}

const TextEditorRich = (props) => {

    const [data, setData] = useState(props.value);
    const onChange = props.onChange;

    const defaultTinyMceUrl = getPluginUrl('assets/js/libs/tinymce/js/tinymce/tinymce.min.js').href;
    let tinymceScriptSrc = STEC_VARIABLES.tiny_mce.src;
    let isCustomScr = false;

    if (tinymceScriptSrc === 'cdn') {
        // * "cdn" is a special word telling the plugin to load the script from the cloud
        tinymceScriptSrc = undefined;
    } else if (!tinymceScriptSrc) {
        // * if the source is empty, use the default
        tinymceScriptSrc = defaultTinyMceUrl;
    } else {
        // * if the source is not empty, it's a custom script
        isCustomScr = true;
    }

    const handleMediaLibrary = async (editor) => {

        const images = await MediaFrame({
            title: _x('Select Images', 'TinyMCE Editor Media Library', 'stachethemes_event_calendar_lite'),
            buttonText: _x('Add Images', 'TinyMCE Editor Media Library', 'stachethemes_event_calendar_lite'),
            libraryType: 'image',
            multiple: true
        });

        if (Array.isArray(images) && images.length > 0) {
            images.forEach(image => {
                const imageHtml = `<img src="${image.url}" alt="${image.alt}" />`;
                editor.insertContent(imageHtml);
            });
        }

    }

    const registerMediaLibraryButton = (editor) => {

        if (typeof window.wp.media === 'undefined' || !STEC_VARIABLES?.current_user?.capability?.upload_files) {
            return;
        }

        editor?.ui?.registry?.addButton('mediaLibrary', {
            text: _x('Media Library', 'TinyMCE Button', 'stachethemes_event_calendar_lite'),
            tooltip: _x('Add images from the media library', 'TinyMCE Button', 'stachethemes_event_calendar_lite'),
            onAction: function (_) {
                handleMediaLibrary(editor);
            }
        });

    }

    // check out https://www.tiny.cloud/docs/tinymce/6/migration-from-5x/#core-changes
    // some toolbar names are changed
    let editorInit = {
        setup: (editor) => {

            registerMediaLibraryButton(editor);

            if (typeof window.stecOnTinyMceSetup === 'function') {
                window.stecOnTinyMceSetup(editor);
            }
        },
        relative_urls: false,
        convert_urls: false,
        menubar: false,
        plugins: isCustomScr ? ['link', 'lists', 'image'] : ['link', 'lists', 'image', 'wordcount', 'code'],
        toolbar: 'undo redo | formatselect | blocks fontsize | bold italic link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | mediaLibrary image | removeformat | wordcount | code'
    };

    if (typeof window.stecFilterTinyMceParams === 'function') {
        editorInit = window.stecFilterTinyMceParams(editorInit);
    }

    useEffect(() => {
        onChange(data);
    }, [data, onChange]);

    return (
        <StecDiv className='stec-text-editor'>
            <label>
                <Flexbox style={{
                    justifyContent: 'space-between'
                }}>
                    <FieldTitle text={props.title} />

                </Flexbox>

                <Editor
                    onScriptsLoadError={() => {
                        props?.onScriptsLoadError?.();
                    }}
                    tinymceScriptSrc={tinymceScriptSrc}
                    apiKey={STEC_VARIABLES.tiny_mce.api_key}
                    value={data}
                    onEditorChange={value => {
                        setData(value);
                    }}
                    init={editorInit}
                />

                <FieldDescription text={props.description} allowHtml={true} />
            </label>
        </StecDiv>
    )

}

function TextEditor(props) {

    const [editorKey, setEditorKey] = useState(0);

    if (window.STEC_FORCE_DISABLE?.tiny_mce) {
        return <TextEditorPlain {...props} />
    }

    if (true === STEC_VARIABLES.tiny_mce.enabled) {

        return <TextEditorRich {...props} onScriptsLoadError={() => {

            // * If the editor fails to load, disable it and use plain textarea instead

            if (!window.STEC_FORCE_DISABLE) {
                window.STEC_FORCE_DISABLE = {};
            }

            window.STEC_FORCE_DISABLE.tiny_mce = true;

            setEditorKey(editorKey + 1);
        }} />
    }

    return <TextEditorPlain {...props} />

}

export default TextEditor
