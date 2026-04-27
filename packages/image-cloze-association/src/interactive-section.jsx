import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

import EvaluationIcon from './evaluation-icon';

const StyledContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  width: 'fit-content',
  '&.default': {
    border: `1px solid ${color.disabled()}`,
  },
  '&.correct': {
    border: `2px solid ${color.correct()}`,
  },
  '&.incorrect': {
    border: `2px solid ${color.incorrect()}`,
  },
}));

class InteractiveSection extends React.Component {
  getClassname() {
    const { responseCorrect } = this.props;
    let styleProp;

    switch (responseCorrect) {
      case undefined:
        styleProp = 'default';
        break;
      case true:
        styleProp = 'correct';
        break;
      default:
        styleProp = 'incorrect';
        break;
    }
    return styleProp;
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
      <StyledContainer className={classname} style={style}>
        <EvaluationIcon containerStyle={evaluationStyle} filled isCorrect={responseCorrect} />
        {children}
      </StyledContainer>
    );
  }
}

InteractiveSection.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  responseCorrect: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  uiStyle: PropTypes.object,
};

InteractiveSection.defaultProps = {
  responseCorrect: undefined,
};

export default InteractiveSection;
