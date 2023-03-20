import React from 'react';
import MoreVert from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import { DragSource } from 'react-dnd';
import { withStyles } from '@material-ui/core/styles';
import { choiceIsEmpty } from './markupUtils';
import PropTypes from 'prop-types';

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

export const BlankContent = withStyles((theme) => ({
  choice: {
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
  },
  deleteIcon: {
    position: 'absolute',
    top: '6px',
    right: '0',
    color: theme.palette.grey[500],
    zIndex: 2,

    '& :hover': {
      cursor: 'pointer',
      color: theme.palette.common.black,
    },
  },
}))((props) => {
  const { classes, connectDragSource, choice, onClick, onRemoveChoice, error } = props;

  return connectDragSource(
    <div className={classes.choice} style={{ border: `1px solid ${error ? '#f44336' : '#C0C3CF'}` }} onClick={onClick}>
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

      <Delete
        className={classes.deleteIcon}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onRemoveChoice(e);
        }}
      />
    </div>,
  );
});

export const tileSource = {
  canDrag(props) {
    if (choiceIsEmpty(props.choice)) {
      alert('You need to define a value for an answer choice before it can be associated with a response area.');
      return false;
    }

    return !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.choice,
      instanceId: props.instanceId,
    };
  },
};

export default DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(BlankContent);
