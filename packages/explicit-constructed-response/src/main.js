import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { ConstructedResponse } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    prompt: PropTypes.string,
    note: PropTypes.string,
    showNote: PropTypes.bool,
    env: PropTypes.object,
    rationale: PropTypes.string,
    disabled: PropTypes.bool,
    markup: PropTypes.string,
    mode: PropTypes.string,
    teacherInstructions: PropTypes.string,
    value: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func,
    alwaysShowCorrect: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
    maxLengthPerChoice: PropTypes.array
  };

  static defaultProps = {
    value: {}
  };

  state = {
    showCorrectAnswer: this.props.alwaysShowCorrect || false,
    value: this.props.value
  };

  // if for all responses max length is 1, call onChange for each keystroke
  getChangeSession = maxLengthPerChoice =>
    maxLengthPerChoice && maxLengthPerChoice.every((val, i, arr) => val === arr[0] && val === 1) ? this.props.onChange
      : debounce(this.props.onChange, 1500, { maxWait: 1500 });

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { maxLengthPerChoice } = this.props;

    if (isEmpty(nextProps.feedback)) {
      this.setState({ showCorrectAnswer: false });
    }

    if (nextProps.alwaysShowCorrect) {
      this.setState({ showCorrectAnswer: true });
    }

    if (maxLengthPerChoice && !isEqual(maxLengthPerChoice, nextProps.maxLengthPerChoice)) {
      this.changeSession = this.getChangeSession(nextProps.maxLengthPerChoice);
    }
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  changeSession = this.getChangeSession(this.props.maxLengthPerChoice);

  onChange = value => {
    this.setState({ value });

    this.changeSession(value);
  };

  render() {
    const { showCorrectAnswer, value } = this.state;
    const {
      classes,
      mode,
      prompt,
      rationale,
      teacherInstructions,
      note,
      showNote,
      env,
      animationsDisabled,
      alwaysShowCorrect,
      maxLengthPerChoiceEnabled,
      maxLengthPerChoice
    } = this.props;
    const { role } = env || {};
    const displayNote = (showCorrectAnswer || mode === 'view' && role === 'instructor') && showNote && note;
    const mainClasses = classNames([classes.mainContainer, alwaysShowCorrect ? classes.noBorderColor : {}]);

    const teacherInstructionsDiv = <div
      className="teacher-instructions"
      dangerouslySetInnerHTML={{ __html: teacherInstructions }}
    />;

    const rationaleDiv = <div className="rationale" dangerouslySetInnerHTML={{ __html: rationale }}/>;

    return (
      <div className={mainClasses}>
        {
          teacherInstructions && hasText(teacherInstructions) && (
            <div className={classes.collapsible}>
              {!animationsDisabled ? <Collapsible
                  labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
                >
                  {teacherInstructionsDiv}
                </Collapsible>
                : teacherInstructionsDiv}
            </div>
          )
        }
        {!alwaysShowCorrect && <CorrectAnswerToggle
          show={mode === 'evaluate'}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />}
        {prompt && <div className="prompt" dangerouslySetInnerHTML={{ __html: prompt }}/>}
        <ConstructedResponse
          {...this.props}
          onChange={this.onChange}
          showCorrectAnswer={showCorrectAnswer}
          value={value}
          maxLength={maxLengthPerChoice}
          adjustedLimit={maxLengthPerChoiceEnabled}
        />
        {displayNote && (
          <div
            className={classNames(classes.note, 'note')}
            dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }}
          />
        )}
        {rationale && hasText(rationale) && (
          <div className={classes.collapsible}>
            {!animationsDisabled ? <Collapsible
                labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
              >
                {rationaleDiv}
              </Collapsible>
              : rationaleDiv}
          </div>
        )}
      </div>
    );
  }
}

const styles = theme => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background()
  },
  note: {
    padding: '5px 0',
  },
  collapsible: {
    margin: `${theme.spacing.unit * 2}px 0`,
  },
  noBorderColor: {
    '& *': {
      borderColor: `${color.text()} !important`
    }
  }
});

export default withStyles(styles)(Main);
