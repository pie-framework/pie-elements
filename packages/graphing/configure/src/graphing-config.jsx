import * as React from 'react';
import PropTypes from 'prop-types';
import { GraphContainer, GridSetup } from '@pie-lib/pie-toolbox/graphing';
import { AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
import { MenuItem, Select, Typography, OutlinedInput } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { applyConstraints, filterPlotableMarks, getGridValues, getLabelValues } from './utils';
import { isEqual } from 'lodash';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 2.5,
  },
  gridConfigWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2.5,
  },
  graphConfig: {
    display: 'flex',
    flexDirection: 'column',
  },
  subtitleText: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit,
  },
  gridConfig: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.unit * 2.5,
  },
  gridConfigLabel: {
    padding: `0 ${theme.spacing.unit}px`,
  },
  gridConfigSelect: {
    flex: '1',
  },
});

export class GraphingConfig extends React.Component {
  static propTypes = {
    availableTools: PropTypes.array,
    classes: PropTypes.object.isRequired,
    authoring: PropTypes.object,
    dimensionsEnabled: PropTypes.bool,
    graphDimensions: PropTypes.object,
    gridConfigurations: PropTypes.array,
    labelsPlaceholders: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    showLabels: PropTypes.bool,
    showTitle: PropTypes.bool,
    titlePlaceholder: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { domain, range, graph } = props.model || {};

    const gridValues = {
      domain: getGridValues(domain, graph.width, true),
      range: getGridValues(range, graph.height, true),
    };
    const labelValues = {
      domain: getLabelValues(domain.step),
      range: getLabelValues(range.step),
    };

    this.state = {
      gridValues,
      labelValues,
      showPixelGuides: false,
      dialog: { isOpened: false },
      domain: { ...domain },
      range: { ...range },
    };
  }

  changeBackgroundMarks = (backgroundMarks) => {
    const model = { ...this.props.model, backgroundMarks };

    this.props.onChange(model);
  };

  changeLabels = (labels) => {
    const { model, onChange } = this.props;

    onChange({ ...model, labels });
  };

  changeTitle = (title) => {
    const { model, onChange } = this.props;

    onChange({ ...model, title });
  };

  onConfigChange = (config, newSelectedGrid) => {
    const { model, onChange } = this.props;
    const { defaultGridConfiguration: oldSelectedGrid = 0 } = model;
    const { gridValues: oldGridValues, labelValues: oldLabelValues, domain: oldDomain, range: oldRange } = this.state;
    const updatedModel = { ...model, ...config };
    const { answers, domain, includeAxes, graph, range, standardGrid } = updatedModel;
    const gridValues = { domain: [], range: [] };
    const labelValues = { domain: [], range: [] };
    const selectedGrid = newSelectedGrid >= 0 ? newSelectedGrid : oldSelectedGrid;

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

    const plotableAnswers = filterPlotableMarks(domain, range, answers);

    if (!isEqual(answers, plotableAnswers)) {
      this.setState({
        dialog: {
          isOpened: true,
          onClose: () =>
            this.setState({ dialog: { isOpened: false } }, onChange({ ...model, domain: oldDomain, range: oldRange })),
          onConfirm: () => {
            this.setState(
              {
                gridValues,
                labelValues,
                dialog: { isOpened: false },
                domain: { ...domain },
                range: { ...range },
              },
              onChange({ ...updatedModel, answers: plotableAnswers, defaultGridConfiguration: selectedGrid }),
            );
          },
        },
      });

      return;
    }

    this.setState({ gridValues, labelValues, domain: { ...domain }, range: { ...range } });
    onChange({ ...updatedModel, defaultGridConfiguration: selectedGrid });
  };

  onChangeView = (event, expanded) => {
    const { graphDimensions: { enabled } = {} } = this.props;

    if (enabled) {
      this.setState({ showPixelGuides: expanded });
    }
  };

  changeGridConfiguration = (event) => {
    const { gridConfigurations } = this.props;
    const { value } = event.target;

    this.onConfigChange(gridConfigurations?.[value] || {}, value);
  };

  render() {
    const {
      authoring = {},
      availableTools = [],
      classes,
      gridConfigurations = [],
      graphDimensions = {},
      labelsPlaceholders,
      model,
      showLabels,
      dimensionsEnabled,
      showTitle,
      titlePlaceholder,
      mathMlOptions = {},
      removeIncompleteTool,
    } = this.props;
    const {
      arrows,
      backgroundMarks,
      coordinatesOnHover,
      defaultGridConfiguration,
      domain,
      includeAxes,
      labels,
      range,
      standardGrid,
      title,
    } = model || {};
    const graph = (model || {}).graph || {};
    const { min, max, step } = graphDimensions || {};
    const { dialog = {}, gridValues, labelValues, showPixelGuides } = this.state;

    const sizeConstraints = {
      min: Math.max(150, min),
      max: Math.min(800, max),
      step: step >= 1 ? Math.min(200, step) : 20,
    };

    const displayedFields = {
      axisLabel: authoring.axisLabel,
      dimensionsEnabled,
      includeAxesEnabled: authoring.includeAxesEnabled,
      labelStep: authoring.labelStep,
      min: authoring.min,
      max: authoring.max,
      standardGridEnabled: authoring.standardGridEnabled,
      step: authoring.step,
    };

    const displayGridSetup =
      authoring.enabled &&
      Object.values(displayedFields).some((field) => (typeof field === 'object' ? field.enabled : field));

    return (
      <div className={classes.container}>
        <div className={classes.gridConfigWrapper}>
          {gridConfigurations && gridConfigurations.length ? (
            <div className={classes.gridConfig}>
              <Typography component="div" variant="subheading" className={classes.gridConfigLabel}>
                Grid Configuration
              </Typography>

              <Select
                input={<OutlinedInput />}
                className={classes.gridConfigSelect}
                displayEmpty
                onChange={this.changeGridConfiguration}
                value={defaultGridConfiguration}
              >
                {(gridConfigurations || []).map((config, index) => (
                  <MenuItem key={index} value={index}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          ) : null}

          {displayGridSetup && (
            <GridSetup
              displayedFields={displayedFields}
              domain={domain}
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
            Define Graph Attributes
          </Typography>

          <Typography component="div" variant="body1" className={classes.subtitleText}>
            Use this interface to add/edit a title and/or labels, and to set background shapes
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
            mathMlOptions={mathMlOptions}
            removeIncompleteTool={removeIncompleteTool}
          />
        </div>

        <AlertDialog
          open={dialog.isOpened}
          title="Warning"
          text="This change would make it impossible for students to plot one or more graph objects in the current correct answers. If you proceed, all such graph objects will be removed from the correct answers."
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
        />
      </div>
    );
  }
}

export default withStyles(styles)(GraphingConfig);
