import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    display: 'flex',
    flex: 1,
  },
  column: {
    flex: 1
  }
});

export class ChartingConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array
  };

  changeData = data => this.props.onChange({ ...this.props.model, data });

  changeTitle = title => this.props.onChange({ ...this.props.model, title });

  changeAddRemoveEnabled = value => this.props.onChange({ ...this.props.model, addCategoryEnabled: value });

  render() {
    const { classes, model, charts } = this.props;

    return (
      <div>
        Define Initial Chart Attributes

        <div className={classes.container}>
          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to set up the chart as it will initially appear to students.</span>
            </Typography>

            <Chart
              defineChart={true}
              chartType={model.chartType}
              size={model.graph}
              domain={model.domain}
              range={model.range}
              charts={charts}
              // index is a property used for setting the correct answer data; it's needed in order to remove categories from other data sets from the same index it was removed from the initial data
              data={model.data.map((category, index) => ({ ...category, index: index }))}
              title={model.title}
              onDataChange={this.changeData}
              onChangeTitle={this.changeTitle}
              addCategoryEnabled={true}
              categoryDefaultLabel={model.categoryDefaultLabel}
            />
             <div>
              <Checkbox
                checked={model.addCategoryEnabled}
                onChange={(e) => {
                  this.changeAddRemoveEnabled(e.target.checked)
                }}
              />
              Student can add categories
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChartingConfig);
