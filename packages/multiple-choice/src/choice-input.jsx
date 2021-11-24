import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import { Feedback, color, PreviewPrompt } from '@pie-lib/render-ui';
import FeedbackTick from './feedback-tick';
import Radio from '@material-ui/core/Radio';
import classNames from 'classnames';

const styleSheet = () => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.background(),
  },
  promptTest: {
    '& mjx-mtr': {
      position: 'relative',
    },
    '& mjx-mstyle': {
      position: 'relative',
    },
    '& mjx-mstyle:after': {
      width: '100%',
      position: 'absolute',
      top: '50%',
      background: 'darkslateblue',
      height: '2px',
      left: '0',
      content: '" "',
    },
    '& mjx-mtr:after': {
      width: '100%',
      position: 'absolute',
      top: '50%',
      background: 'darkslateblue',
      height: '2px',
      left: '0',
      content: '" "',
    },
    // '& mjx-mtd::after': {
    //   content: '""',
    //   borderTop: '1px solid #c9302c',
    //   borderBottom: '1px solid #c9302c',
    //   position: 'absolute',
    //   left: 0,
    //   top: '50%',
    //   width: '100%',
    // },
  },
  checkboxHolder: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.background(),
    flex: 1,
    '& label': {
      color: color.text(),
    },
  },
});

const formStyleSheet = {
  label: {
    color: `${color.text()} !important`, //'var(--choice-input-color, black)'
    backgroundColor: color.background(),
  },
};

export const StyledFormControlLabel = withStyles(formStyleSheet, {
  name: 'FormControlLabel',
})((props) => (
  <FormControlLabel {...props} classes={{ label: props.classes.label }} />
));

const CLASS_NAME = 'multiple-choice-component';

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
  'incorrect-disabled': colorStyle(
    'incorrect-disabled-color',
    color.disabled()
  ),
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
  choiceTag: {
    '&:before': {
      content: '"——"',
      position: 'absolute',
      letterSpacing: '-3px',
      left: '0.3em',
    },
  },
};

export const StyledCheckbox = withStyles(inputStyles)((props) => {
  const {
    correctness,
    classes,
    checked,
    onChange,
    disabled,
    accessibility,
    strikethrough,
  } = props;
  const key = (k) => (correctness ? `${correctness}-${k}` : k);

  const resolved = {
    root: classes[key('root')],
    checked: classes[key('checked')],
    disabled: classes[key('disabled')],
  };

  const miniProps = { checked, onChange, disabled };
  return (
    <Checkbox
      aria-label={accessibility}
      {...miniProps}
      className={classNames(CLASS_NAME, strikethrough && classes.choiceTag)}
      classes={{
        root: resolved.root,
        checked: resolved.checked,
        disabled: resolved.disabled,
      }}
    />
  );
});

export const StyledRadio = withStyles(inputStyles)((props) => {
  const { correctness, classes, checked, onChange, disabled, accessibility } =
    props;
  const key = (k) => (correctness ? `${correctness}-${k}` : k);

  const resolved = {
    root: classes[key('root')],
    checked: classes[key('checked')],
    disabled: classes[key('disabled')],
  };

  const miniProps = { checked, onChange, disabled };

  return (
    <Radio
      aria-label={accessibility}
      {...miniProps}
      className={CLASS_NAME}
      classes={{
        root: resolved.root,
        checked: resolved.checked,
      }}
    />
  );
});

export class ChoiceInput extends React.Component {
  static propTypes = {
    choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
    displayKey: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    correctness: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    feedback: PropTypes.string,
    label: PropTypes.string.isRequired,
    rationale: PropTypes.string,
    accessibility: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    hideTick: PropTypes.bool,
    isEvaluateMode: PropTypes.bool,
  };

  static defaultProps = {
    rationale: null,
    accessibility: null,
    checked: false,
    isEvaluateMode: false,
  };

  constructor(props) {
    super(props);
    this.onToggleChoice = this.onToggleChoice.bind(this);
  }

  onToggleChoice() {
    this.props.onChange({
      value: this.props.value,
      selected: !this.props.checked,
    });
  }

  render() {
    const {
      choiceMode,
      disabled,
      displayKey,
      feedback,
      label,
      checked,
      correctness,
      classes,
      className,
      rationale,
      accessibility,
      hideTick,
      isEvaluateMode,
      strikethrough,
    } = this.props;

    const Tag = choiceMode === 'checkbox' ? StyledCheckbox : StyledRadio;
    const classSuffix = choiceMode === 'checkbox' ? 'checkbox' : 'radio-button';

    return (
      <div
        className={classNames(
          className,
          'corespring-' + classSuffix,
          'choice-input'
        )}
      >
        <div className={classes.row}>
          {!hideTick && isEvaluateMode && (
            <FeedbackTick correctness={correctness} />
          )}
          <div
            className={classNames(classes.checkboxHolder, 'checkbox-holder')}
          >
            <StyledFormControlLabel
              disabled={disabled}
              label={displayKey ? displayKey + '. ' : ''}
              control={
                <Tag
                  accessibility={accessibility}
                  checked={checked}
                  correctness={correctness}
                  strikethrough={strikethrough}
                  className={classNames(classes.choiceTag)}
                  onChange={this.onToggleChoice}
                />
              }
            />
            <div className={classNames(classes.promptTest)}>
              <PreviewPrompt
                className={classNames('label', classes.promptTest)}
                onClick={this.onToggleChoice}
                prompt={label}
                tagName="span"
              />
            </div>
          </div>
        </div>
        {rationale && (
          <PreviewPrompt
            className="rationale"
            defaultClassName="rationale"
            prompt={rationale}
          />
        )}
        <Feedback feedback={feedback} correctness={correctness} />
      </div>
    );
  }
}

export default withStyles(styleSheet)(ChoiceInput);
