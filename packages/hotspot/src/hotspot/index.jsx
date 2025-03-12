import React from 'react';
import PropTypes from 'prop-types';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { color, Collapsible, hasText, PreviewPrompt, UiLayout } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';

import Container from './container';

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
        customAudioButton
      },
      onSelectChoice,
      classes,
    } = this.props;
    const { showCorrect } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showCorrectAnswerToggle = isEvaluateMode && !responseCorrect;

    return (
      <UiLayout extraCSSRules={extraCSSRules} id={'main-container'} className={classes.main} fontSizeFactor={fontSizeFactor}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <Collapsible
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            className={classes.collapsible}
          >
            <PreviewPrompt className="prompt" prompt={teacherInstructions} />
          </Collapsible>
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

        {rationale && hasText(rationale) && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt className="prompt" prompt={rationale} />
          </Collapsible>
        )}
      </UiLayout>
    );
  }
}

HotspotComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  onSelectChoice: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

HotspotComponent.defaultProps = {
  classes: {},
};

const styles = (theme) => ({
  main: {
    color: color.text(),
    backgroundColor: color.background(),
    position: 'relative'
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  prompt: {
    fontSize: 'inherit',
  },
});

export default withStyles(styles)(HotspotComponent);
