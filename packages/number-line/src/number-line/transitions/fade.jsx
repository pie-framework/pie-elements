import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const duration = 200;
const classPrefix = 'fade-transition';

const fadeStyles = `
  .${classPrefix}-appear {
    opacity: 0;
  }
  .${classPrefix}-appear-active {
    opacity: 1;
    transition: opacity ${duration}ms ease-in;
  }
  .${classPrefix}-enter {
    opacity: 0;
  }
  .${classPrefix}-enter-active {
    opacity: 1;
    transition: opacity ${duration}ms ease-in;
  }
  .${classPrefix}-exit {
    opacity: 1;
  }
  .${classPrefix}-exit-active {
    opacity: 0;
    transition: opacity ${duration}ms ease-in;
  }
`;

const FadeTransition = (props) => {
  useEffect(() => {
    // Inject styles if not already present
    if (!document.getElementById(`${classPrefix}-styles`)) {
      const style = document.createElement('style');
      style.id = `${classPrefix}-styles`;
      style.textContent = fadeStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <CSSTransition
      {...props}
      appear={true}
      classNames={{
        enter: `${classPrefix}-enter`,
        enterActive: `${classPrefix}-enter-active`,
        exit: `${classPrefix}-exit`,
        exitActive: `${classPrefix}-exit-active`,
        appear: `${classPrefix}-appear`,
        appearActive: `${classPrefix}-appear-active`,
      }}
      timeout={duration}
    />
  );
};

FadeTransition.propTypes = {
  // CSSTransition props
  children: PropTypes.node,
  in: PropTypes.bool,
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  appear: PropTypes.bool,
  enter: PropTypes.bool,
  exit: PropTypes.bool,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    enter: PropTypes.number,
    exit: PropTypes.number,
  })]),
  addEndListener: PropTypes.func,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
};

export default FadeTransition;
