import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { Feedback, color, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import Radio from '@material-ui/core/Radio';
import classNames from 'classnames';

import FeedbackTick from './feedback-tick';

const CLASS_NAME = 'multiple-choice-component';

const styleSheet = (theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.background(),
  },
  checkboxHolder: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.background(),
    flex: 1,
    '& label': {
      color: color.text(),
      '& > span': {
        fontSize: 'inherit',
      },
    },
  },
  horizontalLayout: {
    [`& .${CLASS_NAME}`]: {
      // visually reduce right padding, but maintain accessibility padding for checkbox indicators to be circles
      // add margin to the top, left and bottom of the checkbox to keep the same spacing as before
      padding: theme.spacing.unit,
      margin: `${theme.spacing.unit / 2}px 0 ${theme.spacing.unit / 2}px ${theme.spacing.unit / 2}px`,
    },
  },
  belowLayout: {
    '& > label': {
      alignItems: 'flex-start',
    },
  },
  belowLayoutCenter: {
    justifyContent: 'center',
    '& > label': {
      alignItems: 'center',
    },
  },
  belowSelectionComponent: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      // visually reduce right padding, but maintain accessibility padding for checkbox indicators to be circles
      marginLeft: `-${theme.spacing.unit}px`,
    },
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
});

const formStyleSheet = {
  label: {
    color: `${color.text()} !important`, //'var(--choice-input-color, black)'
    backgroundColor: color.background(),
    letterSpacing: 'normal',
  },
  disabled: {
    // apply to all children
    '& *': {
      cursor: 'not-allowed !important',
    },
  },
};

export const StyledFormControlLabel = withStyles(formStyleSheet, {
  name: 'FormControlLabel',
})((props) => (
  <FormControlLabel {...props} classes={{ label: props.classes.label, disabled: props.classes.disabled }} />
));

const colorStyle = (varName, fallback) => ({
  [`&.${CLASS_NAME}`]: {
    color: `var(--choice-input-${varName}, ${fallback}) !important`,
  },
});

const inputStyles = {
  'correct-root': colorStyle('correct-color', color.text()),
  'correct-checked': colorStyle('correct-selected-color', color.correct()), //green[500]),
  'correct-disabled': colorStyle('correct-disabled-color', color.disabled()), //'grey'),
  'incorrect-root': colorStyle('incorrect-color', color.incorrect()),
  'incorrect-checked': colorStyle('incorrect-checked', color.incorrect()), //orange[500]),
  'incorrect-disabled': colorStyle('incorrect-disabled-color', color.disabled()),
  root: {
    ...colorStyle('color', color.text()),
    '&:hover': { color: `${color.primaryLight()} !important` },
  },
  checked: colorStyle('selected-color', color.primary()),
  disabled: {
    ...colorStyle('disabled-color', color.text()),
    opacity: 0.6,
    cursor: 'not-allowed !important',
    pointerEvents: 'initial !important',
  },
  focusVisibleUnchecked: {
    outline: `1px solid ${color.focusUncheckedBorder()}`,
    backgroundColor: color.focusUnchecked(),
  },
  focusVisibleChecked: {
    outline: `1px solid ${color.focusCheckedBorder()}`,
    backgroundColor: color.focusChecked(),
  },
};

export const StyledCheckbox = withStyles(inputStyles)((props) => {
  const { correctness, classes, checked, onChange, disabled, value, id } = props;
  const key = (k) => (correctness ? `${correctness}-${k}` : k);

  const resolved = {
    root: classes[key('root')],
    checked: classes[key('checked')],
    disabled: classes[key('disabled')],
  };

  const miniProps = { checked, onChange, disabled, value };

  return (
    <Checkbox
      id={id}
      aria-checked={checked}
      focusVisibleClassName={checked ? classes.focusVisibleChecked : classes.focusVisibleUnchecked}
      disableRipple
      {...miniProps}
      className={CLASS_NAME}
      classes={{
        root: resolved.root,
        checked: resolved.checked,
        disabled: `${correctness ? '' : resolved.disabled}`,
      }}
    />
  );
});

