import {React, useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './MatchingQuestion.css';

const initialLeftItems = [
  { id: 'item-1', content: 'Item 1' },
  { id: 'item-2', content: 'Item 2' },
  { id: 'item-3', content: 'Item 3' },
  { id: 'item-4', content: 'Item 4' },
];

const initialRightItems = [null, null, null, null];

const Drag = () => {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If no destination, do nothing
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      if (source.droppableId === 'left-pane') {
        const leftCopy = Array.from(leftItems);
        const [movedItem] = leftCopy.splice(source.index, 1);
        leftCopy.splice(destination.index, 0, movedItem);
        setLeftItems(leftCopy);
      } else {
        // TODO: this is right to right movement, swap it (this should handle value not present part)
      }
    } else {
      // Moving between lists
      if (destination.droppableId.startsWith('right-pane')) {
        // this is left to right movement
        const destIndex = parseInt(destination.droppableId.split('-')[2]);
        if (rightItems[destIndex] === null) {
          const newLeftItems = Array.from(leftItems);
          const [movedItem] = newLeftItems.splice(source.index, 1);
          const newRightItems = Array.from(rightItems);
          newRightItems[destIndex] = movedItem;
          setLeftItems(newLeftItems);
          setRightItems(newRightItems);
        } else {
          // TODO: move the item already present on the left
        }
      } else if (source.droppableId.startsWith('right-pane')) {

        // this is right to left movement
        const sourceIndex = parseInt(source.droppableId.split('-')[2]);
        const newLeftItems = Array.from(leftItems);
        const newRightItems = Array.from(rightItems);
        const [movedItem] = newRightItems.splice(sourceIndex, 1, null);
        newLeftItems.splice(destination.index, 0, movedItem);
        setLeftItems(newLeftItems);
        setRightItems(newRightItems);
      }
    }
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="left-pane">
          {(provided) => (
            <div className="left-pane" ref={provided.innerRef} {...provided.droppableProps}>
              {leftItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="right-pane">
          {rightItems.map((item, index) => (
            <Droppable key={index} droppableId={`right-pane-${index}`}>
              {(provided) => (
                <div className="droppable-box" ref={provided.innerRef} {...provided.droppableProps}>
                  {item ? (
                    <Draggable key={item.id} draggableId={item.id} index={0}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ) : (
                    <div className="placeholder">Drop here</div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Drag;