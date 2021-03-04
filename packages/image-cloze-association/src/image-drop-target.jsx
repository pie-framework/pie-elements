import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

import PossibleResponse from './possible-response';
import c from './constants';

const ImageDropTarget = ({
  answers,
  canDrag,
  classes,
  containerStyle,
  draggingElement,
  duplicateResponses,
  onDragAnswerBegin,
  onDragAnswerEnd,
  // dnd-related props
  connectDropTarget,
  isOverCurrent
}) => connectDropTarget(
  <div
    className={`
        ${classes.responseContainer}
        ${draggingElement.id ? classes.responseContainerActive : ''}
      `}
    style={containerStyle}
  >
    {/* HOVER */}
    {isOverCurrent && !duplicateResponses ? (
      <div className={classes.dragOverContainer}>
        <span dangerouslySetInnerHTML={{ __html: draggingElement.value }} />
      </div>
    ) : null}

    {/* EXISTING ANSWERS */}
    {(!isOverCurrent && answers.length) || (duplicateResponses && answers.length) ? (
      <div className={classes.answers}>
        {answers.map(answer => (
          <PossibleResponse
            canDrag={canDrag}
            containerStyle={answer.isCorrect === undefined ? { borderWidth: 0 } : {}}
            key={answer.id}
            data={answer}
            onDragBegin={() => onDragAnswerBegin(answer)}
            onDragEnd={onDragAnswerEnd}
          />
        ))}
      </div>
    ) : null}
  </div>
);

ImageDropTarget.propTypes = {
  answer: PropTypes.object,
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  containerStyle: PropTypes.object.isRequired,
  draggingElement: PropTypes.object.isRequired,
  onDragAnswerBegin: PropTypes.func.isRequired,
  onDragAnswerEnd: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

ImageDropTarget.defaultProps = {
  answer: {},
  classes: {}
};

const styles = () => ({
  answers: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dragOverContainer: {
    backgroundColor: color.background(),
    pointerEvents: 'none',
    width: 'fit-content'
  },
  responseContainer: {
    position: 'absolute'
  },
  responseContainerActive: {
    border: `2px solid ${color.text()}`,
    backgroundColor: 'rgba(230, 242, 252, .8)'
  }
});

const Styled = withStyles(styles)(ImageDropTarget);

const tileSource = {
  hover(props, monitor) {
    monitor.isOver({ shallow: true });
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    props.onDrop(item);
  }
};

export default DropTarget(c.types.response, tileSource, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(Styled);
