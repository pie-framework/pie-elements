import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer } from '@pie-lib/graphing';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
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
      labels,
      labelsEnabled,
      prompt,
      range,
      rationale,
      size,
      showToggle,
      title,
      titleEnabled,
      teacherInstructions,
      toolbarTools,
    } = model || {};
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
          className={classes.toggle}
        />

        {showingCorrect && showToggle && (
          <GraphContainer
            className={classes.graph}
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={backgroundMarks}
            coordinatesOnHover={coordinatesOnHover}
            disabled={true}
            domain={domain}
            labels={labels}
            marks={correctResponse.map((i) => ({ ...i, correctness: 'correct' }))}
            onChangeMarks={onAnswersChange}
            range={range}
            size={size}
            title={title}
            toolbarTools={toolbarTools}
          />
        )}

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
        />

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
  toggle: {
    paddingBottom: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(Main);
