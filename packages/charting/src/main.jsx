import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
import { Chart, chartTypes } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';

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
    };
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
      () => this.props.onAnswersChange(data)
    );

  render() {
    const { categories } = this.state;
    const { model, classes } = this.props;
    const {
      teacherInstructions,
      prompt,
      chartType,
      size,
      domain,
      range,
      title,
      editCategoryEnabled,
      addCategoryEnabled,
      categoryDefaultLabel,
      rationale,
      correctedAnswer,
    } = model;

    return (
      <div className={classes.mainContainer}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <React.Fragment>
            <Collapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions',
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
            </Collapsible>
            <br />
          </React.Fragment>
        )}

        {prompt && (
          <React.Fragment>
            <div
              className={classes.prompt}
              dangerouslySetInnerHTML={{ __html: prompt }}
            />
            <br />
          </React.Fragment>
        )}

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
          editCategoryEnabled={editCategoryEnabled}
          addCategoryEnabled={addCategoryEnabled}
          categoryDefaultLabel={categoryDefaultLabel}
        />

        <br />
        {rationale && hasText(rationale) && (
          <Collapsible
            labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
          >
            <div dangerouslySetInnerHTML={{ __html: rationale }} />
          </Collapsible>
        )}
      </div>
    );
  }
}

const styles = theme => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background(),
  },
  prompt: {
    verticalAlign: 'middle',
  },
});

export default withStyles(styles)(Main);
