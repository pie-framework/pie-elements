import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { Feedback, color, PreviewPrompt } from '@pie-lib/render-ui';
import Radio from '@mui/material/Radio';
import classNames from 'classnames';

import FeedbackTick from './feedback-tick';

const CLASS_NAME = 'multiple-choice-component';

const Row = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: color.background(),
});

const CheckboxHolder = styled(Box)({
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
});

const BelowSelectionComponent = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > span': {
    // visually reduce right padding, but maintain accessibility padding for checkbox indicators to be circles
    marginLeft: `-${theme.spacing(1)}px`,
  },
}));

const SrOnly = styled('span')({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

export const StyledFormControlLabel = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    color: `${color.text()} !important`,
    backgroundColor: color.background(),
    letterSpacing: 'normal',
  },
  '&.Mui-disabled *': {
    cursor: 'not-allowed !important',
  },
});

const colorStyle = (varName, fallback) => ({
  [`&.${CLASS_NAME}`]: {
    color: `var(--choice-input-${varName}, ${fallback}) !important`,
  },
});

const getInputStyles = (correctness) => {
  const key = (k) => (correctness ? `${correctness}-${k}` : k);
  
  return {
    [key('root')]: {
      ...colorStyle('color', color.text()),
      ...(correctness ? {} : {
        '&:hover': { color: `${color.primaryLight()} !important` },
      }),
      ...(correctness === 'correct' ? colorStyle('correct-color', color.text()) : {}),
      ...(correctness === 'incorrect' ? colorStyle('incorrect-color', color.incorrect()) : {}),
    },
    [key('checked')]: {
      ...(correctness === 'correct' ? colorStyle('correct-selected-color', color.correct()) : {}),
      ...(correctness === 'incorrect' ? colorStyle('incorrect-checked', color.incorrect()) : {}),
      ...(!correctness ? colorStyle('selected-color', color.primary()) : {}),
    },
    [key('disabled')]: {
      ...colorStyle('disabled-color', color.text()),
      ...(correctness === 'correct' ? colorStyle('correct-disabled-color', color.disabled()) : {}),
      ...(correctness === 'incorrect' ? colorStyle('incorrect-disabled-color', color.disabled()) : {}),
      opacity: 0.6,
      cursor: 'not-allowed !important',
      pointerEvents: 'initial !important',
    },
    focusVisibleUnchecked: {
      outline: `2px solid ${color.focusUncheckedBorder()}`,
      backgroundColor: color.focusUnchecked(),
    },
    focusVisibleChecked: {
      outline: `2px solid ${color.focusCheckedBorder()}`,
      backgroundColor: color.focusChecked(),
    },
  };
};

const StyledCheckboxBase = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== 'correctness',
})(({ correctness }) => {
  const styles = getInputStyles(correctness);
  const key = (k) => (correctness ? `${correctness}-${k}` : k);
  
  return {
    [`&.${CLASS_NAME}`]: {
      ...styles[key('root')],
      '&.Mui-checked': styles[key('checked')],
      '&.Mui-disabled': correctness ? {} : styles[key('disabled')],
    },
    '&.Mui-focusVisible': {
      '&:not(.Mui-checked)': styles.focusVisibleUnchecked,
      '&.Mui-checked': styles.focusVisibleChecked,
    },
  };
});

export const StyledCheckbox = (props) => {
  const { correctness, checked, onChange, disabled, value, id, onKeyDown, inputRef } = props;

  const miniProps = { checked, onChange, disabled, value };

  return (
    <StyledCheckboxBase
      id={id}
      slotProps={{ input: { ref: inputRef } }}
      aria-checked={checked}
      onKeyDown={onKeyDown}
      disableRipple
      {...miniProps}
      correctness={correctness}
      className={CLASS_NAME}
    />
  );
};

const StyledRadioBase = styled(Radio, {
  shouldForwardProp: (prop) => prop !== 'correctness',
})(({ correctness }) => {
  const styles = getInputStyles(correctness);
  const key = (k) => (correctness ? `${correctness}-${k}` : k);
  
  return {
    [`&.${CLASS_NAME}`]: {
      ...styles[key('root')],
      '&.Mui-checked': styles[key('checked')],
      '&.Mui-disabled': correctness ? {} : styles[key('disabled')],
    },
    '&.Mui-focusVisible': {
      '&:not(.Mui-checked)': styles.focusVisibleUnchecked,
      '&.Mui-checked': styles.focusVisibleChecked,
    },
  };
});

