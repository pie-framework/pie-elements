import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { Chart, chartTypes } from '@pie-lib/pie-toolbox/charting';
import isEqual from 'lodash/isEqual';
import CorrectAnswerToggle from '@pie-lib/pie-toolbox/correct-answer-toggle';

const compareAndAddCorrectness = (categories, answers) => {
  return categories.map((category, index) => {
    const answer = answers[index];

    const isLabelCorrect = answer && category.label === answer.label;
    const isValueCorrect = answer && category.value === answer.value;

    return {
      ...category,
      correctness: {
        label: isLabelCorrect ? 'correct' : 'incorrect',
        value: isValueCorrect ? 'correct' : 'incorrect',
      },
    };
  });
};

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

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.categories, this.props.categories)) {
      this.setState({ categories: this.props.categories });
    } else if (!isEqual(prevProps.model.data, this.props.model.data)) {
      this.setState({ categories: this.props.model.data });
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
      studentNewCategoryDefaultLabel,
      rationale,
      disabled,
      correctAnswer,
      language,
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

    const viewModeCategories =
      disabled &&
      categories.map((data) => {
        return {
          ...data,
          interactive: false,
          editable: false,
        };
      });

    const evaluateModeCategories =
      disabled && correctData.length > 0 ? compareAndAddCorrectness(categories, correctData) : viewModeCategories;

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

        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
          language={language}
        />

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
            categoryDefaultLabel={studentNewCategoryDefaultLabel}
            language={language}
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
            data={disabled ? evaluateModeCategories : categories}
            title={title}
            onDataChange={this.changeData}
            addCategoryEnabled={addCategoryEnabled}
            categoryDefaultLabel={studentNewCategoryDefaultLabel}
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
