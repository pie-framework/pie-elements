import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from '@pie-lib/pie-toolbox/drag';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import cx from 'classnames';

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
  showDashedBorder,
  responseAreaFill,
  // dnd-related props
  connectDropTarget,
}) => {

  const containerClasses = cx(classes.responseContainer, {
    [classes.responseContainerDashed]: showDashedBorder && !draggingElement.id,
    [classes.responseContainerActive]: draggingElement.id,
  });

  const updatedContainerStyle = {
    ...containerStyle,
    ...(responseAreaFill ? { backgroundColor: responseAreaFill } : {})
  };

  return connectDropTarget(
    <div
      className={containerClasses}
      style={updatedContainerStyle}
    >
      {answers.length || (duplicateResponses && answers.length) ? (
        <div className={classes.answers}>
          {(answers || []).map((answer) => (
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
    </div>,
  );
}

ImageDropTarget.propTypes = {
  answer: PropTypes.object,
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  containerStyle: PropTypes.object.isRequired,
  draggingElement: PropTypes.object.isRequired,
  onDragAnswerBegin: PropTypes.func.isRequired,
  onDragAnswerEnd: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  showDashedBorder: PropTypes.bool,
  responseAreaFill: PropTypes.string
};

ImageDropTarget.defaultProps = {
  answer: {},
  classes: {},
};

const styles = () => ({
  answers: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dragOverContainer: {
    backgroundColor: color.background(),
    pointerEvents: 'none',
    width: 'fit-content',
  },
  responseContainer: {
    position: 'absolute',
  },
  responseContainerActive: {
    border: `2px solid ${color.text()}`,
    backgroundColor: 'rgba(230, 242, 252, .8)',
  },
  responseContainerDashed: {
    border: `2px dashed ${color.text()}`,
  },
});

const Styled = withStyles(styles)(ImageDropTarget);

const tileSource = {
  hover(props, monitor) {
    monitor.isOver({ shallow: true });
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    props.onDrop(item);
  },
};

export default DropTarget(c.types.response, tileSource, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem(),
}))(Styled);
