import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from '@pie-lib/pie-toolbox/drag';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import cx from 'classnames';

import PossibleResponse from './possible-response';
import c from './constants';

class ImageDropTarget extends React.Component {
  state = {
    shouldHaveSmallPadding: false,
  }

  render() {
    const {
      answers,
      canDrag,
      classes,
      containerStyle,
      draggingElement,
      onDragAnswerBegin,
      onDragAnswerEnd,
      showDashedBorder,
      responseAreaFill,
      responseContainerPadding,
      imageDropTargetPadding,
      // dnd-related props
      connectDropTarget,
      answerChoiceTransparency,
      maxResponsePerZone,
    } = this.props;
    const { shouldHaveSmallPadding } = this.state;

    const containerClasses = cx(classes.responseContainer, {
      [classes.responseContainerDashed]: showDashedBorder && !draggingElement.id,
      [classes.responseContainerActive]: !!draggingElement.id,
    });

    const updatedContainerStyle = {
      padding: maxResponsePerZone === 1 ? '0' : responseContainerPadding,
      ...containerStyle,
      ...(responseAreaFill && { backgroundColor: responseAreaFill })
    };

    return connectDropTarget(
      <div
        className={containerClasses}
        style={updatedContainerStyle}
        ref={ref => {
          this.dropContainerHeight = ref?.getBoundingClientRect().height;

          // If answers area is higher than the initial established response zone,
          // then make sure to use a smaller padding.
          // Only reset the state if needed to prevent maximum callstack exceeded
          if (this.dropContainerHeight < this.dropContainerResponsesHeight && !shouldHaveSmallPadding) {
            this.setState({ shouldHaveSmallPadding: true });
          }
        }}
      >
        {answers.length ? (
          <div
            className={classes.answers}
            ref={ref => {
              this.dropContainerResponsesHeight = ref?.getBoundingClientRect().height;
            }}
          >
            {answers.map((answer) => (
              <PossibleResponse
                key={answer.id}
                data={answer}
                canDrag={canDrag}
                onDragBegin={() => onDragAnswerBegin(answer)}
                onDragEnd={onDragAnswerEnd}
                answerChoiceTransparency={answerChoiceTransparency}
                containerStyle={{
                  padding: imageDropTargetPadding
                    ? imageDropTargetPadding
                    : shouldHaveSmallPadding
                      ? '2px'
                      : '6px 10px',
                }}
              />
            ))}
          </div>
        ) : null}
      </div>,
    );
  }
}

ImageDropTarget.propTypes = {
  answer: PropTypes.object,
  answers: PropTypes.array,
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  containerStyle: PropTypes.object.isRequired,
  draggingElement: PropTypes.object.isRequired,
  onDragAnswerBegin: PropTypes.func.isRequired,
  onDragAnswerEnd: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  showDashedBorder: PropTypes.bool,
  responseAreaFill: PropTypes.string,
  answerChoiceTransparency: PropTypes.bool,
  responseContainerPadding: PropTypes.string,
  imageDropTargetPadding: PropTypes.string,
  maxResponsePerZone: PropTypes.number,
};

ImageDropTarget.defaultProps = {
  answer: {},
  classes: {},
  responseContainerPadding: '10px',
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
    boxSizing: 'border-box'
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