export const StyledRadio = withStyles(inputStyles)((props) => {
  const { correctness, classes, checked, onChange, disabled, value, id } = props;
  const key = (k) => (correctness ? `${correctness}-${k}` : k);

  const resolved = {
    root: classes[key('root')],
    checked: classes[key('checked')],
    disabled: classes[key('disabled')],
  };

  const miniProps = { checked, onChange, disabled, value };

  return (
    <Radio
      id={id}
      aria-checked={checked}
      focusVisibleClassName={checked ? classes.focusVisibleChecked : classes.focusVisibleUnchecked}
      disableRipple
      {...miniProps}
      className={CLASS_NAME}
      classes={{
        root: resolved.root,
        checked: resolved.checked,
        disabled: `${correctness ? '' : resolved.disabled}`,
      }}
    />
  );
});

export class ChoiceInput extends React.Component {
  static propTypes = {
    choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
    displayKey: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    correctness: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    feedback: PropTypes.string,
    label: PropTypes.string.isRequired,
    rationale: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    hideTick: PropTypes.bool,
    isEvaluateMode: PropTypes.bool,
    choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
    isSelectionButtonBelow: PropTypes.bool,
  };

  static defaultProps = {
    rationale: null,
    checked: false,
    isEvaluateMode: false,
  };

  constructor(props) {
    super(props);
    this.onToggleChoice = this.onToggleChoice.bind(this);
    this.choiceId = this.generateChoiceId();
    this.descId = `${this.choiceId}-desc`;
  }

  onToggleChoice(event) {
    this.props.onChange(event);
  }

  generateChoiceId() {
    return 'choice-' + (Math.random() * 10000).toFixed();
  }

  render() {
    const {
      choiceMode,
      disabled,
      displayKey,
      feedback,
      label,
      correctness,
      classes,
      className,
      rationale,
      hideTick,
      isEvaluateMode,
      choicesLayout,
      value,
      checked,
      isSelectionButtonBelow,
    } = this.props;

    const Tag = choiceMode === 'checkbox' ? StyledCheckbox : StyledRadio;
    const classSuffix = choiceMode === 'checkbox' ? 'checkbox' : 'radio-button';

    const holderClassNames = classNames(classes.checkboxHolder, {
      [classes.horizontalLayout]: choicesLayout === 'horizontal',
      [classes.belowLayout]: isSelectionButtonBelow && choicesLayout !== 'grid',
      [classes.belowLayoutCenter]: isSelectionButtonBelow && choicesLayout === 'grid',
    });

    const choicelabel = (
      <>
        {displayKey && !isSelectionButtonBelow ? (
          <span className={classes.row}>
            {displayKey}.{'\u00A0'}
            <PreviewPrompt className="label" prompt={label} tagName="span" />
          </span>
        ) : (
          <PreviewPrompt className="label" prompt={label} tagName="span" />
        )}
      </>
    );

    const screenReaderLabel = (
      <span id={this.descId} className={classes.srOnly}>
        {choiceMode === 'checkbox' ? 'Checkbox to select the answer below' : 'Radio button to select the answer below'}
      </span>
    );

    const tagProps = {
      disabled,
      checked,
      correctness,
      value,
      id: this.choiceId,
      onChange: this.onToggleChoice,
      'aria-describedby': this.descId,
    };

    const control = isSelectionButtonBelow ? (
      <span className={classes.belowSelectionComponent}>
        {screenReaderLabel}
        <Tag {...tagProps} style={{ padding: 0 }} />
        {displayKey ? `${displayKey}.` : ''}
      </span>
    ) : (
      <>
        {screenReaderLabel}
        <Tag {...tagProps} />
      </>
    );

    return (
      <div className={classNames(className, 'corespring-' + classSuffix, 'choice-input')}>
        <div className={classes.row}>
          {!hideTick && isEvaluateMode && <FeedbackTick correctness={correctness} />}
          <div className={classNames(holderClassNames, 'checkbox-holder')}>
            <StyledFormControlLabel
              label={choicelabel}
              value={value}
              htmlFor={this.choiceId}
              labelPlacement={isSelectionButtonBelow ? 'top' : undefined}
              control={control}
            />
          </div>
        </div>
        {rationale && <PreviewPrompt className="rationale" defaultClassName="rationale" prompt={rationale} />}
        <Feedback feedback={feedback} correctness={correctness} />
      </div>
    );
  }
}

export default withStyles(styleSheet)(ChoiceInput);
