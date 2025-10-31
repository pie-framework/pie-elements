import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { GraphContainer, KeyLegend } from '@pie-lib/graphing';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    onAnswersChange: PropTypes.func,
  };

  static defaultProps = {
    classes: {},
  };

  state = { showingCorrect: false };

  toggleCorrect = (showingCorrect) => this.setState({ showingCorrect });

  render() {
    const { model, classes, onAnswersChange, session } = this.props;
    const { showingCorrect } = this.state;
    const { answer } = session || {};
    const {
      answersCorrected,
      arrows,
      backgroundMarks,
      coordinatesOnHover,
      correctResponse,
      defaultTool,
      disabled,
      domain,
      extraCSSRules,
      labels,
      labelsEnabled,
      prompt,
      range,
      rationale,
      showKeyLegend,
      showToggle,
      title,
      titleEnabled,
      teacherInstructions,
      toolbarTools,
      language,
    } = model || {};
    const size = model?.size || model?.graph || {}; // need this for models that are not processed by controller
    const marks = answersCorrected || answer || [];
    const isLabelAvailable = toolbarTools?.includes('label') || false;
    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions =
      model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <UiLayout extraCSSRules={extraCSSRules} className={classes.mainContainer}>
        {showTeacherInstructions && (
          <Collapsible
            className={classes.teacherInstructions}
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </Collapsible>
        )}

        {prompt && <PreviewPrompt className="prompt" prompt={prompt} />}

        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
          language={language}
        />

        {showingCorrect && showToggle ? (
          <GraphContainer
            className={classes.graph}
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={backgroundMarks.filter((mark) => !mark.building)}
            coordinatesOnHover={coordinatesOnHover}
            disabled={true}
            disabledLabels={true}
            disabledTitle={true}
            domain={domain}
            labels={labels}
            marks={correctResponse.map((i) => ({ ...i, correctness: 'correct' }))}
            onChangeMarks={onAnswersChange}
            range={range}
            showLabels={labelsEnabled}
            showTitle={titleEnabled}
            size={size}
            title={title}
            toolbarTools={toolbarTools}
            language={language}
          />
        ) : (
          <GraphContainer
            className={classes.graph}
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={backgroundMarks.filter((mark) => !mark.building)}
            coordinatesOnHover={coordinatesOnHover}
            defaultTool={defaultTool}
            disabled={disabled}
            disabledLabels={true}
            disabledTitle={true}
            domain={domain}
            labels={labels}
            marks={marks}
            onChangeMarks={onAnswersChange}
            range={range}
            showLabels={labelsEnabled}
            showTitle={titleEnabled}
            size={size}
            title={title}
            toolbarTools={toolbarTools}
            language={language}
            limitLabeling={true}
          />
        )}
        {showKeyLegend && !showingCorrect && <KeyLegend isLabelAvailable={isLabelAvailable}></KeyLegend>}
        {showRationale && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={rationale} />
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
  },
  teacherInstructions: {
    marginBottom: theme.spacing.unit * 2,
  },
  graph: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);
