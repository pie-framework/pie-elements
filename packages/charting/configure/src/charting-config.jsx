import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';

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

  render() {
    const { classes, model, charts } = this.props;

    return (
      <div>
        Define Graph Attributes

        <div className={classes.container}>
          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to set background shapes</span>
            </Typography>

            <Chart
              defineChart={true}
              chartType={model.chartType}
              size={model.graph}
              domain={model.domain}
              range={model.range}
              charts={charts}
              data={model.data}
              title={model.title}
              onDataChange={this.changeData}
              editCategoryEnabled={true}
              addCategoryEnabled={true}
              categoryDefaultLabel={model.categoryDefaultLabel}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChartingConfig);
