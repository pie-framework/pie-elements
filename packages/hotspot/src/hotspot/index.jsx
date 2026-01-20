import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Collapsible, hasText, PreviewPrompt, UiLayout, hasMedia } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';

import Container from './container';

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
  position: 'relative',
});

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

class HotspotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCorrect: false,
      observer: null,
      scale: 1,
    };
  }

  componentDidMount() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const target = document.getElementById('question-container')?.style?.cssText;
        const zoom = target?.substring(target.indexOf('--pie-zoom') + 11, target.lastIndexOf('%'));
        const zoomParsed = zoom?.replace(/\s/g, '');

        if (zoomParsed) {
          const newScale = parseFloat(zoomParsed) / 100;

          if (newScale !== this.state.scale) {
            this.setState({
              scale: parseFloat(zoomParsed) / 100,
            });
          }
        } else if (!zoomParsed && this.state.scale !== 1) {
          this.setState({
            scale: 1,
          });
        }
      });
    });

    const target = document.getElementById('question-container');

    if (target) {
      this.observer.observe(target, { attributes: true, attributeFilter: ['style'] });
    }
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  onToggle = () => {
    const { showCorrect } = this.state;
    this.setState({ showCorrect: !showCorrect });
  };

  render() {
    const {
      session,
      model: {
        disabled,
        extraCSSRules,
        imageUrl,
        prompt,
        mode,
        multipleCorrect,
        shapes,
        outlineColor,
        hotspotColor,
        hoverOutlineColor,
        selectedHotspotColor,
        dimensions,
        rationale,
        teacherInstructions,
        strokeWidth,
        responseCorrect,
        language,
        fontSizeFactor,
        autoplayAudioEnabled,
        customAudioButton,
      },
      onSelectChoice,
    } = this.props;
    const { showCorrect } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showCorrectAnswerToggle = isEvaluateMode && !responseCorrect;
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

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
            <PreviewPrompt className="prompt" prompt={teacherInstructions} />
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

        {showCorrectAnswerToggle && (
          <CorrectAnswerToggle
            show={showCorrectAnswerToggle}
            toggled={showCorrect}
            onToggle={this.onToggle.bind(this)}
            language={language}
          />
        )}

        {imageUrl ? (
          <Container
            isEvaluateMode={isEvaluateMode}
            session={session}
            dimensions={dimensions}
            imageUrl={imageUrl}
            hotspotColor={hotspotColor}
            hoverOutlineColor={hoverOutlineColor}
            selectedHotspotColor={selectedHotspotColor}
            multipleCorrect={multipleCorrect}
            outlineColor={outlineColor}
            onSelectChoice={onSelectChoice}
            shapes={shapes}
            disabled={disabled}
            strokeWidth={strokeWidth}
            scale={this.state.scale}
            showCorrect={showCorrect}
          />
        ) : null}

        {showRationale && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt className="prompt" prompt={rationale} />
          </Collapsible>
        )}
      </StyledUiLayout>
    );
  }
}

HotspotComponent.propTypes = {
  model: PropTypes.object.isRequired,
  onSelectChoice: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

export default HotspotComponent;
