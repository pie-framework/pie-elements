import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { useTheme } from '@mui/material/styles';
import { useDroppable } from '@dnd-kit/core';
import { PlaceHolder } from '@pie-lib/drag';
import { color } from '@pie-lib/render-ui';

const log = debug('@pie-ui:categorize:droppable-placeholder');

const DroppablePlaceholder = ({
  children,
  grid,
  disabled,
  choiceBoard,
  minRowHeight,
  id,
  correct
}) => {
  const theme = useTheme();
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      itemType: 'categorize',
      categoryId: id
    },
    disabled,
  });

  const extraStyles = {
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    gridColumnGap: 0,
    gridRowGap: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%',
    height: '100%',
    ...(correct === false && {
      border: `solid 2px ${color.incorrect()}`,
    }),
    ...(correct === true && {
      border: `solid 2px ${color.correct()}`,
    }),
  };

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
        extraStyles={extraStyles}
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
  id: PropTypes.string.isRequired,
  correct: PropTypes.bool
};

export default DroppablePlaceholder;
