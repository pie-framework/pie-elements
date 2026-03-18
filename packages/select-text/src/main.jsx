import React from 'react';
import PropTypes from 'prop-types';
import { TextSelect, Legend } from '@pie-lib/text-select';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import generateModel from './utils';

import debug from 'debug';

const log = debug('@pie-ui:select-text');

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
});

const StyledTextSelect = styled(TextSelect)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
  whiteSpace: 'normal',
}));

const Prompt = styled('div')(({ theme }) => ({
  verticalAlign: 'middle',
  marginBottom: theme.spacing(1),
}));

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Types = {
  model: PropTypes.object,
  session: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
};

export class Main extends React.Component {
  static propTypes = Types;

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
    const { session, onSelectionChange } = this.props;
    const { showCorrectAnswer, model } = this.state;
    const { env, extraCSSRules } = model;
    const { mode } = env || {};

    const selectedTokens = showCorrectAnswer ? this.correctAnswer() : session.selectedTokens;
    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions =
      model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    log('[render] selectedTokens:', selectedTokens);

    return (
      <StyledUiLayout extraCSSRules={extraCSSRules}>
        {showTeacherInstructions &&
          (!model.animationsDisabled ? (
            <StyledCollapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            >
              <PreviewPrompt prompt={model.teacherInstructions} />
            </StyledCollapsible>
          ) : (
            <Prompt>
              <PreviewPrompt prompt={model.teacherInstructions} />
            </Prompt>
          ))}

        <Prompt>
          <PreviewPrompt prompt={model.prompt} />
        </Prompt>

        {!model.alwaysShowCorrect && (
          <CorrectAnswerToggle
            show={model.disabled && model.incorrect}
            toggled={showCorrectAnswer}
            onToggle={this.toggleShowCorrect}
            language={model.language}
          />
        )}

        <StyledTextSelect
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
        {mode === 'evaluate' && <Legend language={model.language} showOnlyCorrect={showCorrectAnswer} />}

        {showRationale &&
          (!model.animationsDisabled ? (
            <StyledCollapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
            >
              <PreviewPrompt prompt={model.rationale} />
            </StyledCollapsible>
          ) : (
            <Prompt>
              <PreviewPrompt prompt={model.rationale} />
            </Prompt>
          ))}

        {model.correctness && model.feedback && !showCorrectAnswer && (
          <Feedback correctness={model.correctness} feedback={model.feedback} />
        )}
      </StyledUiLayout>
    );
  }
}

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
    return <Main model={model} session={session} onSelectionChange={this.change} />;
  }
}
