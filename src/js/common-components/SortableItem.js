import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StecDiv } from '@Stec/WebComponents';

export const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <StecDiv ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </StecDiv>
  );
}