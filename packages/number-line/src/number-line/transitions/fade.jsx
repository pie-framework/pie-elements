import injectSheet from 'react-jss';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const duration = 200;
const fade = {
  appear: {
    opacity: 0
  },
  appearActive: {
    opacity: 1,
    transition: `opacity ${duration}ms ease-in`
  },
  enter: {
    opacity: 0
  },
  enterActive: {
    opacity: 1,
    transition: `opacity ${duration}ms ease-in`
  },
  exit: {
    opacity: 1
  },
  exitActive: {
    opacity: 0,
    transition: `opacity ${duration}ms ease-in`
  }
};

const FadeTransition = props => {
  const { classes } = props;
  return (
    <CSSTransition
      {...props}
      appear={true}
      classNames={{
        enter: classes.enter,
        enterActive: classes.enterActive,
        exit: classes.exit,
        exitActive: classes.exitActive,
        appear: classes.appear,
        appearActive: classes.appearActive
      }}
      timeout={duration}
    />
  );
};

FadeTransition.propTypes = {
  classes: PropTypes.object.isRequired
};

const Fade = injectSheet(fade)(FadeTransition);

export default Fade;
