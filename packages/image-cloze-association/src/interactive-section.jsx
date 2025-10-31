import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { color } from '@pie-lib/render-ui';

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

  getPositionDirection(choicePosition) {
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
  }

  render() {
    const { children, responseCorrect, uiStyle } = this.props;
    const classname = this.getClassname();
    const { possibilityListPosition = 'bottom' } = uiStyle || {};
    const style = { flexDirection: this.getPositionDirection(possibilityListPosition) };
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
};

InteractiveSection.defaultProps = {
  classes: {},
  responseCorrect: undefined,
};

const styles = (theme) => {
  const baseInteractiveStyle = {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    width: 'fit-content',
  };

  return {
    interactiveDefault: {
      ...baseInteractiveStyle,
      border: `1px solid ${color.disabled()}`,
    },
    interactiveCorrect: {
      ...baseInteractiveStyle,
      border: `2px solid ${color.correct()}`,
    },
    interactiveIncorrect: {
      ...baseInteractiveStyle,
      border: `2px solid ${color.incorrect()}`,
    },
  };
};

export default withStyles(styles)(InteractiveSection);
