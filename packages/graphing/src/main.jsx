import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer } from '@pie-lib/pie-toolbox/graphing';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';

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
      labels,
      labelsEnabled,
      prompt,
      range,
      rationale,
      showToggle,
      title,
      titleEnabled,
      teacherInstructions,
      toolbarTools,
      language,
    } = model || {};
    const size = model?.size || model?.graph || {}; // need this for models that are not processed by controller
    const marks = answersCorrected || answer || [];

    return (
      <div className={classes.mainContainer}>
        {teacherInstructions && hasText(teacherInstructions) && (
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
            backgroundMarks={backgroundMarks}
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
            backgroundMarks={backgroundMarks}
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
          />
        )}

        {rationale && hasText(rationale) && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
      </div>
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
