import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { DragSource } from '@pie-lib/pie-toolbox/drag';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import { PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';

import EvaluationIcon from './evaluation-icon';
import c from './constants';

export class PossibleResponse extends React.Component {
  render() {
    const { classes, connectDragSource, containerStyle, data, answerChoiceTransparency } = this.props;
    const { isCorrect } = data || {};
    const evaluationStyle = {
      fontSize: 14,
      position: 'absolute',
      bottom: '3px',
      right: '3px',
    };
    let correctnessClass;

    if (isCorrect === true) {
      correctnessClass = 'baseCorrect';
    } else if (isCorrect === false) {
      correctnessClass = 'baseIncorrect';
    }

    return connectDragSource(
      <div
        className={classNames([
          classes.base,
          {
            [classes.answerChoiceTransparency]: answerChoiceTransparency,
            [classes[correctnessClass]]: !!correctnessClass,
          },
        ])}
        style={containerStyle}
      >
        <PreviewPrompt
          className={classNames([classes.span, { [classes.hiddenSpan]: data.hidden }])}
          prompt={data.value}
          tagName="span"
        />
        <EvaluationIcon isCorrect={data.isCorrect} containerStyle={evaluationStyle} />
      </div>,
    );
  }
}

PossibleResponse.propTypes = {
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  connectDragSource: PropTypes.func,
  containerStyle: PropTypes.object,
  data: PropTypes.object.isRequired,
  onDragBegin: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  answerChoiceTransparency: PropTypes.bool,
};

PossibleResponse.defaultProps = {
  classes: {},
  connectDragSource: () => {},
  containerStyle: {},
};

const styles = () => ({
  base: {
    position: 'relative',
    backgroundColor: color.white(),
    border: `1px solid ${color.borderDark()}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '28px',
    width: 'fit-content',
  },
  answerChoiceTransparency: {
    border: 'none',
    backgroundColor: `${color.transparent()}`,

    '&:hover': {
      border: `1px solid ${color.borderDark()}`,
    },
  },
  baseCorrect: {
    border: `2px solid ${color.correct()} !important`,
  },
  baseIncorrect: {
    border: `2px solid ${color.incorrect()} !important`,
  },
  span: {
    backgroundColor: color.background(),
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    // If interactions with the image in the token will be requested we should handle only the context Menu.
    pointerEvents: 'none',
  },
  hiddenSpan: {
    visibility: 'hidden',
  },
});

const Styled = withStyles(styles)(PossibleResponse);

const tileSource = {
  canDrag(props) {
    const { canDrag } = props;
    return canDrag;
  },
  beginDrag(props) {
    const {
      data,
      data: { id, value, containerIndex },
      onDragBegin,
    } = props;
    onDragBegin(data);
    return {
      id,
      value,
      containerIndex,
    };
  },
  endDrag(props) {
    props.onDragEnd();
  },
};

export default DragSource(c.types.response, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Styled);
