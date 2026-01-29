import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

const FeedbackTickContainer = styled(Box)({
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
});

const StyledSVG = styled('svg')({
  '& .incorrect-fill': {
    fill: `var(--feedback-incorrect-bg-color, ${color.incorrect()})`,
  },
  '& .correct-fill': {
    fill: `var(--feedback-correct-bg-color, ${color.correct()})`,
  },
});

const TransitionWrapper = styled('div')({
  position: 'relative',
  '&.feedback-tick-enter': {
    opacity: '0',
    left: '-50px',
  },
  '&.feedback-tick-enter-active': {
    opacity: '1',
    left: '0px',
    transition: 'left 500ms ease-in 200ms, opacity 500ms linear 200ms',
  },
  '&.feedback-tick-exit': {
    opacity: '1',
    left: '0px',
  },
  '&.feedback-tick-exit-active': {
    opacity: '0',
    left: '-50px',
    transition: 'left 300ms ease-in, opacity 300ms',
  },
});

class FeedbackTick extends React.Component {
  static propTypes = {
    correctness: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.nodeRef = React.createRef();
  }

  getIncorrectIcon = () => (
    <StyledSVG
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
          className="incorrect-fill"
          width="16.6"
          height="3.7"
        />
        <rect
          x="17.4"
          y="10.7"
          transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.8175 19.209)"
          className="incorrect-fill"
          width="3.7"
          height="16.6"
        />
      </g>
    </StyledSVG>
  );

  getCorrectIcon = () => (
    <StyledSVG
      key="2"
      preserveAspectRatio="xMinYMin meet"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 44 40"
      style={{ enableBackground: 'new 0 0 44 40' }}
    >
      <polygon
        className="correct-fill"
        points="19.1,28.6 11.8,22.3 14.4,19.2 17.9,22.1 23.9,11.4 27.5,13.4"
      />
    </StyledSVG>
  );

  render() {
    const { correctness } = this.props;

    const icon = (() => {
      if (correctness === 'incorrect') {
        return this.getIncorrectIcon();
      } else if (correctness === 'correct') {
        return this.getCorrectIcon();
      }
      return null;
    })();

    return (
      <FeedbackTickContainer>
        <TransitionGroup>
          {correctness && (
            <CSSTransition
              nodeRef={this.nodeRef}
              classNames={{
                enter: 'feedback-tick-enter',
                enterActive: 'feedback-tick-enter-active',
                exit: 'feedback-tick-exit',
                exitActive: 'feedback-tick-exit-active',
              }}
              timeout={{ enter: 700, exit: 300 }}
            >
              <TransitionWrapper ref={this.nodeRef}>{icon}</TransitionWrapper>
            </CSSTransition>
          )}
        </TransitionGroup>
      </FeedbackTickContainer>
    );
  }
}

export default FeedbackTick;
