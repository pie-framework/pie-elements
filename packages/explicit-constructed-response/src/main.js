import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
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
  };

  static defaultProps = {
    value: {}
  };

  state = {
    showCorrectAnswer: this.props.alwaysShowCorrect || false,
    value: this.props.value
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.feedback)) {
      this.setState({ showCorrectAnswer: false });
    }
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  changeSession = debounce(this.props.onChange, 1500);

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
      alwaysShowCorrect
    } = this.props;
    const { role } = env || {};
    const displayNote = (showCorrectAnswer || mode === 'view' && role === 'instructor') && showNote && note;
    const mainClasses = alwaysShowCorrect ? classNames(classes.mainContainer, classes.noBorderColor)
      : classes.mainContainer;

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
                : teacherInstructionsDiv }
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
              : rationaleDiv }
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
