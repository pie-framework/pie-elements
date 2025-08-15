import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, hasText, PreviewPrompt, UiLayout, hasMedia } from '@pie-lib/pie-toolbox/render-ui';
import { Chart, chartTypes, KeyLegend } from '@pie-lib/pie-toolbox/charting';
import isEqual from 'lodash/isEqual';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';

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
      showToggle,
      rationale,
      correctAnswer,
      language,
      env,
      showKeyLegend,
    } = model;

    let { correctedAnswer, extraCSSRules } = model;

    const correctData = (correctAnswer?.data || []).map((data) => ({ ...data, interactive: false, editable: false }));
    const { mode } = env || {};
    // need to make labels disabled in view mode PD-3928
    if (mode === 'view') {
      correctedAnswer = (correctedAnswer || []).map((data) => ({ ...data, editable: false }));
    }

    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions = model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <UiLayout extraCSSRules={extraCSSRules} className={classes.mainContainer}>
        {showTeacherInstructions && (
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
            labelsPlaceholders={{}}
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
            categoryDefaultLabel={studentNewCategoryDefaultLabel}
            language={language}
            labelsPlaceholders={{}}
            correctData={showToggle ? correctData : undefined}
          />
        )}
        {!showingCorrect && showKeyLegend && (<KeyLegend language={language}></KeyLegend>)}
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
