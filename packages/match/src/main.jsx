import React from 'react';
import PropTypes from 'prop-types';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { color, Collapsible, Feedback, hasText, PreviewPrompt, UiLayout, hasMedia } from '@pie-lib/pie-toolbox/render-ui';
import AnswerGrid from './answer-grid';
import { withStyles } from '@material-ui/core/styles';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      session: {
        ...props.session,
        answers: (props.session && props.session.answers) || this.generateAnswers(props.model),
      },
      showCorrect: false,
    };

    this.callOnSessionChange();
  }

  generateAnswers = (model) => {
    const answers = {};

    model.rows?.forEach((row) => {
      answers[row.id] = new Array(model.layout - 1).fill(false);
    });

    return answers;
  };

  isAnswerRegenerationRequired = (nextProps) => {
    const { model: { choiceMode, layout, rows } = {} } = this.props;
    const { session: { answers } = {} } = nextProps;
    let isRequired = false;

    if (choiceMode !== nextProps.model.choiceMode) {
      isRequired = true;
    }

    if (layout !== nextProps.model.layout) {
      isRequired = true;
    }

    if (
      rows.length !== nextProps.model.rows.length ||
      (answers && nextProps.model.rows.length !== Object.keys(answers).length)
    ) {
      isRequired = true;
    }

    return isRequired || !answers;
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const regenAnswers = this.isAnswerRegenerationRequired(nextProps);

    this.setState(
      (state) => ({
        session: {
          ...nextProps.session,
          // regenerate answers if layout or choiceMode change
          answers: regenAnswers ? this.generateAnswers(nextProps.model) : nextProps.session.answers,
        },
        showCorrect:
          this.props.model.disabled && !nextProps.model.disabled && state.showCorrect ? false : state.showCorrect,
      }),
      () => {
        if (regenAnswers) this.callOnSessionChange();
      },
    );
  }

  callOnSessionChange = () => {
    const { onSessionChange } = this.props;

    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  toggleShowCorrect = (show) => {
    this.setState({ showCorrect: show });
  };

  onAnswerChange = (newAnswers) => {
    this.setState(
      (state) => ({
        session: {
          ...state.session,
          answers: newAnswers,
        },
      }),
      this.callOnSessionChange,
    );
  };

  render() {
    const { model, classes } = this.props;
    const { showCorrect, session } = this.state;
    const { correctness = {}, extraCSSRules, language } = model;
    const showCorrectAnswerToggle = correctness.correctness && correctness.correctness !== 'correct';

    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions = model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <UiLayout extraCSSRules={extraCSSRules} className={classes.mainContainer}>
        {showTeacherInstructions && (
          <Collapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
            className={classes.collapsible}
          >
            <PreviewPrompt prompt={model.teacherInstructions} />
          </Collapsible>
        )}

        {model.prompt && (
          <div className={classes.prompt}>
            <PreviewPrompt prompt={model.prompt} />
          </div>
        )}

        <CorrectAnswerToggle
          language={language}
          show={showCorrectAnswerToggle}
          toggled={showCorrect}
          onToggle={this.toggleShowCorrect}
        />

        <AnswerGrid
          showCorrect={showCorrect}
          correctAnswers={model.correctResponse}
          disabled={model.disabled}
          view={model.view}
          onAnswerChange={this.onAnswerChange}
          choiceMode={model.choiceMode}
          answers={showCorrect ? model.correctResponse || {} : session.answers}
          headers={model.headers}
          rows={model.rows}
        />

        {showRationale && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }} className={classes.collapsible}>
            <PreviewPrompt prompt={model.rationale} />
          </Collapsible>
        )}

        {model.feedback && <Feedback correctness={correctness.correctness} feedback={model.feedback} />}
      </UiLayout>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  main: {
    width: '100%',
  },
  prompt: {
    verticalAlign: 'middle',
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);
