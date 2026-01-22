import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { useDroppable } from '@dnd-kit/core';
import { PlaceHolder } from '@pie-lib/drag';

const log = debug('@pie-ui:categorize:droppable-placeholder');

const DroppablePlaceholder = ({
  children,
  grid,
  disabled,
  choiceBoard,
  minRowHeight,
  id
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      itemType: 'categorize',
      categoryId: id
    },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minHeight: minRowHeight || '80px',
        position: 'relative'
      }}
    >
      <PlaceHolder
        isOver={isOver}
        grid={grid}
        disabled={disabled}
        choiceBoard={choiceBoard}
        isCategorize
      >
        {children}
      </PlaceHolder>
    </div>
  );
};

DroppablePlaceholder.propTypes = {
  choiceBoard: PropTypes.bool,
  children: PropTypes.node.isRequired,
  grid: PropTypes.object,
  disabled: PropTypes.bool,
  minRowHeight: PropTypes.string,
  onDropChoice: PropTypes.func,
  id: PropTypes.string.isRequired
};

export default DroppablePlaceholder;
