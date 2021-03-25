import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/render-ui';

import EvaluationIcon from './evaluation-icon';

class InteractiveSection extends React.Component {
  getClassname() {
    const { classes, responseCorrect } = this.props;
    let styleProp;

    switch (responseCorrect) {
      case undefined:
        styleProp = 'interactiveDefault'; break;
      case true:
        styleProp = 'interactiveCorrect'; break;
      default:
        styleProp = 'interactiveIncorrect'; break;
    }
    return classes[styleProp];
  }

  render() {
    const { children, responseCorrect } = this.props;
    const classname = this.getClassname();
    const evaluationStyle = {
      display: 'flex',
      margin: '0 auto',
      marginTop: -14
    };

    return (
      <div className={classname}>
        <EvaluationIcon
          containerStyle={evaluationStyle}
          filled
          isCorrect={responseCorrect}
        />
        {children}
      </div>
    );
  }
}

InteractiveSection.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]).isRequired,
  responseCorrect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ])
};

InteractiveSection.defaultProps = {
  classes: {},
  responseCorrect: undefined
};

const styles = () => ({
  interactiveDefault: {
    border: `1px solid ${color.disabled()}`
  },
  interactiveCorrect: {
    border: `2px solid ${color.correct()}`
  },
  interactiveIncorrect: {
    border: `2px solid ${color.incorrect()}`
  }
});

export default withStyles(styles)(InteractiveSection);
