import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { ConstructedResponse } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';

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
    maxLengthPerChoice: PropTypes.array
  };

  static defaultProps = {
    value: {}
  };

  state = {
    showCorrectAnswer: false,
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
    const { classes, mode, prompt, rationale, teacherInstructions, note, showNote, env, maxLengthPerChoice } = this.props;
    const { role } = env || {};
    const displayNote = (showCorrectAnswer || mode === 'view' && role === 'instructor') && showNote && note;

    return (
      <div className={classes.mainContainer}>
        {
          teacherInstructions && hasText(teacherInstructions) && (
            <div className={classes.collapsible}>
              <Collapsible
                labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              >
                <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
              </Collapsible>
            </div>
          )
        }
        <CorrectAnswerToggle
          show={mode === 'evaluate'}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        {prompt && <div dangerouslySetInnerHTML={{ __html: prompt }}/>}
        <ConstructedResponse
          {...this.props}
          onChange={this.onChange}
          showCorrectAnswer={showCorrectAnswer}
          value={value}
          maxLength={maxLengthPerChoice}
        />
        {displayNote && (
          <div
            className={classes.note}
            dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }}
          />
        )}
        {rationale && hasText(rationale) && (
          <div className={classes.collapsible}>
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
            >
              <div dangerouslySetInnerHTML={{ __html: rationale }}/>
            </Collapsible>
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
  }
});

export default withStyles(styles)(Main);
