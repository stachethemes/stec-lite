import { StecDiv } from '@Stec/WebComponents';
import EventPerson from './EventPerson';

const EventPersons = ({ persons, style, tagLabel, verifiedTitle = '' }) => {

    return (
        <StecDiv className='stec-persons-list' style={style}>
            {
                persons.map(person => {
                    return <EventPerson
                        key={person.id}
                        tagLabel={tagLabel}
                        tagBackgroundColor={person.color || ''}
                        person={person}
                        verifiedTitle={verifiedTitle}
                    />
                })
            }
        </StecDiv>
    )
}

export default EventPersons
