import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/render-ui';
import StyledChoice from './choice';

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
    flexWrap: 'wrap',
  },
  gridLayout: {
    display: 'grid',
  },
  getColumns: function (columns) {
    return columns > 1 ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined;
  },
  fieldset: {
    border: '0px',
    padding: '0.01em 0 0 0',
    margin: '0px',
    minWidth: '0px'
  },
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
      showCorrect: this.props.alwaysShowCorrect || false,
      checked: this.props.showCorrect ? this.props.choices.map(choice => choice.correct) : this.props.choices.map(choice => this.isSelected(choice.value)),
    };
  
    this.onToggle = this.onToggle.bind(this);
    this.isSelected = this.isSelected.bind(this);

  }

  isSelected(value) {
    const sessionValue = this.props.session && this.props.session.value;
  if (!sessionValue) {
    return false;
  }

  return sessionValue.indexOf(value) >= 0 && sessionValue[0] === value
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  };

  componentDidUpdate(prevProps) {
    console.log(prevProps.session, "prev sesion",  this.props.session, "this props session")

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

    if (nextProps.alwaysShowCorrect) {
      this.setState({ showCorrect: true });
    }

    const sessionValue = nextProps.session && nextProps.session.value;
    if (sessionValue) {
      this.setState({
        checked: this.props.showCorrect ? this.props.choices.map(choice => choice.correct) : this.props.choices.map(choice => this.isSelected(choice.value)),
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
      alwaysShowCorrect,
      animationsDisabled,
    } = this.props;
    const { showCorrect, selectedValue } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showCorrectAnswerToggle = isEvaluateMode && !responseCorrect;

    console.log(this.state.checked, "this.state.checked")
    this.state.checked.map((check, index) => console.log(check, index))

    return (
      <div className={classNames(classes.corespringChoice, 'multiple-choice')}>
        {teacherInstructions && (
          <React.Fragment>
            {!animationsDisabled ? (
              <Collapsible
                labels={{
                  hidden: 'Show Teacher Instructions',
                  visible: 'Hide Teacher Instructions',
                }}
              >
                <PreviewPrompt tagName="div" className="prompt" prompt={teacherInstructions} />
              </Collapsible>
            ) : (
              <PreviewPrompt
                tagName="div"
                className="prompt"
                defaultClassName="teacher-instructions"
                prompt={teacherInstructions}
              />
            )}
            <br />
          </React.Fragment>
        )}
        {!alwaysShowCorrect && (
          <CorrectAnswerToggle
            show={showCorrectAnswerToggle}
            toggled={showCorrect}
            onToggle={this.onToggle.bind(this)}
          />
        )}
        {showCorrectAnswerToggle && <br />}
        <fieldset className={classes.fieldset}>
          <PreviewPrompt className="prompt" defaultClassName="prompt" prompt={prompt} tagName={"legend"} />
          <div
            className={classNames(
              { [classes.gridLayout]: this.props.choicesLayout === 'grid' },
              {
                [classes.horizontalLayout]: this.props.choicesLayout === 'horizontal',
              },
            )}
            style={styles.getColumns(this.props.gridColumns)}
          >
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
              //  onChoiceChanged={onChoiceChanged}
              onChoiceChanged={this.handleChange}
                hideTick={choice.hideTick}
               // checked={showCorrect ? choice.correct || false :this.isSelected(choice.value)}
              // checked={this.state.checked[index]}
              checked={selectedValue === choice.value}
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
