import React from 'react';
import PropTypes from 'prop-types';
import {CorrectAnswerToggle} from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { DragInTheBlank } from '@pie-lib/pie-toolbox/mask-markup';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import { color, Collapsible, hasText, PreviewPrompt, UiLayout } from '@pie-lib/pie-toolbox/render-ui';
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

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, onChange, value, classes } = this.props;
    const { extraCSSRules, prompt, mode, language, fontSizeFactor, autoplayAudioEnabled } = model;
    const modelWithValue = { ...model, value };
    const showCorrectAnswerToggle = mode === 'evaluate';
    // Safari, Firefox, and Edge do not support autoplay audio smoothly in our use case
    const addAutoplayAudio = autoplayAudioEnabled && !(/Safari|Firefox|Edg/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

    return (
      <UiLayout extraCSSRules={extraCSSRules} id={'main-container'} className={classes.mainContainer} fontSizeFactor={fontSizeFactor}>
        {model.teacherInstructions && hasText(model.teacherInstructions) && (
          <Collapsible
            className={classes.collapsible}
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={model.teacherInstructions} />
          </Collapsible>
        )}

        {prompt && <PreviewPrompt className="prompt" prompt={prompt} autoplayAudioEnabled={addAutoplayAudio} />}

        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <DraggableDragInTheBlank {...modelWithValue} onChange={onChange} showCorrectAnswer={showCorrectAnswer} />

        {model.rationale && hasText(model.rationale) && (
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
