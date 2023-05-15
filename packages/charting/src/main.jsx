import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
import { Chart, chartTypes } from '@pie-lib/charting';
import isArray from 'lodash/isArray';
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { categories: newCategories, model: { data: defaultCategories = [] } = {} } = nextProps;
    const { categories } = prevState;
    const nextCategories = isArray(newCategories) ? newCategories : defaultCategories;

    if (!isEqual(nextCategories, categories)) {
      return { categories: nextCategories };
    }

    return null;
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
      studentCategoryDefaultLabel,
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
            categoryDefaultLabel={studentCategoryDefaultLabel}
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
            categoryDefaultLabel={studentCategoryDefaultLabel}
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
