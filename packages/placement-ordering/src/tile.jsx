import { DragSource, DropTarget } from 'react-dnd';

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import { PlaceHolder } from '@pie-lib/pie-toolbox/drag';
import { color } from '@pie-lib/pie-toolbox/render-ui';

const log = debug('pie-elements:placement-ordering:tile');

const Holder = withStyles((theme) => ({
  number: {
    width: '100%',
    fontSize: theme.typography.fontSize + 4,
    textAlign: 'center',
    color: `rgba(${theme.palette.common.black}, 0.6)`,
  },
}))(({ classes, type, index, isOver, disabled }) => (
  <PlaceHolder type={type} isOver={isOver} disabled={disabled}>
    {type === 'target' && index !== undefined && <div className={classes.number}>{index}</div>}
  </PlaceHolder>
));

Holder.propTypes = {
  type: PropTypes.string,
  index: PropTypes.number,
  isOver: PropTypes.bool,
  disabled: PropTypes.bool,
};

const TileContent = withStyles((theme) => ({
  over: {
    opacity: 0.2,
  },
  tileContent: {
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: color.background(),
    transition: 'opacity 200ms linear',
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    // If interactions with the image in the token will be requested we should handle only the context Menu.
    pointerEvents: 'none',
    '&:hover': {
      backgroundColor: color.secondary(),
    },
  },
  dragging: {
    backgroundColor: color.secondaryLight(),
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: color.background(),
    },
  },
  incorrect: {
    border: `1px solid ${color.incorrect()}`,
  },
  correct: {
    border: `1px solid ${color.correct()}`,
  },
  emptyTile: {
    border: 'none',
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
}))((props) => {
  const { type, classes, isDragging, empty, isOver, label, disabled, outcome, guideIndex } = props;

  if (empty) {
    return <Holder type={type} index={guideIndex} isOver={isOver} disabled={disabled} />;
  } else {
    const names = classNames(
      classes.tileContent,
      !label ? classes.emptyTile : null,
      isDragging && !disabled && classes.dragging,
      isOver && !disabled && classes.over,
      disabled && classes.disabled,
      outcome && classes[outcome],
    );
    return <div className={names} dangerouslySetInnerHTML={{ __html: label }} />;
  }
});

export class Tile extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any,
    label: PropTypes.string,
    isOver: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    type: PropTypes.string,
    empty: PropTypes.bool,
    disabled: PropTypes.bool,
    outcome: PropTypes.string,
    index: PropTypes.number,
    guideIndex: PropTypes.number,
  };

  componentDidMount() {
    // Workaround for Chrome's rendering issue post version 106.
    // Adding 'translateZ(0)' forces the browser to use hardware-accelerated rendering
    // which fixes the issue of disappearing elements during drag and drop.
    document.body.style.transform = 'translateZ(0)';
  }

  render() {
    const {
      label,
      isDragging,
      connectDragSource,
      connectDropTarget,
      classes,
      isOver,
      type,
      id,
      empty,
      disabled,
      outcome,
      index,
      guideIndex,
    } = this.props;

    log('[render], props: ', this.props);

    const name = classNames(classes.title);

    const dragSourceOpts = {
      //dropEffect: moveOnDrag ? 'move' : 'copy'
    };

    return connectDragSource(
      connectDropTarget(
        <div className={name}>
          <TileContent
            label={label}
            id={id}
            empty={empty}
            index={index}
            guideIndex={guideIndex}
            isOver={isOver}
            isDragging={isDragging}
            disabled={disabled}
            outcome={outcome}
            type={type}
          />
        </div>,
      ),
      dragSourceOpts,
    );
  }
}

const StyledTile = withStyles({
  title: {
    boxSizing: 'border-box',
    overflow: 'hidden',
    margin: '0px',
    padding: '0px',
    textAlign: 'center',
  },
})(Tile);

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();
    log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);
    if (draggedItem.instanceId === props.instanceId) {
      props.onDropChoice(draggedItem, props.index);
    }
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();
    const canDrop = draggedItem.instanceId === props.instanceId;
    return canDrop;
  },
};

const DropTile = DropTarget('Tile', tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(StyledTile);

const tileSource = {
  canDrag(props) {
    return props.draggable && !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.id,
      type: props.type,
      instanceId: props.instanceId,
      value: props.label,
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  },
};

const DragDropTile = DragSource('Tile', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DropTile);

export default DragDropTile;
