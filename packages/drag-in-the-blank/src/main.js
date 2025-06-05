import React from 'react';
import PropTypes from 'prop-types';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { DragInTheBlank } from '@pie-lib/pie-toolbox/mask-markup';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';

const DraggableDragInTheBlank = withDragContext(DragInTheBlank);

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
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

    if(nextModel && !nextModel.correctResponse && this.state.showCorrectAnswer !== false){
      this.setState({ showCorrectAnswer: false });
    }
  }

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, onChange, value, classes } = this.props;
    const { extraCSSRules, prompt, mode, language, fontSizeFactor, autoplayAudioEnabled, customAudioButton } = model;
    const modelWithValue = { ...model, value };
    const showCorrectAnswerToggle = mode === 'evaluate';

    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions = model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <UiLayout extraCSSRules={extraCSSRules} id={'main-container'} className={classes.mainContainer} fontSizeFactor={fontSizeFactor}>
        {showTeacherInstructions && (
          <Collapsible
            className={classes.collapsible}
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={model.teacherInstructions} />
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

        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <DraggableDragInTheBlank {...modelWithValue} onChange={onChange} showCorrectAnswer={showCorrectAnswer} />

        {showRationale && (
          <Collapsible className={classes.rationale} labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={model.rationale} />
          </Collapsible>
        )}
      </UiLayout>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
    '& tr > td': {
      color: color.text(),
    },
    position: 'relative'
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  rationale: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);
