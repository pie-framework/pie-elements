import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer } from '@pie-lib/graphing';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
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
      correctResponse,
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
            disabled={true}
            domain={domain}
            labels={labels}
            marks={correctResponse}
            onChangeMarks={onAnswersChange}
            range={range}
            size={size}
            title={title}
            toolbarTools={toolbarTools}
          />
        )}

        {
          teacherInstructions && hasText(teacherInstructions) && (
            <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
            </Collapsible>
          )
        }

        <br/>

        <div className={classes.prompt} dangerouslySetInnerHTML={{ __html: prompt }}/>

        <br/>

        <GraphContainer
          axesSettings={{ includeArrows: arrows }}
          backgroundMarks={backgroundMarks}
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

        <br/>

        {
          rationale && hasText(rationale) && (
            <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
              <div dangerouslySetInnerHTML={{ __html: rationale }}/>
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
  },
  prompt: { verticalAlign: 'middle' }
});

export default withStyles(styles)(Main);
