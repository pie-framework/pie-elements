import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {color, Collapsible, hasText, PreviewPrompt} from '@pie-lib/render-ui';
import { Chart, chartTypes } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    onAnswersChange: PropTypes.func,
    categories: PropTypes.array,
  };

  static defaultProps = { classes: {} };

  constructor(props) {
    super(props);

    this.state = {
      categories: props.categories || props.model.data,
      showingCorrect: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model: { data: nextData = [] } = {} } = nextProps;
    const { model: { data = [] } = {} } = this.props;

    console.log(this.props, "this props in controler")

    if (!isEqual(nextData, data)) {
      this.setState({ categories: nextData });
    }
  }

  changeData = (data) =>
    this.setState(
      {
        categories: data,
      },
      () => this.props.onAnswersChange(data)
    );

  toggleCorrect = (showingCorrect) => this.setState({ showingCorrect });

  render() {
    const { categories, showingCorrect } = this.state;

    console.log(categories, " data in controller")
    const { model, classes } = this.props;
    const {
      teacherInstructions,
      prompt,
      chartType,
      size,
      domain,
      range,
      title,
      addCategoryEnabled,
      categoryDefaultLabel,
      rationale,
      correctedAnswer,
      correctAnswer,
    } = model;

    const correctData =
      correctAnswer && correctAnswer.data
        ? correctAnswer.data.map((data) => {
            return {
              ...data,
              interactive: false,
              editable: false,
            };
          })
        : [];

    const showToggle = correctData && correctData.length > 0;

    return (
      <div className={classes.mainContainer}>
        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
        />

        {teacherInstructions && hasText(teacherInstructions) && (
          <React.Fragment>
            <Collapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions',
              }}
            >
              <PreviewPrompt prompt={teacherInstructions} />
            </Collapsible>
            <br />
          </React.Fragment>
        )}

        {prompt && (
          <React.Fragment>
            <PreviewPrompt className="prompt" prompt={prompt} />
            <br />
          </React.Fragment>
        )}

        {showingCorrect && showToggle ? (
          <Chart
            chartType={chartType}
            size={size}
            domain={domain}
            range={range}
            charts={[
              chartTypes.Bar(),
              chartTypes.Histogram(),
              chartTypes.LineDot(),
              chartTypes.LineCross(),
              chartTypes.DotPlot(),
              chartTypes.LinePlot(),
            ]}
            data={correctData || categories}
            title={title}
            onDataChange={this.changeData}
            addCategoryEnabled={false}
            categoryDefaultLabel={categoryDefaultLabel}
          />
        ) : (
          <Chart
            chartType={chartType}
            size={size}
            domain={domain}
            range={range}
            charts={[
              chartTypes.Bar(),
              chartTypes.Histogram(),
              chartTypes.LineDot(),
              chartTypes.LineCross(),
              chartTypes.DotPlot(),
              chartTypes.LinePlot(),
            ]}
            data={correctedAnswer || categories}
            title={title}
            onDataChange={this.changeData}
            addCategoryEnabled={addCategoryEnabled}
            categoryDefaultLabel={categoryDefaultLabel}
          />
        )}

        <br />
        {rationale && hasText(rationale) && (
          <Collapsible
            labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
          >
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background(),
    overflow: 'hidden'
  }
});

export default withStyles(styles)(Main);
