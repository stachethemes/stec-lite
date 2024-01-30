/**
 * ? Why the hell would anyone want that?
 * - Nobody but couldn't figure other way to prevent conflicts with theme & plugins css
 * 
 * For suggestions pm stachethemes@gmail.com
 * 
 * Added global variable listener DISABLE_STEC_WEB_COMPONENTS
 * that can turn off custom web components in case sh* hit the fan
 */

export const StecDiv = React.forwardRef((props, ref) => {

    if (true === window.DISABLE_STEC_WEB_COMPONENTS) {

        return (
            <div ref={ref} {...props} />
        );

    } else {

        let componentProps = { ...props }

        if (componentProps.className) {
            componentProps.class = componentProps.className; // className wont work here
        }

        delete componentProps.className;

        return (
            <stec-div ref={ref} {...componentProps} />
        );

    }

});

StecDiv.displayName = 'StecDiv';

export const StecInputCheckBox = React.forwardRef((props, ref) => {

    if (true === window.DISABLE_STEC_WEB_COMPONENTS) {

        return (
            <input type="checkbox" ref={ref} {...props} title={props.hint} />
        );

    } else {

        let componentProps = { ...props }
        let classNameArray = props.checked ? ['stec-input-type-checkbox', 'fa-solid fa-check'] : ['stec-input-type-checkbox'];

        if (componentProps.class) {
            classNameArray.push(componentProps.class);
            delete componentProps.class;
        }

        const onClick = (e) => {

            if (props.onChange) {

                props.onChange(
                    {
                        ...e, target: {
                            ...e.target, checked: !props.checked
                        }
                    }
                );

            }
        }

        return (

            <stec-checkbox
                title={props.hint}
                tabIndex={0}
                class={classNameArray.join(' ')}
                ref={ref}
                {...componentProps}

                onClick={(e) => {
                    onClick(e);
                }}

                onKeyDown={(e) => {
                    if (' ' === e.key) {
                        onClick(e);
                        e.preventDefault();
                    }
                }}

            />
        );

    }

});

StecInputCheckBox.displayName = 'StecInputCheckBox';

export const StecSpan = React.forwardRef((props, ref) => {

    if (true === window.DISABLE_STEC_WEB_COMPONENTS) {

        return (
            <span ref={ref} {...props} />
        );

    } else {

        let componentProps = { ...props }

        if (componentProps.className) {
            componentProps.class = componentProps.className; // className wont work here
            delete componentProps.className;
        }

        return (
            <stec-span ref={ref} {...componentProps} />
        );

    }

});

StecSpan.displayName = 'StecSpan';