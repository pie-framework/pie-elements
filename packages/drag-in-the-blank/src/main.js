import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { DragInTheBlank } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
  '& tr > td': {
    color: color.text(),
  },
  position: 'relative',
});

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledRationale = styled(Collapsible)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    value: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: {},
  };

  state = {
    showCorrectAnswer: false,
  };

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model: nextModel } = nextProps;

    if (nextModel && !nextModel.correctResponse && this.state.showCorrectAnswer !== false) {
      this.setState({ showCorrectAnswer: false });
    }
  }

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, onChange, value } = this.props;
    const { extraCSSRules, prompt, mode, language, fontSizeFactor, autoplayAudioEnabled, customAudioButton } = model;
    const modelWithValue = { ...model, value };
    const showCorrectAnswerToggle = mode === 'evaluate';

    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions =
      model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <StyledUiLayout
        extraCSSRules={extraCSSRules}
        id={'main-container'}
        fontSizeFactor={fontSizeFactor}
      >
        {showTeacherInstructions && (
          <StyledCollapsible
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={model.teacherInstructions} />
          </StyledCollapsible>
        )}

        {prompt && (
          <PreviewPrompt
            className="prompt"
            prompt={prompt}
            autoplayAudioEnabled={autoplayAudioEnabled}
            customAudioButton={customAudioButton}
          />
        )}

        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <DragInTheBlank {...modelWithValue} onChange={onChange} showCorrectAnswer={showCorrectAnswer} />

        {showRationale && (
          <StyledRationale labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={model.rationale} />
          </StyledRationale>
        )}
      </StyledUiLayout>
    );
  }
}

export default Main;
