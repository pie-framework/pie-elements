import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
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
      categories: props.model.data,
      showingCorrect: false,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { model: { data: nextData = [] } = {} } = nextProps;
    const { categories } = prevState;

    if (!isEqual(nextData, categories)) {
      return { categories: nextData };
    }

    return null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model: { data: nextData = [] } = {} } = nextProps;
    const { model: { data = [] } = {} } = this.props;

    if (!isEqual(nextData, data)) {
      this.setState({ categories: nextData });
    }
  }

  changeData = (data) =>
    this.setState(
      {
        categories: data,
      },
      () => this.props.onAnswersChange(data),
    );

  toggleCorrect = (showingCorrect) => this.setState({ showingCorrect });

  render() {
    console.log(this.props.model.data, "props model .data")
    const { categories, showingCorrect } = this.state;
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

    console.log(categories, "categories in player")

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
        {teacherInstructions && hasText(teacherInstructions) && (
          <Collapsible
            className={classes.collapsible}
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </Collapsible>
        )}

        {prompt && <PreviewPrompt className="prompt" prompt={prompt} />}

        <CorrectAnswerToggle show={showToggle} toggled={showingCorrect} onToggle={this.toggleCorrect} />

        {showingCorrect && showToggle ? (
          <Chart
            className={classes.chart}
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
            className={classes.chart}
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
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  chart: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);
