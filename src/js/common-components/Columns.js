import { StecDiv } from '@Stec/WebComponents';

const Column = ({ columnContent }) => {
    <StecDiv className='stec-column'>
        {columnContent}
    </StecDiv>
}

function Columns(props) {

    return (
        <StecDiv className='stec-columns' style={props.style}>

            {
                props.content.map((columnContent, i) => {

                    return <Column key={i} columnContent={columnContent} />

                })
            }

        </StecDiv>
    )
}

export default Columns