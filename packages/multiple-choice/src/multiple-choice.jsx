import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/render-ui';
import StyledChoice from './choice';

// MultipleChoice

const styles = (theme) => ({
  main: {
    color: color.text(),
    backgroundColor: color.background(),
    '& *': {
      '-webkit-font-smoothing': 'antialiased',
    },
  },
  partLabel: {
    paddingBottom: theme.spacing.unit * 2,
  },
  teacherInstructions: {
    marginBottom: theme.spacing.unit * 2,
  },
  horizontalLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridLayout: {
    display: 'grid',
  },
  fieldset: {
    border: '0px',
    padding: '0.01em 0 0 0',
    margin: '0px',
    minWidth: '0px',
  },
});

export class MultipleChoice extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['gather', 'view', 'evaluate']),
    choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
    keyMode: PropTypes.oneOf(['numbers', 'letters', 'none']),
    choices: PropTypes.array,
    prompt: PropTypes.string,
    teacherInstructions: PropTypes.string,
    session: PropTypes.object,
    disabled: PropTypes.bool,
    onChoiceChanged: PropTypes.func,
    responseCorrect: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    correctResponse: PropTypes.array,
    choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
    gridColumns: PropTypes.string,
    alwaysShowCorrect: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: null,
      selectedValues: [],
      showCorrect: this.props.alwaysShowCorrect || false,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  isSelected(value) {
    const sessionValue = this.props.session && this.props.session.value;

    return sessionValue && sessionValue.indexOf && sessionValue.indexOf(value) >= 0;
  }

  // handleChange and handleChangeCheckboxes functions were added for accessibility. Please see comments and videos from PD-2441. They should only be removed if a better solution is found.
  handleChange = (event) => {
    const target = event.target;

    this.setState({ selectedValue: target.value });
  };

  handleChangeCheckboxes = (event) => {
    const { value, checked } = event.target;

    this.setState((prevState) => {
      let selectedValues = [...prevState.selectedValues];

      if (checked) {
        selectedValues.push(value);
      } else {
        selectedValues = selectedValues.filter((currentValue) => currentValue !== value);
      }

      return { selectedValues };
    });
  };

  onToggle() {
    if (this.props.mode === 'evaluate') {
      this.setState({ showCorrect: !this.state.showCorrect });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.correctResponse) {
      this.setState({ showCorrect: false });
    }

    if (nextProps.alwaysShowCorrect) {
      this.setState({ showCorrect: true });
    }
  }

  indexToSymbol(index) {
    if (this.props.keyMode === 'numbers') {
      return `${index + 1}`;
    }

    if (this.props.keyMode === 'letters') {
      return String.fromCharCode(97 + index).toUpperCase();
    }

    return '';
  }

  getCorrectness = (choice = {}) => {
    const isCorrect = choice.correct;
    const isChecked = this.isSelected(choice.value);

    if (this.state.showCorrect) {
      return isCorrect ? 'correct' : undefined;
    }

    if (isCorrect) {
      if (isChecked) {
        // A correct answer is selected: marked with a green checkmark
        return 'correct';
      } else {
        // A correct answer is NOT selected: marked with an orange X
        return 'incorrect';
      }
    } else {
      if (isChecked) {
        // An incorrect answer is selected: marked with an orange X
        return 'incorrect';
      } else {
        // An incorrect answer is NOT selected: not marked
        return undefined;
      }
    }
  };

  render() {
    const {
      mode,
      disabled,
      className,
      choices = [],
      choiceMode,
      gridColumns,
      partLabel,
      prompt,
      onChoiceChanged,
      responseCorrect,
      teacherInstructions,
      classes,
      alwaysShowCorrect,
      animationsDisabled,
    } = this.props;
    const { showCorrect, selectedValue, selectedValues } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showCorrectAnswerToggle = isEvaluateMode && !responseCorrect;
    const columnsStyle = gridColumns > 1 ? { gridTemplateColumns: `repeat(${gridColumns}, 1fr)` } : undefined;

    const teacherInstructionsDiv = (
      <PreviewPrompt
        tagName="div"
        className="prompt"
        defaultClassName="teacher-instructions"
        prompt={teacherInstructions}
      />
    );

    return (
      <div className={classNames(classes.main, className, 'multiple-choice')}>
        {partLabel && <div className={classes.partLabel}>{partLabel}</div>}

        {teacherInstructions && (
          <div className={classes.teacherInstructions}>
            {!animationsDisabled ? (
              <Collapsible
                labels={{
                  hidden: 'Show Teacher Instructions',
                  visible: 'Hide Teacher Instructions',
                }}
              >
                {teacherInstructionsDiv}
              </Collapsible>
            ) : (
              teacherInstructionsDiv
            )}
          </div>
        )}

        <fieldset className={classes.fieldset}>
          <PreviewPrompt className="prompt" defaultClassName="prompt" prompt={prompt} tagName={'legend'} />

          {!alwaysShowCorrect && (
            <CorrectAnswerToggle
              show={showCorrectAnswerToggle}
              toggled={showCorrect}
              onToggle={this.onToggle.bind(this)}
            />
          )}

          <div
            className={classNames({
              [classes.gridLayout]: this.props.choicesLayout === 'grid',
              [classes.horizontalLayout]: this.props.choicesLayout === 'horizontal',
            })}
            style={columnsStyle}
          >
            {choices.map((choice, index) => (
              <StyledChoice
                choicesLayout={this.props.choicesLayout}
                gridColumns={gridColumns}
                key={`choice-${index}`}
                choice={choice}
                index={index}
                choicesLength={choices.length}
                showCorrect={showCorrect}
                isEvaluateMode={isEvaluateMode}
                choiceMode={choiceMode}
                disabled={disabled}
                updateSession={onChoiceChanged}
                onChoiceChanged={this.props.choiceMode === 'radio' ? this.handleChange : this.handleChangeCheckboxes}
                hideTick={choice.hideTick}
                checked={
                  showCorrect
                    ? choice.correct || false
                    : this.props.choiceMode === 'radio'
                    ? selectedValue === choice.value
                    : selectedValues.includes(choice.value)
                }
                correctness={isEvaluateMode ? this.getCorrectness(choice) : undefined}
                displayKey={this.indexToSymbol(index)}
              />
            ))}
          </div>
        </fieldset>
      </div>
    );
  }
}

MultipleChoice.defaultProps = {
  session: {
    value: [],
  },
};

export default withStyles(styles)(MultipleChoice);
