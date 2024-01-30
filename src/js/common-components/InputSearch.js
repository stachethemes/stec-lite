import { StecDiv, StecSpan } from '@Stec/WebComponents';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import Loader from './Loader';

import { __ } from '@wordpress/i18n';

const InputSearch = React.forwardRef((props, ref) => {

    const classNameArray = ['stec-input-search-wrapper'];

    return (
        <StecDiv className={classNameArray} ref={ref}>
            <label>
                <FieldTitle text={props.title} />

                <StecDiv className='stec-input-search-wrapper-relative'>
                    <input
                        style={['ready', 'loading'].includes(props.status) ? {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        } : {}}
                        type="text"
                        value={props.value}
                        placeholder={props.placeholder}
                        onChange={props.onChange}
                    />

                    {
                        ['ready', 'loading'].includes(props.status) &&

                        <StecDiv className='stec-input-search-wrapper-dropdown'>

                            {
                                'loading' === props.status &&
                                <Loader type='small-wide' title={__('Searching...', 'stec')} />
                            }

                            {
                                'ready' === props.status && <>

                                    {
                                        props.isError && <StecSpan className='stec-input-search-nothing-found'>
                                            <i className='fa-solid fa-triangle-exclamation' style={{marginRight: 5}} />{__('Unexpected error', 'stec')}
                                        </StecSpan>
                                    }

                                    {(!props.isError && (false === Array.isArray(props.items) || props.items.length <= 0)) && <StecSpan className='stec-input-search-nothing-found'>
                                        {__('Nothing found', 'stec')}
                                    </StecSpan>}

                                    {(!props.isError && Array.isArray(props.items) && props.items.length > 0) && props.items}
                                </>
                            }

                        </StecDiv>
                    }
                </StecDiv>

                <FieldDescription text={props.description} />
            </label>


        </StecDiv>
    )
});

InputSearch.displayName = 'InputSearch';

export default InputSearch