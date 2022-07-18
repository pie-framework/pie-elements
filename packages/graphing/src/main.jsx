import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer } from '@pie-lib/graphing';
import {color, Collapsible, hasText, PreviewPrompt} from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    onAnswersChange: PropTypes.func
  };

  static defaultProps = {
    classes: {}
  };

  state = { showingCorrect: false };

  toggleCorrect = showingCorrect => this.setState({ showingCorrect });

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
      prompt,
      range,
      rationale,
      size,
      showToggle,
      title,
      teacherInstructions,
      toolbarTools
    } = model || {};
    const marks = answersCorrected || answer || [];

    return (
      <div className={classes.mainContainer}>
        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
        />

        {(showingCorrect && showToggle) && (
          <GraphContainer
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={backgroundMarks}
            coordinatesOnHover={coordinatesOnHover}
            disabled={true}
            domain={domain}
            labels={labels}
            marks={correctResponse.map(i => ({ ...i, correctness: 'correct' }))}
            onChangeMarks={onAnswersChange}
            range={range}
            size={size}
            title={title}
            toolbarTools={toolbarTools}
          />
        )}

        {
          teacherInstructions && hasText(teacherInstructions) && (
            <React.Fragment>
              <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
                <PreviewPrompt prompt={teacherInstructions} />
              </Collapsible>
              <br />
            </React.Fragment>
          )
        }

        {prompt && (
          <React.Fragment>
            <PreviewPrompt className="prompt" prompt={prompt} />
            <br />
          </React.Fragment>
        )}

        <GraphContainer
          axesSettings={{ includeArrows: arrows }}
          backgroundMarks={backgroundMarks}
          coordinatesOnHover={coordinatesOnHover}
          defaultTool={defaultTool}
          disabled={disabled}
          domain={domain}
          labels={labels}
          marks={marks}
          onChangeMarks={onAnswersChange}
          range={range}
          size={size}
          title={title}
          toolbarTools={toolbarTools}
        />

        <br />

        {
          rationale && hasText(rationale) && (
            <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
              <PreviewPrompt prompt={rationale} />
            </Collapsible>
          )
        }
      </div>
    );
  }
}

const styles = theme => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background()
  }
});

export default withStyles(styles)(Main);
