import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

import Choice from './choice';

// MultipleChoice

const { translator } = Translator;

const MainContainer = styled(Box)({
  color: color.text(),
  backgroundColor: color.background(),
  '& *': {
    '-webkit-font-smoothing': 'antialiased',
  },
  position: 'relative',
  // remove border from legend tags inside main to override the OT default styles
  '& legend': {
    border: 'none !important',
  },
});

const PartLabel = styled('h2')(({ theme }) => ({
  display: 'block',
  fontSize: 'inherit',
  margin: '0',
  fontWeight: 'normal',
  paddingBottom: theme.spacing(2),
}));

const TeacherInstructions = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HorizontalLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const GridLayout = styled(Box)({
  display: 'grid',
});

const StyledFieldset = styled('fieldset')({
  border: '0px',
  padding: '0.01em 0 0 0',
  margin: '0px',
  minWidth: '0px',
  '&:focus': {
    outline: 'none',
  },
});

const SrOnly = styled('h3')({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

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
    correctResponse: PropTypes.array,
    choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
    gridColumns: PropTypes.string,
    alwaysShowCorrect: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
    language: PropTypes.string,
    selectedAnswerBackgroundColor: PropTypes.string,
    selectedAnswerStrokeColor: PropTypes.string,
    selectedAnswerStrokeWidth: PropTypes.string,
    hoverAnswerBackgroundColor: PropTypes.string,
    hoverAnswerStrokeColor: PropTypes.string,
    hoverAnswerStrokeWidth: PropTypes.string,
    onShowCorrectToggle: PropTypes.func,
    isSelectionButtonBelow: PropTypes.bool,
    minSelections: PropTypes.number,
    maxSelections: PropTypes.number,
    autoplayAudioEnabled: PropTypes.bool,
    customAudioButton: {
      playImage: PropTypes.string,
      pauseImage: PropTypes.string,
    },
    options: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showCorrect: this.props.alwaysShowCorrect || false,
      maxSelectionsErrorState: false,
    };

    this.onToggle = this.onToggle.bind(this);
    this.firstInputRef = React.createRef();
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
    // check for print context: options prop is passed from print.js and alwaysShowCorrect is true
    const isPrintMode = this.props.options && this.props.alwaysShowCorrect;
    
    if (isPrintMode) {
      return choice.correct || false;
    }

    // evaluate mode with show correct toggled
    const isEvaluateMode = this.state.showCorrect && this.props.mode === 'evaluate';
    
    if (isEvaluateMode) {
      return choice.correct || false;
    }

    // default behavior: show what the user has selected
    return this.isSelected(choice.value);
  }

  // renderHeading function was added for accessibility.
  renderHeading() {
    const { mode, choiceMode } = this.props;

    if (mode !== 'gather') {
      return null;
    }

    return choiceMode === 'radio' ? (
      <SrOnly>Multiple Choice Question</SrOnly>
    ) : (
      <SrOnly>Multiple Select Question</SrOnly>
    );
  }

  handleGroupFocus = (e) => {
    const fieldset = e.currentTarget;
    const activeEl = document.activeElement;

    if (fieldset.contains(activeEl) && activeEl !== fieldset) {
      return;
    }

    // Only focus the first input if user is tabbing forward
    if (!e.relatedTarget || fieldset.compareDocumentPosition(e.relatedTarget) & Node.DOCUMENT_POSITION_PRECEDING) {
      if (this.firstInputRef?.current) {
        this.firstInputRef.current.focus();
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
      responseCorrect,
      teacherInstructions,
      alwaysShowCorrect,
      animationsDisabled,
      language,
      isSelectionButtonBelow,
      minSelections,
      maxSelections,
      autoplayAudioEnabled,
      session,
      customAudioButton,
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
          : translator.t('translation:multipleChoice:minmaxSelections_range', {
              lng: language,
              minSelections,
              maxSelections,
            });
      }

      if (minSelections) {
        return translator.t('translation:multipleChoice:minSelections', { lng: language, minSelections });
      }

      return '';
    };

    const LayoutComponent = this.props.choicesLayout === 'grid' 
      ? GridLayout 
      : this.props.choicesLayout === 'horizontal' 
        ? HorizontalLayout 
        : Box;

    return (
      <MainContainer id={'main-container'} className={classNames(className, 'multiple-choice')}>
        {partLabel && <PartLabel>{partLabel}</PartLabel>}

        {this.renderHeading()}

        {teacherInstructions && (
          <TeacherInstructions>
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
          </TeacherInstructions>
        )}

        <StyledFieldset
          tabIndex={0}
          onFocus={this.handleGroupFocus}
          role={choiceMode === 'radio' ? 'radiogroup' : 'group'}
        >
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

          <LayoutComponent style={columnsStyle}>
            {choices.map((choice, index) => (
              <Choice
                autoFocusRef={index === 0 ? this.firstInputRef : null}
                choicesLayout={this.props.choicesLayout}
                selectedAnswerBackgroundColor={this.props.selectedAnswerBackgroundColor}
                selectedAnswerStrokeColor={this.props.selectedAnswerStrokeColor}
                selectedAnswerStrokeWidth={this.props.selectedAnswerStrokeWidth}
                hoverAnswerBackgroundColor={this.props.hoverAnswerBackgroundColor}
                hoverAnswerStrokeColor={this.props.hoverAnswerStrokeColor}
                hoverAnswerStrokeWidth={this.props.hoverAnswerStrokeWidth}
                gridColumns={gridColumns}
                key={`choice-${index}`}
                choice={choice}
                index={index}
                choicesLength={choices.length}
                showCorrect={showCorrect}
                isEvaluateMode={isEvaluateMode}
                choiceMode={choiceMode}
                disabled={disabled}
                tagName={partLabel ? `group-${partLabel}` : 'group'}
                onChoiceChanged={this.handleChange}
                hideTick={choice.hideTick}
                checked={this.getChecked(choice)}
                correctness={isEvaluateMode ? this.getCorrectness(choice) : undefined}
                displayKey={this.indexToSymbol(index)}
                isSelectionButtonBelow={isSelectionButtonBelow}
              />
            ))}
          </LayoutComponent>
        </StyledFieldset>

        {choiceMode === 'checkbox' && selections < minSelections && (
          <ErrorText>{getMultipleChoiceMinSelectionErrorMessage()}</ErrorText>
        )}
        {choiceMode === 'checkbox' && maxSelectionsErrorState && (
          <ErrorText>
            {translator.t(`translation:multipleChoice:maxSelections_${maxSelections === 1 ? 'one' : 'other'}`, {
              lng: language,
              maxSelections,
            })}
          </ErrorText>
        )}
      </MainContainer>
    );
  }
}

MultipleChoice.defaultProps = {
  session: {
    value: [],
  },
};

export default MultipleChoice;
