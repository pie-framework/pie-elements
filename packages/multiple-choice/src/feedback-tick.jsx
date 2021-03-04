import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

const stylesheet = {
  incorrect: {
    fill: `var(--feedback-incorrect-bg-color, ${color.incorrect()})`,
  },
  correct: {
    fill: `var(--feedback-correct-bg-color, ${color.correct()})`,
  },
  feedbackTick: {
    width: '33px',
    height: '33px',
    '& svg': {
      position: 'absolute',
      display: 'inline-block',
      width: '33px',
      height: '33px',
      verticalAlign: 'middle',
      '& hide': {
        display: 'none',
      },
    },
  },
  feedbackTickEnter: {
    opacity: '0',
    left: '-50px',
  },
  feedbackTickEnterActive: {
    opacity: '1',
    left: '0px',
    transition: 'left 500ms ease-in 200ms, opacity 500ms linear 200ms',
  },
  feedbackTickLeave: {
    opacity: '1',
    left: '0px',
  },
  feedbackTickLeaveActive: {
    opacity: '0',
    left: '-50px',
    transition: 'left 300ms ease-in, opacity 300ms',
  },
};

class FeedbackTick extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    correctness: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.incorrectIcon = (
      <svg
        key="1"
        preserveAspectRatio="xMinYMin meet"
        x="0px"
        y="0px"
        viewBox="0 0 44 40"
        style={{ enableBackground: 'new 0 0 44 40' }}
      >
        <g>
          <rect
            x="11"
            y="17.3"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.852 19.2507)"
            className={this.props.classes.incorrect}
            width="16.6"
            height="3.7"
          />
          <rect
            x="17.4"
            y="10.7"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.8175 19.209)"
            className={this.props.classes.incorrect}
            width="3.7"
            height="16.6"
          />
        </g>
      </svg>
    );

    this.correctIcon = (
      <svg
        key="2"
        preserveAspectRatio="xMinYMin meet"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 44 40"
        style={{ enableBackground: 'new 0 0 44 40' }}
      >
        <polygon
          className={this.props.classes.correct}
          points="19.1,28.6 11.8,22.3 14.4,19.2 17.9,22.1 23.9,11.4 27.5,13.4"
        />
      </svg>
    );
  }

  render() {
    const { correctness, classes } = this.props;

    const icon = (() => {
      if (correctness === 'incorrect') {
        return this.incorrectIcon;
      } else if (correctness === 'correct') {
        return this.correctIcon;
      }
    })();

    return (
      <div className={classes.feedbackTick}>
        <TransitionGroup>
          {correctness && (
            <CSSTransition
              classNames={{
                enter: classes.feedbackTickEnter,
                enterActive: classes.feedbackTickEnterActive,
                exit: classes.feedbackTickLeave,
                exitActive: classes.feedbackTickLeaveActive,
              }}
              timeout={{ enter: 700, exit: 300 }}
            >
              {icon}
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    );
  }
}

export default withStyles(stylesheet, { name: 'FeedbackTick' })(FeedbackTick);
