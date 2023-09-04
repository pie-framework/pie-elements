import React from 'react';
import PropTypes from 'prop-types';
import { TextSelect, Legend } from '@pie-lib/text-select';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import generateModel from './utils';

import debug from 'debug';

const log = debug('@pie-ui:select-text');

const Types = {
  model: PropTypes.object,
  session: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
};

export class Main extends React.Component {
  static propTypes = { ...Types, classes: PropTypes.object.isRequired };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      showCorrectAnswer: this.props.model.alwaysShowCorrect || false,
      model: generateModel(props.model),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      showCorrectAnswer: !!nextProps.model.alwaysShowCorrect,
      model: generateModel(nextProps.model),
    });
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  correctAnswer = () => {
    const { model } = this.state;

    return model.tokens.filter((t) => t.correct);
  };

  render() {
    const { session, onSelectionChange, classes } = this.props;
    const { showCorrectAnswer, model } = this.state;
    const { env } = model;
    const { mode } = env || {};


    const selectedTokens = showCorrectAnswer ? this.correctAnswer() : session.selectedTokens;

    log('[render] selectedTokens:', selectedTokens);

    return (
      <div className={classes.mainContainer}>
        {model.teacherInstructions &&
          hasText(model.teacherInstructions) &&
          (!model.animationsDisabled ? (
            <Collapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              className={classes.collapsible}
            >
              <PreviewPrompt prompt={model.teacherInstructions} />
            </Collapsible>
          ) : (
            <div className={classes.prompt}>
              <PreviewPrompt prompt={model.teacherInstructions} />
            </div>
          ))}

        <div className={classes.prompt}>
          <PreviewPrompt prompt={model.prompt} />
        </div>

        {!model.alwaysShowCorrect && (
          <CorrectAnswerToggle
            show={model.disabled && model.incorrect}
            toggled={showCorrectAnswer}
            onToggle={this.toggleShowCorrect}
            language={model.language}
          />
        )}

        <TextSelect
          className={classes.textSelect}
          disabled={model.disabled}
          text={model.text}
          tokens={model.tokens}
          selectedTokens={selectedTokens}
          onChange={(selection) => {
            const newSelections = selection.map((select) => {
              const token = model.tokens.find(({ start, end }) => select.start === start && select.end === end);

              // needed for getScore when tokens position is recalculated, to keep oldStart and oldEnd
              if (token) {
                return token;
              }

              return select;
            });

            onSelectionChange(newSelections);
          }}
          highlightChoices={model.highlightChoices}
          maxNoOfSelections={model.maxSelections}
          animationsDisabled={model.animationsDisabled}
        />
        { mode === 'evaluate' && <Legend></Legend> }

        {model.rationale &&
          hasText(model.rationale) &&
          (!model.animationsDisabled ? (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
              className={classes.collapsible}
            >
              <PreviewPrompt prompt={model.rationale} />
            </Collapsible>
          ) : (
            <div className={classes.prompt}>
              <PreviewPrompt prompt={model.rationale} />
            </div>
          ))}

        {model.correctness && model.feedback && !showCorrectAnswer && (
          <Feedback correctness={model.correctness} feedback={model.feedback} />
        )}
      </div>
    );
  }
}

const StyledMain = withStyles((theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  textSelect: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    whiteSpace: 'normal',
  },
  prompt: {
    verticalAlign: 'middle',
    marginBottom: theme.spacing.unit,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
}))(Main);

export default class Stateful extends React.Component {
  static propTypes = Types;

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      session: props.session,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model, session: nextProps.session });
  }

  change = (selectedTokens) => {
    const session = { ...this.state.session, selectedTokens };
    this.setState({ session }, () => {
      this.props.onSelectionChange(this.state.session.selectedTokens);
    });
  };

  render() {
    const { model, session } = this.state;
    return <StyledMain model={model} session={session} onSelectionChange={this.change} />;
  }
}
