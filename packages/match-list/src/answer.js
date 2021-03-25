import { DragSource, DropTarget } from 'react-dnd';

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import { PlaceHolder } from '@pie-lib/drag';
import isEmpty from 'lodash/isEmpty';
import { color } from '@pie-lib/render-ui';

const log = debug('pie-elements:match-title:answer');

const Holder = withStyles(() => ({
  number: {
    width: '100%',
    fontSize: '18px',
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)'
  },
  placeholder: {
    display: 'flex',
    padding: '0',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px'
  }
}))(({ classes, index, isOver, disabled }) => (
  <PlaceHolder
    className={classes.placeholder}
    disabled={disabled}
    isOver={isOver}
  >
    {index !== undefined && <div className={classes.number}>{index}</div>}
  </PlaceHolder>
));

Holder.propTypes = {
  index: PropTypes.number,
  isOver: PropTypes.bool,
  disabled: PropTypes.bool
};

const AnswerContent = withStyles({
  over: {
    opacity: 0.2
  },
  answerContent: {
    color: color.text(),
    backgroundColor: color.background(),
    border: '1px solid #c2c2c2', // TODO hardcoded color
    cursor: 'pointer',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    transition: 'opacity 200ms linear',
    wordBreak: 'break-word'
  },
  dragging: {
    opacity: 0.5
  },
  disabled: {
    backgroundColor: color.background(),
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  incorrect: {
    border: `1px solid ${color.incorrect()}`
  },
  correct: {
    border: `1px solid ${color.correct()}`
  }
})(props => {
  const {
    classes,
    isDragging,
    isOver,
    title,
    disabled,
    empty,
    outcome,
    guideIndex,
    type
  } = props;

  if (empty) {
    return (
      <Holder
        index={guideIndex}
        isOver={isOver}
        disabled={disabled}
        type={type}
      />
    );
  } else {
    const names = classNames(
      classes.answerContent,
      isDragging && !disabled && classes.dragging,
      isOver && !disabled && classes.over,
      disabled && classes.disabled,
      outcome && classes[outcome]
    );

    return (
      <div className={names} dangerouslySetInnerHTML={{ __html: title }} />
    );
  }
});

export class Answer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any,
    title: PropTypes.string,
    isOver: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    empty: PropTypes.bool,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    correct: PropTypes.bool
  };

  render() {
    const {
      id,
      title,
      isDragging,
      className,
      connectDragSource,
      connectDropTarget,
      disabled,
      classes,
      isOver,
      type,
      correct
    } = this.props;

    log('[render], props: ', this.props);

    const name = classNames(className, classes.answer, {
      [classes.correct]: correct === true,
      [classes.incorrect]: correct === false
    });

    const content = (
      <div className={name}>
        <AnswerContent
          title={title}
          id={id}
          isOver={isOver}
          empty={isEmpty(title)}
          isDragging={isDragging}
          disabled={disabled}
          type={type}
        />
      </div>
    );
    const droppable = connectDropTarget ? connectDropTarget(content) : content;

    return connectDragSource ? connectDragSource(droppable) : droppable;
  }
}

const StyledAnswer = withStyles({
  answer: {
    boxSizing: 'border-box',
    minHeight: 40,
    minWidth: '100px',
    overflow: 'hidden',
    margin: '10px 0',
    padding: '0px',
    textAlign: 'center'
  },
  incorrect: {
    border: `1px solid var(--feedback-incorrect-bg-color, ${color.incorrect()})`
  },
  correct: {
    border: `1px solid var(--feedback-correct-bg-color, ${color.correct()})`
  }
})(Answer);

const answerTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();

    if (draggedItem.instanceId === props.instanceId) {
      props.onPlaceAnswer(props.promptId, draggedItem.id);
    }
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  }
};

export const DropAnswer = DropTarget('Answer', answerTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(StyledAnswer);

const answerSource = {
  canDrag(props) {
    return props.draggable && !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.id,
      type: props.type,
      instanceId: props.instanceId
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  }
};

export const DragAnswer = DragSource('Answer', answerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(StyledAnswer);

const DragAndDropAnswer = DragSource('Answer', answerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DropAnswer);

export default DragAndDropAnswer;
