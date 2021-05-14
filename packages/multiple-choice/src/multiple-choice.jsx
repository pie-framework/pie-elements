import React from 'react';
import PropTypes from 'prop-types';
import ChoiceInput from './choice-input';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible , PreviewPrompt} from '@pie-lib/render-ui';

// Choice

export class Choice extends React.Component {
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
      gridColumns
    } = this.props;
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
      choicesLayout,
      gridColumns,
      onChange: this.onChange,
    };

    const names = classNames(classes.choice, {
      [classes.noBorder]: (index === choicesLength - 1) || this.props.choicesLayout !== 'vertical'
    });

    return (
      <div className={choiceClass} key={index}>
        <ChoiceInput {...choiceProps} className={names} />
      </div>
    );
  }
}

Choice.propTypes = {
  choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
  choice: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  onChoiceChanged: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  choicesLength: PropTypes.number,
  showCorrect: PropTypes.bool,
  isEvaluateMode: PropTypes.bool,
  checked: PropTypes.bool,
  correctness: PropTypes.string,
  displayKey: PropTypes.string,
  choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
  gridColumns: PropTypes.number
};

const StyledChoice = withStyles({
  choice: {
    paddingTop: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #E0DEE0',
  },
  noBorder: {
    borderBottom: 'none',
  }
})(Choice);

// MultipleChoice

const styles = {
  corespringChoice: {
    backgroundColor: color.background(),
    padding: '5px',
    '& *': {
      '-webkit-font-smoothing': 'antialiased',
    },
  },
  horizontalLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridLayout: {
    display: 'grid'
  },
  getColumns: function(columns) {
      return columns > 1 ? {gridTemplateColumns: `repeat(${columns}, 1fr)`} : undefined;
  }
};

export class MultipleChoice extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['gather', 'view', 'evaluate']),
    choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
    keyMode: PropTypes.oneOf(['numbers', 'letters', 'none']),
    choices: PropTypes.array,
    prompt: PropTypes.string,
    teacherInstructions: PropTypes.string,
    session: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onChoiceChanged: PropTypes.func.isRequired,
    responseCorrect: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    correctResponse: PropTypes.array,
    choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
    gridColumns: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      showCorrect: false,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    if (this.props.mode === 'evaluate') {
      this.setState({ showCorrect: !this.state.showCorrect });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.correctResponse) {
      this.setState({ showCorrect: false });
    }
  }

  isSelected(value) {
    const sessionValue = this.props.session && this.props.session.value;

    return (
      sessionValue && sessionValue.indexOf && sessionValue.indexOf(value) >= 0
    );
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
      choices = [],
      choiceMode,
      prompt,
      onChoiceChanged,
      responseCorrect,
      teacherInstructions,
      classes,
    } = this.props;
    const { showCorrect } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const layoutClass = this.props.choicesLayout === 'grid' ? classes.gridLayout : (this.props.choicesLayout === 'vertical'? '' : classes.horizontalLayout)
    return (
      <div className={classes.corespringChoice}>
        {teacherInstructions && (
          <Collapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
          <PreviewPrompt className="prompt" prompt={teacherInstructions} />
          </Collapsible>
        )}
        <br />
        <CorrectAnswerToggle
          show={isEvaluateMode && !responseCorrect}
          toggled={this.state.showCorrect}
          onToggle={this.onToggle.bind(this)}
        />
        <br />
        <PreviewPrompt className="prompt" prompt={prompt}/>
        <div className={classNames(layoutClass)} style={styles.getColumns(this.props.gridColumns)}>
          {choices.map((choice, index) => (
            <StyledChoice
              choicesLayout={this.props.choicesLayout}
              gridColumns={this.props.gridColumns}
              key={`choice-${index}`}
              choice={choice}
              index={index}
              choicesLength={choices.length}
              showCorrect={showCorrect}
              isEvaluateMode={isEvaluateMode}
              choiceMode={choiceMode}
              disabled={disabled}
              onChoiceChanged={onChoiceChanged}
              checked={
                showCorrect
                  ? choice.correct || false
                  : this.isSelected(choice.value)
              }
              correctness={
                isEvaluateMode ? this.getCorrectness(choice) : undefined
              }
              displayKey={this.indexToSymbol(index)}
            />
          ))}
        </div>
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
