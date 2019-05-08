import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ChartConfig from '@pie-lib/charting-config';
import PartialScoringConfig from '@pie-lib/scoring-config';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';
import PointConfig from './point-config';

const log = debug('@pie-element:text-entry:configure');

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  tab: {
    marginTop: theme.spacing.unit * 2
  }
});

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.defaults = JSON.parse(JSON.stringify(props.model));
    this.state = {
      activeTab: 0,
      withLabels: true
    };
  }

  resetToDefaults = () => {
    this.props.onModelChanged(JSON.parse(JSON.stringify(this.defaults)));
  };

  onTabChange = (event, value) => {
    this.setState({ activeTab: value });
  };

  onChangeTabIndex = index => {
    this.setState({ activeTab: index });
  };

  onModelConfigChange = name => event => {
    this.props.model.graph[name] = event.target.checked;
    this.props.onModelChanged(this.props.model);
  };

  onChange = (graph, fieldName) => {
    const newValue = parseInt(graph[fieldName], 10);
    const points = this.props.model.correctResponse;
    const newPoints = [];

    points.forEach(point => {
      let [pointX, pointY] = point.split(',');
      pointX = parseInt(pointX, 10);
      pointY = parseInt(pointY, 10);

      switch (fieldName) {
        case 'domainMin': {
          if (pointX < newValue) {
            point = `${newValue},${pointY}`;
          }

          break;
        }

        case 'domainMax': {
          if (pointX > newValue) {
            point = `${newValue},${pointY}`;
          }

          break;
        }
        case 'rangeMin': {
          if (pointY < newValue) {
            point = `${pointX},${newValue}`;
          }

          break;
        }
        case 'rangeMax': {
          if (pointY > newValue) {
            point = `${pointX},${newValue}`;
          }

          break;
        }
      }

      newPoints.push(point);
    });

    this.props.model.correctResponse = newPoints;
    this.props.model.graph = { ...graph };
    this.props.onModelChanged(this.props.model);
  };

  onPointLabelChange = index => event => {
    const graph = this.props.model.graph;
    graph.pointLabels[index] = event.target.value;
    this.props.onModelChanged(this.props.model);
  };

  onPointValueChange = (pointIndex, pointCoordinateIndex) => event => {
    const points = this.props.model.correctResponse;
    const [pointX, pointY] = points[pointIndex].split(',');
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue)) {
      if (pointCoordinateIndex === 0) {
        points[pointIndex] = `${newValue},${pointY}`;
      } else {
        points[pointIndex] = `${pointX},${newValue}`;
      }

      this.props.onModelChanged(this.props.model);
    }
  };

  addPoint = () => {
    this.props.model.correctResponse.push('0,0');
    this.props.model.graph.pointLabels.push('');
    this.props.onModelChanged(this.props.model);
  };

  deletePoint = pointIndex => () => {
    const points = this.props.model.correctResponse;
    points.splice(pointIndex, 1);
    this.props.onModelChanged(this.props.model);
  };

  onMaxPointsChange = event => {
    const graph = this.props.model.graph;
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue)) {
      graph.maxPoints = newValue;

      this.props.onModelChanged(this.props.model);
    }
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  onToggleWithLabels = setTrue => () => {
    this.setState({
      withLabels: setTrue
    });
  };

  onPartialScoringChange = partialScoring => {
    this.props.model.partialScoring = this.props.model.partialScoring.map(partialScore => ({
      numberOfCorrect: partialScore.numberOfCorrect || '',
      scorePercentage: partialScore.scorePercentage || ''
    }));

    this.props.onModelChanged(this.props.model);
  };

  render() {
    const { classes, model } = this.props;
    const { graph } = model;

    log('[render] model', model);

    return (
      <div>
        <Tabs
          value={this.state.activeTab}
          onChange={this.onTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Design" />
          <Tab disabled={!graph.allowPartialScoring} label="Scoring" />
        </Tabs>
        <SwipeableViews
          axis="x"
          index={this.state.activeTab}
          onChangeIndex={this.onChangeTabIndex}
        >
          <div className={classes.tab}>
            <Typography component="div" type="body1">
              <span>
                In Plot Points, students identify coordinates or plot points on
                a graph by clicking on the graph.
              </span>
              <h2>Points</h2>
            </Typography>
            <GeneralConfigBlock
              config={graph}
              onToggleWithLabels={this.onToggleWithLabels}
              onModelConfigChange={this.onModelConfigChange}
              withLabels={this.state.withLabels}
            />
            <PointConfig
              withLabels={this.state.withLabels}
              model={model}
              config={graph}
              addPoint={this.addPoint}
              onMaxPointsChange={this.onMaxPointsChange}
              deletePoint={this.deletePoint}
              onPointValueChange={this.onPointValueChange}
              onPointLabelChange={this.onPointLabelChange}
            />
            <ChartConfig
              config={graph}
              onChange={this.onChange}
              resetToDefaults={this.resetToDefaults}
            />
            <FeedbackConfig
              feedback={model.feedback}
              onChange={this.onFeedbackChange}
            />
          </div>
          <div className={classes.tab}>
            <PartialScoringConfig
              numberOfCorrectResponses={model.correctResponse.length}
              partialScoring={!!model.partialScoring}
              onChange={this.onPartialScoringChange}
            />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(Configure);
