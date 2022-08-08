import * as React from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GridSetup } from '@pie-lib/graphing';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { applyConstraints, getGridValues, getLabelValues } from './utils';

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
  subtitleText: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit
  }
});

export class GraphingConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authoring: PropTypes.object,
    graphDimensions: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { domain, range, graph } = props.model || {};

    const gridValues = {
      domain: getGridValues(domain, graph.width, true),
      range: getGridValues(range, graph.height, true)
    };
    const labelValues = {
      domain: getLabelValues(domain.step),
      range: getLabelValues(range.step)
    };

    this.state = { gridValues, labelValues, showPixelGuides: false };
  };

  changeBackgroundMarks = backgroundMarks => {
    const model = { ...this.props.model, backgroundMarks };

    this.props.onChange(model);
  };

  changeLabels = labels => {
    const { model, onChange } = this.props;

    onChange({ ...model, labels });
  };

  changeTitle = title => {
    const { model, onChange } = this.props;

    onChange({ ...model, title });
  };

  onConfigChange = config => {
    const { model, onChange } = this.props;
    const { gridValues: oldGridValues, labelValues: oldLabelValues } = this.state;
    const updatedModel = { ...model, ...config };
    const { domain, includeAxes, graph, range, standardGrid } = updatedModel;
    const gridValues = { domain: [], range: [] };
    const labelValues = { domain: [], range: [] };

    if (includeAxes) {
      const domainConstraints = applyConstraints(domain, graph.width, oldGridValues.domain, oldLabelValues.domain);

      gridValues.domain = domainConstraints.gridValues || [];
      labelValues.domain = domainConstraints.labelValues || [];
    }

    if (standardGrid) {
      gridValues.range = gridValues.domain;
      labelValues.range = labelValues.domain;
      range.step = domain.step;
      range.labelStep = domain.labelStep;
    } else {
      if (includeAxes) {
        const rangeConstraints = applyConstraints(range, graph.height, oldGridValues.range, oldLabelValues.range);

        gridValues.range = rangeConstraints.gridValues || [];
        labelValues.range = rangeConstraints.labelValues || [];
      }
    }

    this.setState({ gridValues, labelValues });
    onChange(updatedModel);
  };

  onChangeView = (event, expanded) => {
    const { graphDimensions: { enabled } = {}} = this.props;

    if (enabled) {
      this.setState({ showPixelGuides: expanded });
    }
  };

  render() {
    const {
      authoring = {},
      availableTools = [],
      classes,
      graphDimensions = {},
      labelsPlaceholders,
      model,
      showLabels,
      showTitle,
      titlePlaceholder
    } = this.props;
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
    const { enabled: dimensionsEnabled, min, max, step } = graphDimensions || {};
    const { gridValues, labelValues, showPixelGuides } = this.state;

    const sizeConstraints = {
      min: Math.max(150, min),
      max: Math.min(800, max),
      step: step >= 1 ? Math.min(200, step) : 20
    };

    const displayedFields = {
      axisLabel: authoring.axisLabel,
      dimensionsEnabled,
      includeAxesEnabled: authoring.includeAxesEnabled,
      labelStep: authoring.labelStep,
      min: authoring.min,
      max: authoring.max,
      standardGridEnabled: authoring.standardGridEnabled,
      step: authoring.step
    };

    const displayGridSetup = authoring.enabled &&
      Object.values(displayedFields).some(field => typeof field === 'object' ? field.enabled : field);

    return (
      <div className={classes.container}>
        <div className={classes.gridConfig}>
          {displayGridSetup && (
            <GridSetup
              displayedFields={displayedFields}
              domain={domain}
              dimensionsEnabled={dimensionsEnabled}
              gridValues={gridValues}
              includeAxes={includeAxes}
              labelValues={labelValues}
              range={range}
              size={graph}
              sizeConstraints={sizeConstraints}
              standardGrid={standardGrid}
              onChange={this.onConfigChange}
              onChangeView={this.onChangeView}
            />
          )}
        </div>

        <div className={classes.graphConfig} key="graph">
          <Typography component="div" variant="subheading">
            <span>Define Graph Attributes</span>
          </Typography>

          <Typography component="div" variant="body1" className={classes.subtitleText}>
            <span>Use this interface to add/edit a title and/or labels, and to set background shapes</span>
          </Typography>

          <GraphContainer
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={[]}
            coordinatesOnHover={coordinatesOnHover}
            collapsibleToolbar={true}
            collapsibleToolbarTitle={'Add Background Shapes to Graph'}
            domain={domain}
            key="graphing-config"
            labels={labels}
            labelsPlaceholders={labelsPlaceholders}
            marks={backgroundMarks}
            onChangeLabels={this.changeLabels}
            onChangeMarks={this.changeBackgroundMarks}
            onChangeTitle={this.changeTitle}
            range={range}
            showLabels={showLabels}
            showPixelGuides={showPixelGuides}
            showTitle={showTitle}
            size={{ width: graph.width, height: graph.height }}
            title={title}
            titlePlaceholder={titlePlaceholder}
            toolbarTools={availableTools}
          />
        </div>
      </div>
    );
  }
};

export default withStyles(styles)(GraphingConfig);
