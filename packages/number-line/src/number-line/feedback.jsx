import {
  Correct,
  Incorrect,
  NothingSubmitted,
  PartiallyCorrect,
  ShowRationale
} from '@pie-lib/icons';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import injectSheet from 'react-jss';

let getIcon = t => {
  switch (t) {
    case 'unanswered':
      return NothingSubmitted;
    case 'correct':
      return Correct;
    case 'incorrect':
      return Incorrect;
    case 'partial':
      return PartiallyCorrect;
    case 'info':
      return ShowRationale;
    default:
      return undefined;
  }
};

const Feedback = props => {
  const { classes, type } = props;
  let className = classNames(classes[type], classes.feedback);
  let Icon = getIcon(props.type);

  return (
    <TransitionGroup>
      <CSSTransition classNames={'fb'} key="fb" timeout={300}>
        <div key="panel" className={className} style={{ width: props.width }}>
          <Icon iconSet="emoji" shape="square" />
          <span
            className={classes.message}
            dangerouslySetInnerHTML={{ __html: props.message }}
          />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

Feedback.propTypes = {
  width: PropTypes.number,
  message: PropTypes.string,
  classes: PropTypes.object.isRequired,
  type: PropTypes.string
};

const styles = {
  feedback: {
    marginTop: '10px',
    backgroundColor: '#dddddd',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      height: '30px'
    },
    '& h1': {
      padding: '0px',
      margin: '0px'
    }
  },
  message: {
    paddingLeft: '5px',
    userSelect: 'none'
  },
  correct: {
    backgroundColor: color.correct()
  },
  incorrect: {
    backgroundColor: color.incorrect()
  }
};

export default injectSheet(styles)(Feedback);
