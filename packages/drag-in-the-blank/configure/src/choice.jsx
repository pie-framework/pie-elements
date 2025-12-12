import React from 'react';
import PropTypes from 'prop-types';
import MoreVert from '@mui/icons-material/MoreVert';
import Delete from '@mui/icons-material/Delete';
import { useDraggable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import { choiceIsEmpty } from './markupUtils';

const GripIcon = ({ style }) => {
  return (
    <span style={style}>
      <MoreVert style={{ margin: '0 -16px' }} />
      <MoreVert />
    </span>
  );
};

GripIcon.propTypes = {
  style: PropTypes.object,
};

const StyledChoice = styled('div', {
  shouldForwardProp: (prop) => !['error', 'isDragging'].includes(prop),
})(({ theme, error, isDragging }) => ({
  display: 'inline-flex',
  minWidth: '178px',
  minHeight: '36px',
  background: theme.palette.common.white,
  boxSizing: 'border-box',
  borderRadius: '3px',
  overflow: 'hidden',
  position: 'relative',
  padding: '8px 35px 8px 35px',
  cursor: 'grab',
  border: `1px solid ${error ? '#f44336' : '#C0C3CF'}`,
  // opacity: isDragging ? 0.5 : 1,
  '& img': {
    display: 'flex'
  },
  '& mjx-frac': {
    fontSize: '120% !important',
  },
}));

const StyledDeleteIcon = styled(Delete)(({ theme }) => ({
  position: 'absolute',
  top: '6px',
  right: '0',
  color: theme.palette.grey[500],
  zIndex: 2,
  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.common.black,
  },
}));

export const BlankContent = (props) => {
  const { choice, onClick, onRemoveChoice, error, instanceId, disabled } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `choice-${choice.id}-${instanceId || 'default'}`,
    data: {
      type: 'drag-in-the-blank-choice',
      id: choice.id,
      value: choice,
      instanceId: instanceId,
    },
    disabled: disabled || choiceIsEmpty(choice),

  });

  const style = transform ? {
    // transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDragStart = (e) => {
    if (choiceIsEmpty(choice)) {
      e.preventDefault();
      alert('You need to define a value for an answer choice before it can be associated with a response area.');
      return;
    }
  };

  return (
    <StyledChoice
      ref={setNodeRef}
      style={style}
      error={error}
      isDragging={isDragging}
      onClick={onClick}
      {...attributes}
      {...listeners}
      onDragStart={handleDragStart}
    >
      <GripIcon
        style={{
          position: 'absolute',
          top: '6px',
          left: '15px',
          color: '#9e9e9e',
          zIndex: 2,
        }}
      />

      <span dangerouslySetInnerHTML={{ __html: choice.value }} />

      <StyledDeleteIcon
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onRemoveChoice(e);
        }}
      />
    </StyledChoice>
  );
};

BlankContent.propTypes = {
  choice: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onRemoveChoice: PropTypes.func.isRequired,
  error: PropTypes.bool,
  instanceId: PropTypes.string,
  disabled: PropTypes.bool,
};

export default BlankContent;
