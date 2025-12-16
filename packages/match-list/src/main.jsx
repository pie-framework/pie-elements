import React from 'react';
import PropTypes from 'prop-types';
import { swap } from '@pie-lib/drag';
import {
  DndContext,
} from '@dnd-kit/core';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, PreviewPrompt } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import uniqueId from 'lodash/uniqueId';
import isUndefined from 'lodash/isUndefined';
import findKey from 'lodash/findKey';
import AnswerArea from './answer-area';
import ChoicesList from './choices-list';

const MainContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: color.text(),
  backgroundColor: color.background(),
});

export class Main extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
    prompt: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();
    this.state = {
      showCorrectAnswer: false,
    };
  }

  onRemoveAnswer(id) {
    const { session, onSessionChange } = this.props;

    session.value[id] = undefined;

    onSessionChange(session);
  }

  onPlaceAnswer = (event) => {
    const { active, over } = event;

    if (!over || !active) {
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData && overData) {
      const { session, onSessionChange, model } = this.props;
      const { config: { duplicates } } = model;

      if (isUndefined(session.value)) {
        session.value = {};
      }

      const answerId = activeData.id;
      const targetPromptId = overData.promptId;

      // only allow dropping choices (not already placed answers) onto drop zones
      if (activeData.type === 'choice' && overData.type === 'drop-zone' && targetPromptId) {
        // check if this choice is already placed somewhere
        const existingPlacement = findKey(session.value, (val) => val === answerId);

        if (existingPlacement && !duplicates) {
          // swap if duplicates not allowed
          session.value = swap(session.value, existingPlacement, targetPromptId);
        } else {
          // place answer
          session.value[targetPromptId] = answerId;
        }

        onSessionChange(session);
      }
    }
  };

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, session } = this.props;
    const { config, mode } = model;
    const { prompt, language } = config;

    return (
      <DndContext onDragEnd={this.onPlaceAnswer}>
        <MainContainer>
          <PreviewPrompt className="prompt" prompt={prompt} />

          <CorrectAnswerToggle
            show={mode === 'evaluate'}
            toggled={showCorrectAnswer}
            onToggle={this.toggleShowCorrect}
            language={language}
          />

          <AnswerArea
            instanceId={this.instanceId}
            model={model}
            session={session}
            onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
            disabled={mode !== 'gather'}
            showCorrect={showCorrectAnswer}
          />

          <ChoicesList
            instanceId={this.instanceId}
            model={model}
            session={session}
            disabled={mode !== 'gather'}
            onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
          />

          {model.correctness && model.feedback && !showCorrectAnswer && (
            <Feedback correctness={model.correctness.correctness} feedback={model.feedback} />
          )}
        </MainContainer>
      </DndContext>
    );
  }
}

export default Main;
