import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { DragSource } from '@pie-lib/drag';
import { color } from '@pie-lib/render-ui';
import ReactDOM from 'react-dom';

import EvaluationIcon from './evaluation-icon';
import c from './constants';
import StaticHTMLSpan from './static-html-span';

export class PossibleResponse extends React.Component {
  handleTouchEnd = () => {
    clearTimeout(this.longPressTimer);
  };

  handleTouchMove = () => {
    clearTimeout(this.longPressTimer);
  };

  handleTouchStart = (e) => {
    e.preventDefault();
    this.longPressTimer = setTimeout(() => {
      this.startDrag();
    }, 500); // start drag after 500ms (touch and hold duration) for chromebooks and other touch devices
  };

  componentDidMount() {
    if (this.rootRef) {
      this.rootRef.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      this.rootRef.addEventListener('touchend', this.handleTouchEnd);
      this.rootRef.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    }
  }

  componentWillUnmount() {
    if (this.rootRef) {
      this.rootRef.removeEventListener('touchstart', this.handleTouchStart);
      this.rootRef.removeEventListener('touchend', this.handleTouchEnd);
      this.rootRef.removeEventListener('touchmove', this.handleTouchMove);
    }
  }

  startDrag = () => {
    const { connectDragSource, disabled } = this.props;
    if (!disabled) {
      connectDragSource(this.rootRef);
    }
  };

  render() {
    const { classes, connectDragSource, containerStyle, data, answerChoiceTransparency } = this.props;
    const { isCorrect } = data || {};
    const evaluationStyle = {
      fontSize: 14,
      position: 'absolute',
      bottom: '3px',
      right: '3px',
    };
    const correctnessClass = isCorrect === true ? 'baseCorrect' : isCorrect === false ? 'baseIncorrect' : undefined;

    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const containsImage = imgRegex.test(data.value);

    const containerClassNames = classNames([
      classes.base,
      {
        [classes.answerChoiceTransparency]: answerChoiceTransparency,
        [classes[correctnessClass]]: !!correctnessClass,
        [classes.textAnswerChoiceStyle]: !containsImage,
      },
    ]);

    const promptClassNames = classNames([classes.span, { [classes.hiddenSpan]: data.hidden }]);

    return connectDragSource(
      <div
        className={containerClassNames}
        style={containerStyle}
        ref={(ref) => {
          //eslint-disable-next-line
          this.rootRef = ReactDOM.findDOMNode(ref);
        }}
      >
        <StaticHTMLSpan html={data.value} className={promptClassNames} />
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
    '& span img': {
      // Added for touch devices, for image content.
      // This will prevent the context menu from appearing and not allowing other interactions with the image.
      // If interactions with the image in the token will be requested we should handle only the context Menu.
      pointerEvents: 'none',
    },
  },
  textAnswerChoiceStyle: {
    padding: '0 10px',
    margin: '4px 6px !important',
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
