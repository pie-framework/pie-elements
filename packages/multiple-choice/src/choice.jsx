import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import ChoiceInput from './choice-input';

export class Choice extends React.Component {
  static propTypes = {};

  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    const { disabled, checked } = this.props;

    if (!disabled && !checked) {
      this.setState({ isHovered: true });
    }
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  onChange = (choice) => {
    const { disabled, onChoiceChanged } = this.props;

    if (!disabled) {
      onChoiceChanged(choice);
    }
  };

  render() {
    const {
      choice,
      index,
      choicesLength,
      showCorrect,
      isEvaluateMode,
      choiceMode,
      disabled,
      checked,
      correctness,
      displayKey,
      classes,
      choicesLayout,
      gridColumns,
      isSelectionButtonBelow,
      selectedAnswerBackgroundColor,
      selectedAnswerStrokeColor,
      selectedAnswerStrokeWidth,
      hoverAnswerBackgroundColor,
      hoverAnswerStrokeColor,
      hoverAnswerStrokeWidth,
      autoFocusRef,
      tagName
    } = this.props;
    
    const { isHovered } = this.state;
    const choiceClass = 'choice' + (index === choicesLength - 1 ? ' last' : '');

    const feedback = !isEvaluateMode || showCorrect ? '' : choice.feedback;

    const choiceProps = {
      ...choice,
      checked,
      choiceMode,
      disabled,
      feedback,
      correctness,
      displayKey,
      index,
      choicesLayout,
      gridColumns,
      onChange: this.onChange,
      isEvaluateMode,
      isSelectionButtonBelow,
      selectedAnswerStrokeColor,
      selectedAnswerStrokeWidth,
      tagName,
    };

    const normalizeStrokeWidth = (width) => {
      if (!width) return '2px'; // default
      const trimmed = String(width).trim();
    
      // add 'px' if the value is a number
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        return `${trimmed}px`;
      }

      return trimmed;
    };

    const hasSelectedStroke = selectedAnswerStrokeColor && selectedAnswerStrokeColor !== 'initial';
    const hasHoverStroke = hoverAnswerStrokeColor && hoverAnswerStrokeColor !== 'initial';
    
    let currentStrokeColor = 'transparent';
    let currentStrokeWidth = '2px';
    let currentBackgroundColor = 'initial';
    
    if ((hasSelectedStroke || hasHoverStroke)) {
      if (checked && hasSelectedStroke) {
        // selected state takes priority when selected stroke is configured
        currentStrokeColor = selectedAnswerStrokeColor;
        currentStrokeWidth = selectedAnswerStrokeWidth;
      } else if (isHovered && !disabled && hasHoverStroke) {
        // hover state when not selected and not disabled, and hover stroke is configured
        currentStrokeColor = hoverAnswerStrokeColor;
        currentStrokeWidth = hoverAnswerStrokeWidth;
      }
    }
    
    if (checked && selectedAnswerBackgroundColor && selectedAnswerBackgroundColor !== 'initial') {
      currentBackgroundColor = selectedAnswerBackgroundColor;
    } else if (isHovered && !disabled && hoverAnswerBackgroundColor && hoverAnswerBackgroundColor !== 'initial') {
      currentBackgroundColor = hoverAnswerBackgroundColor;
    }

     const strokeStyle = (hasSelectedStroke || hasHoverStroke) ? {
      border: `${normalizeStrokeWidth(currentStrokeWidth)} solid ${currentStrokeColor}`,
      borderRadius: '8px',
    } : {};

    const names = classNames(classes.choice, {
      [classes.noBorder]: index === choicesLength - 1 || choicesLayout !== 'vertical' || strokeStyle,
      [classes.horizontalLayout]: choicesLayout === 'horizontal',
    });

    const choiceBackground = currentBackgroundColor !== 'initial' ? currentBackgroundColor : 'initial';

    return (
      <div 
        className={choiceClass} 
        key={index} 
        style={{ backgroundColor: choiceBackground, ...strokeStyle }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <ChoiceInput {...choiceProps} className={names} autoFocusRef={autoFocusRef} />
      </div>
    );
  }
}

Choice.propTypes = {
  choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
  choice: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  onChoiceChanged: PropTypes.func,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  choicesLength: PropTypes.number,
  showCorrect: PropTypes.bool,
  isEvaluateMode: PropTypes.bool,
  checked: PropTypes.bool,
  correctness: PropTypes.string,
  displayKey: PropTypes.string,
  choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
  gridColumns: PropTypes.string,
  selectedAnswerBackgroundColor: PropTypes.string,
  selectedAnswerStrokeColor: PropTypes.string,
  selectedAnswerStrokeWidth: PropTypes.string,
  hoverAnswerBackgroundColor: PropTypes.string,
  hoverAnswerStrokeColor: PropTypes.string,
  hoverAnswerStrokeWidth: PropTypes.string,
  tagName: PropTypes.string,
  isSelectionButtonBelow: PropTypes.bool,
  autoFocusRef: PropTypes.object,
};

export default withStyles((theme) => ({
  choice: {
    paddingTop: theme.spacing.unit * 2.5,
    paddingBottom: theme.spacing.unit + 2,
    paddingLeft: theme.spacing.unit + 2,
    paddingRight: theme.spacing.unit + 2,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  noBorder: {
    borderBottom: 'none',
  },
  horizontalLayout: {
    paddingRight: theme.spacing.unit * 2.5,
    '& label': {
      marginRight: theme.spacing.unit,
      // '& span:first-child': {
      //   paddingRight: 0
      // }
    },
  },
}))(Choice);
