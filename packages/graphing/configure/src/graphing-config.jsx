import * as React from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GridSetup, tools } from '@pie-lib/graphing';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const { allTools = [] } = tools;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 7
  },
  gridConfig: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 3
  },
  graphConfig: {
    display: 'flex',
    flexDirection: 'column'
  },
  subheading: {
    marginBottom: theme.spacing.unit * 2
  },
  body: {
    marginBottom: theme.spacing.unit
  }
});

export class GraphingConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authoringEnabled: PropTypes.bool,
    graphDimensions: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  changeBackgroundMarks = backgroundMarks => {
    const model = { ...this.props.model, backgroundMarks };

    this.props.onChange(model);
  };

  onConfigChange = config => {
    const { model, onChange } = this.props;

    onChange({ ...model, ...config });
  };

  render() {
    const { classes, model, graphDimensions } = this.props;
    const {
      arrows,
      backgroundMarks,
      coordinatesOnHover,
      domain,
      includeAxes,
      labels,
      range,
      standardGrid,
      title
    } = model || {};
    const graph = (model || {}).graph || {};
    const { enabled, min, max, step } = graphDimensions || {};

    const constraints = {
      min: Math.max(150, min),
      max: Math.min(800, max),
      step: step >= 1 ? Math.min(200, step) : 20
    };

    return (
      <div className={classes.container}>
        <div className={classes.gridConfig}>
          <GridSetup
            domain={domain}
            dimensionsEnabled={enabled}
            includeAxes={includeAxes}
            range={range}
            size={graph}
            sizeConstraints={constraints}
            standardGrid={standardGrid}
            onChange={this.onConfigChange}
          />
        </div>

        <div className={classes.graphConfig} key="graph">
          <Typography component="div" variant="subheading2" className={classes.subheading}>
            <span>Define Graph Attributes</span>
          </Typography>

          <Typography component="div" variant="body1" className={classes.body}>
            <span>Use this interface to add/edit a title and/or labels, and to set background shapes</span>
          </Typography>

          <GraphContainer
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={[]}
            coordinatesOnHover={coordinatesOnHover}
            domain={domain}
            key="graphing-config"
            labels={labels}
            marks={backgroundMarks}
            onChangeMarks={this.changeBackgroundMarks}
            range={range}
            size={{ width: graph.width, height: graph.height }}
            title={title}
            toolbarTools={allTools}
          />
        </div>
      </div>
    );
  }
};

export default withStyles(styles)(GraphingConfig);
