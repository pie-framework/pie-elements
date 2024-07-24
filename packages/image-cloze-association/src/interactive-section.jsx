import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/pie-toolbox/render-ui';

import EvaluationIcon from './evaluation-icon';

class InteractiveSection extends React.Component {
  getClassname() {
    const { classes, responseCorrect } = this.props;
    let styleProp;

    switch (responseCorrect) {
      case undefined:
        styleProp = 'interactiveDefault';
        break;
      case true:
        styleProp = 'interactiveCorrect';
        break;
      default:
        styleProp = 'interactiveIncorrect';
        break;
    }
    return classes[styleProp];
  }

  getPositionDirection (choicePosition) {
    let flexDirection;

    switch (choicePosition) {
      case 'left':
        flexDirection = 'row-reverse';
        break;
      case 'right':
        flexDirection = 'row';
        break;
      case 'top':
        flexDirection = 'column-reverse';
        break;
      default:
        // bottom
        flexDirection = 'column';
        break;
    }

    return flexDirection;
  };

  render() {
    const { children, responseCorrect, uiStyle, choicesPosition } = this.props;
    const classname = this.getClassname();
    const { possibilityListPosition } = uiStyle || {};

    const position = possibilityListPosition || choicesPosition;

    const style = {
      flexDirection: this.getPositionDirection(position),
    };
    const evaluationStyle = {
      display: 'flex',
      margin: '0 auto',
      marginTop: -14,
    };

    return (
      <div className={classname} style={style}>
        <EvaluationIcon containerStyle={evaluationStyle} filled isCorrect={responseCorrect} />
        {children}
      </div>
    );
  }
}

InteractiveSection.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  responseCorrect: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  uiStyle: PropTypes.object,
  choicesPosition: PropTypes.string
};

InteractiveSection.defaultProps = {
  classes: {},
  responseCorrect: undefined,
};

const styles = (theme) => ({
  interactiveDefault: {
    marginTop: theme.spacing.unit * 2,
    border: `1px solid ${color.disabled()}`,
    display: 'flex',
  },
  interactiveCorrect: {
    marginTop: theme.spacing.unit * 2,
    border: `2px solid ${color.correct()}`,
    display: 'flex',
  },
  interactiveIncorrect: {
    marginTop: theme.spacing.unit * 2,
    border: `2px solid ${color.incorrect()}`,
    display: 'flex',
  },
});

export default withStyles(styles)(InteractiveSection);
