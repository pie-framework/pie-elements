import React from 'react';
import PropTypes from 'prop-types';
import { TextSelect, prepareText } from '@pie-lib/text-select';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, Collapsible, hasText } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';

import debug from 'debug';

const log = debug('@pie-ui:select-text');

const Types = {
  model: PropTypes.object,
  session: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired
};

export class Main extends React.Component {
  static propTypes = { ...Types, classes: PropTypes.object.isRequired };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      showCorrectAnswer: false
    };

    const { model } = this.props;

    if(!model.unpreparedText) {
      const oldModel = {
        ...model
      };
      const newText = prepareText(oldModel.text);

      model.unpreparedText = oldModel.text;
      model.text = newText;
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ showCorrectAnswer: false });
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  correctAnswer = () => {
    const { model } = this.props;
    return model.tokens.filter(t => t.correct);
  };

  updateText = () => {
    const { model } = this.props;

    const oldModel = {
      ...model
    };
    const newText = prepareText(oldModel.text);

    model.unpreparedText = oldModel.text;
    model.text = newText;
  };

  render() {
    const { model, session, onSelectionChange, classes } = this.props;
    const { showCorrectAnswer } = this.state;

    if(!model.unpreparedText) {
      this.updateText();
    }

    const selectedTokens = showCorrectAnswer
      ? this.correctAnswer()
      : session.selectedTokens;

    log('[render] selectedTokens:', selectedTokens);

    return (
      <div className={classes.mainContainer}>
        {
          model.teacherInstructions && hasText(model.teacherInstructions) && (
            <React.Fragment>
              <Collapsible
                labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
                className={classes.collapsible}
              >
                <div dangerouslySetInnerHTML={{ __html: model.teacherInstructions }}/>
              </Collapsible>
              <br />
            </React.Fragment>
          )
        }
        <div
          className={classes.prompt}
          dangerouslySetInnerHTML={{ __html: model.prompt }}
        />
        <CorrectAnswerToggle
          show={model.disabled && model.incorrect}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        <TextSelect
          className={classes.textSelect}
          disabled={model.disabled}
          text={model.text}
          tokens={model.tokens}
          selectedTokens={selectedTokens}
          onChange={onSelectionChange}
          highlightChoices={model.highlightChoices}
          maxNoOfSelections={model.maxSelections}
        />
        {
          model.rationale && hasText(model.rationale) && (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
              className={classes.collapsible}
            >
              <div dangerouslySetInnerHTML={{ __html: model.rationale }}/>
            </Collapsible>
          )
        }
        {model.correctness && model.feedback && !showCorrectAnswer && (
          <Feedback correctness={model.correctness} feedback={model.feedback} />
        )}
      </div>
    );
  }
}

const StyledMain = withStyles(theme => ({
  mainContainer: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background()
  },
  textSelect: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    whiteSpace: 'normal'
  },
  prompt: {
    verticalAlign: 'middle',
    marginBottom: theme.spacing.unit
  },
  collapsible: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3
  }
}))(Main);

export default class Stateful extends React.Component {
  static propTypes = Types;

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      session: props.session
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model, session: nextProps.session });
  }

  change = selectedTokens => {
    const session = { ...this.state.session, selectedTokens };
    this.setState({ session }, () => {
      this.props.onSelectionChange(this.state.session.selectedTokens);
    });
  };

  render() {
    const { model, session } = this.state;
    return (
      <StyledMain
        model={model}
        session={session}
        onSelectionChange={this.change}
      />
    );
  }
}