export const StyledRadio = (props) => {
  const { correctness, checked, onChange, disabled, value, id, tagName, inputRef } = props;

  const miniProps = { checked, onChange, disabled, value };

  return (
    <StyledRadioBase
      id={id}
      slotProps={{ input: { ref: inputRef } }}
      aria-checked={checked}
      disableRipple
      {...miniProps}
      correctness={correctness}
      className={CLASS_NAME}
      name={tagName}
    />
  );
};

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
    className: PropTypes.string,
    tagName: PropTypes.string,
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

  handleKeyDown = (event) => {
    const { choiceMode } = this.props;

    if (choiceMode !== 'checkbox') return;

    const isArrowDown = event.key === 'ArrowDown';
    const isArrowUp = event.key === 'ArrowUp';

    if (!isArrowDown && !isArrowUp) return;

    event.preventDefault();

    const currentEl = document.getElementById(this.choiceId);
    if (!currentEl) return;

    const fieldset = currentEl.closest('fieldset');
    if (!fieldset) return;

    const groupCheckboxes = Array.from(fieldset.querySelectorAll('input[type="checkbox"]'));

    const currentIndex = groupCheckboxes.findIndex((el) => el === currentEl);
    if (currentIndex === -1) return;

    const nextIndex = isArrowDown ? currentIndex + 1 : currentIndex - 1;
    const nextEl = groupCheckboxes[nextIndex];

    if (nextEl) {
      nextEl.focus();
    }
  };

  render() {
    const {
      choiceMode,
      disabled,
      displayKey,
      feedback,
      label,
      correctness,
      className,
      rationale,
      hideTick,
      isEvaluateMode,
      choicesLayout,
      value,
      checked,
      tagName,
      isSelectionButtonBelow,
    } = this.props;

    const Tag = choiceMode === 'checkbox' ? StyledCheckbox : StyledRadio;
    const classSuffix = choiceMode === 'checkbox' ? 'checkbox' : 'radio-button';

    const holderSx = {
      ...(choicesLayout === 'horizontal' && {
        [`& .${CLASS_NAME}`]: {
          padding: '8px',
          margin: '4px 0 4px 4px',
        },
      }),
      ...(isSelectionButtonBelow && choicesLayout !== 'grid' && {
        '& > label': {
          alignItems: 'flex-start',
        },
      }),
      ...(isSelectionButtonBelow && choicesLayout === 'grid' && {
        justifyContent: 'center',
        '& > label': {
          alignItems: 'center',
        },
      }),
    };

    const choicelabel = (
      <>
        {displayKey && !isSelectionButtonBelow ? (
          <Row component="span">
            {displayKey}.{'\u00A0'}
            <PreviewPrompt className="label" prompt={label} tagName="span" />
          </Row>
        ) : (
          <PreviewPrompt className="label" prompt={label} tagName="span" />
        )}
      </>
    );

    const screenReaderLabel = (
      <SrOnly id={this.descId}>
        {choiceMode === 'checkbox' ? 'Checkbox to select the answer below' : 'Radio button to select the answer below'}
      </SrOnly>
    );

    const tagProps = {
      disabled,
      checked,
      correctness,
      tagName,
      value,
      id: this.choiceId,
      onChange: this.onToggleChoice,
      onKeyDown: this.handleKeyDown,
      'aria-describedby': this.descId,
    };

    const hasMathOrImage =
      typeof label === 'string' &&
      (label.includes('<math') ||
        label.includes('\\(') ||
        label.includes('\\[') ||
        label.includes('<img') ||
        label.includes('data-latex') ||
        label.includes('data-raw') ||
        label.includes('<mjx-container'));

    const control = isSelectionButtonBelow ? (
      <BelowSelectionComponent>
        {hasMathOrImage && screenReaderLabel}
        <Tag {...tagProps} style={{ padding: 0 }} />
        {displayKey ? `${displayKey}.` : ''}
      </BelowSelectionComponent>
    ) : (
      <>
        {hasMathOrImage && screenReaderLabel}
        <Tag {...tagProps} slotProps={{ input: { ref: this.props.autoFocusRef } }} />
      </>
    );

    return (
      <div className={classNames(className, 'corespring-' + classSuffix, 'choice-input')}>
        <Row>
          {!hideTick && isEvaluateMode && <FeedbackTick correctness={correctness} />}
          <CheckboxHolder className="checkbox-holder" sx={holderSx}>
            <StyledFormControlLabel
              label={choicelabel}
              value={value}
              htmlFor={this.choiceId}
              labelPlacement={isSelectionButtonBelow ? 'top' : undefined}
              control={control}
            />
          </CheckboxHolder>
        </Row>
        {rationale && <PreviewPrompt className="rationale" defaultClassName="rationale" prompt={rationale} />}
        <Feedback feedback={feedback} correctness={correctness} />
      </div>
    );
  }
}

export default ChoiceInput;
