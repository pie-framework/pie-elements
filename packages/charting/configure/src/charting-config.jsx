import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/chart-toolbox/charting';
import { AlertDialog } from '@pie-lib/config-ui';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 2.5,
    display: 'flex',
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
  column: {
    flex: 1,
  },
});

const restoreCorrectAnswer = (correctAnswer, data) => {
  if (!correctAnswer) {
    return data;
  }

  let correctResponseDefinition = [];

  (data || []).forEach((category, currentIndex) => {
    const { editable, interactive } = category;

    const label = editable && correctAnswer[currentIndex]?.label ? correctAnswer[currentIndex].label : category.label;

    const value =
      interactive && correctAnswer[currentIndex]?.value ? correctAnswer[currentIndex].value : category.value;

    correctResponseDefinition[currentIndex] = {
      label: label,
      value: value,
      editable: category.editable,
      interactive: category.interactive,
    };
  });

  return correctResponseDefinition;
};

export class ChartingConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array,
    labelsPlaceholders: PropTypes.object,
    titlePlaceholder: PropTypes.object,
    showPixelGuides: PropTypes.bool,
    authorNewCategoryDefaults: PropTypes.object,
    chartingOptions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        open: false,
      },
    };
  }

  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  changeData = (data) => this.props.onChange({ ...this.props.model, data });

  changeAddRemoveEnabled = (value) => {
    const { model } = this.props;
    const correctAnswer = restoreCorrectAnswer(model.correctAnswer.data, model.data);

    if (!value) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: 'This change will remove any correct answer categories that are not part of the initial item configuration.',
          onConfirm: () =>
            this.handleAlertDialog(
              false,
              this.props.onChange({
                ...this.props.model,
                addCategoryEnabled: value,
                correctAnswer: { data: correctAnswer },
              }),
            ),
          onClose: () => this.handleAlertDialog(false),
        },
      });
    } else {
      this.props.onChange({ ...this.props.model, addCategoryEnabled: value });
    }
  };

  changeTitle = (title) => this.props.onChange({ ...this.props.model, title });

  changeLabel = (type, label) =>
    this.props.onChange({
      ...this.props.model,
      [type]: {
        ...this.props.model[type],
        label,
      },
    });

  render() {
    const {
      classes,
      model,
      charts,
      labelsPlaceholders,
      titlePlaceholder,
      showPixelGuides,
      authorNewCategoryDefaults,
      chartingOptions,
      mathMlOptions = {},
    } = this.props;
    const { dialog } = this.state;
    const { domain = {}, range = {} } = model || {};

    return (
      <div>
        <div className={classes.title}>Define Initial Chart Attributes</div>
        <div className={classes.container}>
          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to set up the chart as it will initially appear to students.</span>
            </Typography>

            <Chart
              defineChart={true}
              chartingOptions={chartingOptions}
              showPixelGuides={showPixelGuides}
              chartType={model.chartType}
              size={model.graph}
              domain={domain}
              range={range}
              charts={charts}
              // index is a property used for setting the correct answer data; it's needed in order to remove categories from other data sets from the same index it was removed from the initial data
              data={model.data.map((category, index) => ({
                ...category,
                index: index,
              }))}
              title={model.title}
              onDataChange={this.changeData}
              onChangeTitle={this.changeTitle}
              onChangeLabels={this.changeLabel}
              addCategoryEnabled={true}
              changeInteractiveEnabled={model.changeInteractiveEnabled}
              changeEditableEnabled={model.changeEditableEnabled}
              categoryDefaultLabel={authorNewCategoryDefaults?.label}
              categoryDefaults={authorNewCategoryDefaults}
              labelsPlaceholders={labelsPlaceholders}
              titlePlaceholder={titlePlaceholder?.label}
              mathMlOptions={mathMlOptions}
            />
            {model.changeAddCategoryEnabled && (
              <div>
                <Checkbox
                  checked={model.addCategoryEnabled}
                  onChange={(e) => {
                    this.changeAddRemoveEnabled(e.target.checked);
                  }}
                />
                {chartingOptions?.addCategory?.authoringLabel}
              </div>
            )}
            <AlertDialog
              open={dialog.open}
              title={dialog.title}
              text={dialog.text}
              onClose={dialog.onClose}
              onConfirm={dialog.onConfirm}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChartingConfig);
