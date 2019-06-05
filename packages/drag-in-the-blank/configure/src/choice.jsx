import React from 'react';
import MoreVert from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import { DragSource } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';

const GripIcon = ({ style }) => {
  return (
    <span style={style}>
      <MoreVert
        style={{
          margin: '0 -16px'
        }}
      />
      <MoreVert />
    </span>
  );
};

export const BlankContent = withStyles(theme => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`
  },
  disabled: {}
}))(props => {
  const { connectDragSource, choice, onClick, onRemoveChoice } = props;

  return connectDragSource(
    <div
      style={{
        display: 'inline-flex',
        minWidth: '178px',
        minHeight: '36px',
        height: '36px',
        background: '#FFF',
        border: '1px solid #C0C3CF',
        boxSizing: 'border-box',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        padding: '8px 35px 8px 35px'
      }}
      onClick={onClick}
    >
      <GripIcon
        style={{
          position: 'absolute',
          top: '6px',
          left: '15px',
          color: '#9B9B9B',
          zIndex: 2
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: choice.value
        }}
      />
      <Delete
        style={{
          position: 'absolute',
          top: '6px',
          right: '0',
          color: '#9B9B9B',
          zIndex: 2
        }}
        onMouseDown={onRemoveChoice}
      />
    </div>
  );
});

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.choice,
      instanceId: props.instanceId
    };
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      props.onChoiceDropped();
    }
  }
};

export default DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(BlankContent);
