import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useState, useEffect } from 'react';

const ActiveTabContent = ({ active, items }) => {

    const tabContent = items.find(item => item.id === active);

    if (!active || !tabContent) {
        return <StecDiv className='stec-content-tabs-content'></StecDiv>;
    }

    return (
        <StecDiv className='stec-content-tabs-content'>

            {tabContent.content}

            {/* {
                tabContent.children.map(childElement => {
                    return <StructureElement key={childElement.id} element={childElement}  />
                })
            } */}


        </StecDiv>
    )

}

function ContentTabs(props) {

    const [active, setActive] = useState(false);

    useEffect(() => {

        if (active) {

            if (!props.items.find(item => item.id === active)) {
                setActive(false);
            }

            return;
        }

        if (props.items.length > 0) {
            setActive(props.items[0].id);
        }

    }, [active, props.items]);

    const numberOfTabs = props.items.filter(item => item.content.filter(t => t).length > 0).length;

    return (
        <>
            {
                numberOfTabs > 1 && <StecDiv className='stec-content-tabs' style={props.style}>

                    {
                        props.items.map(item => {

                            // remove tab if no content
                            if (item.content.filter(t => t).length <= 0) {
                                return null;
                            }

                            return (
                                <StecDiv key={`${item.id}-label`}

                                    className={`stec-content-tab ${item.id === active ? 'active' : ''}`}

                                    onClick={() => {
                                        setActive(item.id);
                                    }}>

                                    {item.icon && <i className={item.icon} />}

                                    <StecSpan>{item.label}</StecSpan>
                                </StecDiv>
                            )
                        })
                    }

                </StecDiv>
            }

            <ActiveTabContent active={active} items={props.items} />

        </>
    )
}

export default ContentTabs