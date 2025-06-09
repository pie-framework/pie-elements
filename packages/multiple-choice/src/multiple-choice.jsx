import React from 'react';
import PropTypes from 'prop-types';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import Translator from '@pie-lib/pie-toolbox/translator';

import StyledChoice from './choice';

// MultipleChoice

const { translator } = Translator;

const styles = (theme) => ({
  main: {
    color: color.text(),
    backgroundColor: color.background(),
    '& *': {
      '-webkit-font-smoothing': 'antialiased',
    },
    position: 'relative'
  },
  partLabel: {
    display: 'block',
    fontSize: 'inherit',
    margin: '0',
    fontWeight: 'normal',
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
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

export class MultipleChoice extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    mode: PropTypes.oneOf(['gather', 'view', 'evaluate']),
    choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
    keyMode: PropTypes.oneOf(['numbers', 'letters', 'none']),
    choices: PropTypes.array,
    partLabel: PropTypes.string,
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
    language: PropTypes.string,
    selectedAnswerBackgroundColor: PropTypes.string,
    onShowCorrectToggle: PropTypes.func,
    isSelectionButtonBelow: PropTypes.bool,
    minSelections: PropTypes.number,
    maxSelections: PropTypes.number,
    autoplayAudioEnabled: PropTypes.bool,
    customAudioButton: {
      playImage: PropTypes.string,
      pauseImage: PropTypes.string,
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      showCorrect: this.props.alwaysShowCorrect || false,
      maxSelectionsErrorState: false,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  isSelected(value) {
    const sessionValue = this.props.session && this.props.session.value;

    return sessionValue && sessionValue.indexOf && sessionValue.indexOf(value) >= 0;
  }

  // handleChange was added for accessibility. Please see comments and videos from PD-2441.
  handleChange = (event) => {
    const { value, checked } = event.target;
    const { maxSelections, onChoiceChanged, session } = this.props;

    if (session.value && session.value.length >= maxSelections) {
      // show/hide max selections error when user select/deselect an answer
      this.setState({ maxSelectionsErrorState: checked });

      if (checked) {
        // prevent selecting more answers
        return;
      }
    }

    onChoiceChanged({ value, selected: checked, selector: 'Mouse' });
  };

  onToggle = () => {
    if (this.props.mode === 'evaluate') {
      this.setState({ showCorrect: !this.state.showCorrect }, () => {
        if (this.props.onShowCorrectToggle) {
          this.props.onShowCorrectToggle();
        }
      });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.correctResponse && this.state.showCorrect !== false) {
      this.setState({ showCorrect: false }, () => {
        if (this.props.onShowCorrectToggle) {
          this.props.onShowCorrectToggle();
        }
      });
    }

    if (nextProps.alwaysShowCorrect && this.state.showCorrect !== true) {
      this.setState({ showCorrect: true }, () => {
        if (this.props.onShowCorrectToggle) {
          this.props.onShowCorrectToggle();
        }
      });
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

  getChecked(choice) {
    if (this.state.showCorrect) {
      return choice.correct || false;
    }

    return this.isSelected(choice.value);
  }

  // renderHeading function was added for accessibility.
  renderHeading() {
    const { mode, choiceMode, classes } = this.props;

    if (mode !== 'gather') {
      return null;
    }

    return choiceMode === 'radio' ? (
      <h2 className={classes.srOnly}>Multiple Choice Question</h2>
    ) : (
      <h2 className={classes.srOnly}>Multiple Select Question</h2>
    );
  }

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
      responseCorrect,
      teacherInstructions,
      classes,
      alwaysShowCorrect,
      animationsDisabled,
      language,
      isSelectionButtonBelow,
      minSelections,
      maxSelections,
      autoplayAudioEnabled,
      session,
      customAudioButton
    } = this.props;
    const { showCorrect, maxSelectionsErrorState } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showCorrectAnswerToggle = isEvaluateMode && !responseCorrect;
    const columnsStyle = gridColumns > 1 ? { gridTemplateColumns: `repeat(${gridColumns}, 1fr)` } : undefined;
    const selections = (session.value && session.value.length) || 0;

    const teacherInstructionsDiv = (
      <PreviewPrompt
        tagName="div"
        className="prompt"
        defaultClassName="teacher-instructions"
        prompt={teacherInstructions}
      />
    );

    const getMultipleChoiceMinSelectionErrorMessage = () => {
      if (minSelections && maxSelections) {
        return minSelections === maxSelections
          ? translator.t('translation:multipleChoice:minmaxSelections_equal', { lng: language, minSelections })
          : translator.t('translation:multipleChoice:minmaxSelections_range', { lng: language, minSelections, maxSelections });
      }

      if (minSelections) {
        return translator.t('translation:multipleChoice:minSelections', { lng: language, minSelections });
      }

      return '';
    };

    return (
        <div id={'main-container'} className={classNames(classes.main, className, 'multiple-choice')}>
        {partLabel && <h3 className={classes.partLabel}>{partLabel}</h3>}

        {this.renderHeading()}

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

        <fieldset tabIndex={0} className={classes.fieldset} role={choiceMode === 'radio' ? 'radiogroup' : 'group'}>
          <PreviewPrompt
            className="prompt"
            defaultClassName="prompt"
            prompt={prompt}
            tagName={'legend'}
            autoplayAudioEnabled={autoplayAudioEnabled}
            customAudioButton={customAudioButton}
          />

          {!alwaysShowCorrect && (
            <CorrectAnswerToggle
              show={showCorrectAnswerToggle}
              toggled={showCorrect}
              onToggle={this.onToggle.bind(this)}
              language={language}
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
                selectedAnswerBackgroundColor={this.props.selectedAnswerBackgroundColor}
                gridColumns={gridColumns}
                key={`choice-${index}`}
                choice={choice}
                index={index}
                choicesLength={choices.length}
                showCorrect={showCorrect}
                isEvaluateMode={isEvaluateMode}
                choiceMode={choiceMode}
                disabled={disabled}
                onChoiceChanged={this.handleChange}
                hideTick={choice.hideTick}
                checked={this.getChecked(choice)}
                correctness={isEvaluateMode ? this.getCorrectness(choice) : undefined}
                displayKey={this.indexToSymbol(index)}
                isSelectionButtonBelow={isSelectionButtonBelow}
              />
            ))}
          </div>
        </fieldset>

        {choiceMode === 'checkbox' && (selections < minSelections) && (
          <div className={classes.errorText}>
            {getMultipleChoiceMinSelectionErrorMessage()}
          </div>
        )}
        {choiceMode === 'checkbox' && maxSelectionsErrorState && (
          <div className={classes.errorText}>
            {translator.t(`translation:multipleChoice:maxSelections_${maxSelections === 1 ? 'one' : 'other'}`, {
              lng: language,
              maxSelections,
            })}
          </div>
        )}
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
