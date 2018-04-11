import React from 'react';
import { withStyles } from 'material-ui/styles';
import { InputRadio, InputCheckbox, InputContainer } from '@pie-lib/config-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { modelToFeedbackConfig, feedbackConfigToModel } from './feedback-mapper';
import DeleteControl from './delete';
import AddControl from './add-point';
import Box from './box';

const log = debug('@pie-element:text-entry:configure');

const styles = theme => ({
  title: {
    'font-size': '1.1rem',
    display: 'block',
    'margin-top': theme.spacing.unit * 2,
    'margin-bottom': theme.spacing.unit,
  },
  'hints-control-row': {
    'margin-top': theme.spacing.unit,
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'flex-start',
  },
  'points-column-container': {
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-between',
  },
  'points-row': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  'options-column-container': {
    display: 'flex',
    'justify-content': 'space-between',
  },
  'options-column': {
    display: 'flex',
    flex: 1,
    'flex-direction': 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  'options-checkbox': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  'with-labels-container': {
    display: 'flex',
  },
  'with-labels-radio-control': {
    display: 'flex',
  },
  'point-input': {
    display: 'flex',
    width: '10%',
    margin: theme.spacing.unit * 2,
    'margin-top': 0,
  },
  'max-input-container': {
    display: 'flex',
    'align-items': 'center',
    'flex-wrap': 'wrap',
    'justify-content': 'flex-start',
  },
  'max-input': {
    display: 'flex',
    width: '30px',
    margin: 0,
    'margin-left': theme.spacing.unit * 2,
  },
  'attribute-input': {
    width: '90%',
  },
  'graph-attributes-container': {
    display: 'flex',
    'flex-direction': 'column',
  },
  'display-controls-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit,
  },
  'display-options-container': {
    display: 'inline-block',
    marginTop: theme.spacing.unit,
    width: '50%',
  },
  'display-input': {
    width: '90%',
  },
});

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.defaults = JSON.parse(JSON.stringify(props.model));
  }

  resetToDefaults = () => {
    this.props.onModelChanged({ ...this.defaults });
  };

  onModelConfigChange = (name) => event => {
    this.props.model.model[name] = event.target.checked;
    this.props.onModelChanged(this.props.model);
  };

  onModelConfigAttributeChange = (name, shouldNotBeNumber, isCheckbox) => event => {
    const config = this.props.model.model.config;
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue) || shouldNotBeNumber || isCheckbox) {
      config[name] = shouldNotBeNumber ? (isCheckbox ? event.target.checked : event.target.value) : newValue;

      this.props.onModelChanged(this.props.model);
    }
  };

  onPointLabelChange = (index) => event => {
    const config = this.props.model.model.config;
    config.pointLabels[index] = event.target.value;
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
    this.props.model.model.config.pointLabels.push('');
    this.props.onModelChanged(this.props.model);
  };

  deletePoint = (pointIndex) => () => {
    const points = this.props.model.correctResponse;
    points.splice(pointIndex, 1);
    this.props.onModelChanged(this.props.model);
  };

  onMaxPointsChange = (event) => {
    const config = this.props.model.model.config;
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue)) {
      config.maxPoints = newValue;

      this.props.onModelChanged(this.props.model);
    }
  };

  onFeedbackChange = (feedbackConfig) => {
    const model = feedbackConfigToModel(feedbackConfig, this.props.model);
    this.props.onModelChanged(this.props.model);
  }

  onToggleWithLabels = (setTrue) => () => {
    this.props.model.model.config.showPointLabels = setTrue;
    this.props.onModelChanged(this.props.model);
  };

  render() {
    const { classes, model } = this.props;
    const config = model.model.config;
    const feedbackConfig = modelToFeedbackConfig(model);

    log('[render] model', model);

    return (
      <div>
        <Typography type="body1">
          <span>In Plot Points, students identify coordinates or plot points on a graph by clicking on the graph.</span>
        </Typography>
        <h2>Points</h2>
        <div className={classes['with-labels-container']}>
          <InputRadio
            className={classes['with-labels-radio-control']}
            checked={config.showPointLabels}
            onChange={this.onToggleWithLabels(true)}
            label="With Labels"
          />
          <InputRadio
            className={classes['with-labels-radio-control']}
            checked={config.showPointLabels === false}
            onChange={this.onToggleWithLabels(false)}
            label="Without Labels"
          />
        </div>
        <div className={classes['options-checkbox']}>
          <InputCheckbox
            label="Points Must Match Labels"
            checked={config.pointsMustMatchLabels}
            onChange={this.onModelConfigChange('pointsMustMatchLabels')}/>
        </div>
        <Box>
          <div className={classes['points-column-container']}>
            {model.correctResponse.length === 0 && <Typography>There are currently no points on the table.</Typography>}
            {model.correctResponse.map((point, index) => {
              const [pointX, pointY] = point.split(',');

              return (
                <div className={classes['points-row']} key={index}>
                  <b>(</b>
                  <Input
                    className={classes['point-input']}
                    type="number"
                    onChange={this.onPointValueChange(index, 0)}
                    value={pointX}
                    placeholder="Enter Value"
                  />
                  <b>,</b>
                  <Input
                    className={classes['point-input']}
                    type="number"
                    onChange={this.onPointValueChange(index, 1)}
                    value={pointY}
                    placeholder="Enter Value"
                  />
                  <b>)</b>
                  <Input
                    className={classes['point-input']}
                    type="text"
                    onChange={this.onPointLabelChange(index)}
                    value={config.pointLabels[index]}
                    placeholder="Enter Value"
                  />
                  <DeleteControl onDeleteClick={this.deletePoint(index)} disabled={false}/>
                </div>
              );
            })}
            <AddControl onAddClick={this.addPoint}/>
            <div className={classes['max-input-container']}>
              <Typography type="body1">
                Maximum number of points a student is allowed to plot (optional):
              </Typography>
              <Input
                className={classes['max-input']}
                type="number"
                onChange={this.onMaxPointsChange}
                value={config.maxPoints}
                placeholder="Enter Value"
              />
            </div>
          </div>
        </Box>
        <Box>
          <h2>Graph Attributes</h2>
          <Typography type="body1">
            <span>
              Use this section to setup the graph area. Note: Minimum value may not be greater than 0.
              Maximum value may not be less than 0. Minimum and maximum values can not be equal.
            </span>
          </Typography>
          <h3>Domain (X)</h3>
          <div className={classes['graph-attributes-container']}>
            <div className={classes['options-column-container']}>
              <div className={classes['options-column']}>
                <InputContainer label="Minimum Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('domainMin')}
                    value={config.domainMin}
                    placeholder="Enter Minimum"
                  />
                </InputContainer>
                <InputContainer label="Tick Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('domainStepValue')}
                    value={config.domainStepValue}
                    placeholder="Enter Tick"
                  />
                </InputContainer>
                <InputContainer label="Tick Label Frequency">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('domainLabelFrequency')}
                    value={config.domainLabelFrequency}
                    placeholder="Enter Tick Label Frequency"
                  />
                </InputContainer>
              </div>
              <div className={classes['options-column']}>
                <InputContainer label="Maximum Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('domainMax')}
                    value={config.domainMax}
                    placeholder="Enter Maximum"
                  />
                </InputContainer>
                <InputContainer label="Snap Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('domainSnapValue')}
                    value={config.domainSnapValue}
                    placeholder="Enter Snap"
                  />
                </InputContainer>
                <InputContainer label="Padding (%)">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    step={25}
                    onChange={this.onModelConfigAttributeChange('domainGraphPadding')}
                    value={config.domainGraphPadding}
                    placeholder="Enter Padding"
                  />
                </InputContainer>
              </div>
            </div>
          </div>
          <h3>Range (Y)</h3>
          <div className={classes['graph-attributes-container']}>
            <div className={classes['options-column-container']}>
              <div className={classes['options-column']}>
                <InputContainer label="Minimum Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('rangeMin')}
                    value={config.rangeMin}
                    placeholder="Enter Minimum"
                  />
                </InputContainer>
                <InputContainer label="Tick Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('rangeStepValue')}
                    value={config.rangeStepValue}
                    placeholder="Enter Tick"
                  />
                </InputContainer>
                <InputContainer label="Tick Label Frequency">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('rangeLabelFrequency')}
                    value={config.rangeLabelFrequency}
                    placeholder="Enter Tick Label Frequency"
                  />
                </InputContainer>
              </div>
              <div className={classes['options-column']}>
                <InputContainer label="Maximum Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('rangeMax')}
                    value={config.rangeMax}
                    placeholder="Enter Maximum"
                  />
                </InputContainer>
                <InputContainer label="Snap Value">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    onChange={this.onModelConfigAttributeChange('rangeSnapValue')}
                    value={config.rangeSnapValue}
                    placeholder="Enter Snap"
                  />
                </InputContainer>
                <InputContainer label="Padding (%)">
                  <Input
                    className={classes['attribute-input']}
                    type="number"
                    step={25}
                    onChange={this.onModelConfigAttributeChange('rangeGraphPadding')}
                    value={config.rangeGraphPadding}
                    placeholder="Enter Padding"
                  />
                </InputContainer>
              </div>
            </div>
          </div>
        </Box>
        <Box>
          <h2>Display</h2>
          <h4>Graph Labels</h4>
          <div className={classes['display-controls-container']}>
            <InputContainer label="Top">
              <Input
                className={classes['display-input']}
                type="text"
                onChange={this.onModelConfigAttributeChange('graphTitle', true)}
                value={config.graphTitle}
                placeholder="Enter Value"
              />
            </InputContainer>
            <InputContainer label="Left">
              <Input
                className={classes['display-input']}
                type="text"
                onChange={this.onModelConfigAttributeChange('domainLabel', true)}
                value={config.domainLabel}
                placeholder="Enter Value"
              />
            </InputContainer>
            <InputContainer label="Bottom">
              <Input
                className={classes['display-input']}
                type="text"
                onChange={this.onModelConfigAttributeChange('rangeLabel', true)}
                value={config.rangeLabel}
                placeholder="Enter Value"
              />
            </InputContainer>
          </div>
          <div className={classes['display-controls-container']}>
            <InputContainer label="Width">
              <Input
                className={classes['display-input']}
                type="number"
                onChange={this.onModelConfigAttributeChange('graphWidth')}
                value={config.graphWidth}
                placeholder="Enter Value"
              />
            </InputContainer>
            <InputContainer label="Height">
              <Input
                className={classes['display-input']}
                type="number"
                onChange={this.onModelConfigAttributeChange('graphHeight')}
                value={config.graphHeight}
                placeholder="Enter Value"
              />
            </InputContainer>
          </div>
          <div style={{ display: 'flex' }}>
            <div className={classes['display-options-container']}>
              <div className={classes['options-checkbox']}>
                <InputCheckbox
                  label="Show Point Labels"
                  checked={config.showPointLabels}
                  onChange={this.onModelConfigAttributeChange('showPointLabels', true, true)}/>
              </div>
              <div className={classes['options-checkbox']}>
                <InputCheckbox
                  label="Show Axis Labels"
                  checked={config.showAxisLabels}
                  onChange={this.onModelConfigAttributeChange('showAxisLabels', true, true)}/>
              </div>
            </div>
            <div className={classes['display-options-container']}>
              <div className={classes['options-checkbox']}>
                <InputCheckbox
                  label="Show Point Coordinates"
                  checked={config.showCoordinates}
                  onChange={this.onModelConfigAttributeChange('showCoordinates', true, true)}/>
              </div>
            </div>
          </div>
          <Button onClick={this.resetToDefaults}>
            <i>Reset to default values</i>
          </Button>
        </Box>
        <FeedbackConfig
          feedback={feedbackConfig}
          onChange={this.onFeedbackChange}/>
      </div>
    )
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    onModelChanged: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    this.onModelChanged = (m) => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    }
  }

  render() {
    const { model } = this.state;
    return <ConfigureMain model={model} onModelChanged={this.onModelChanged}/>
  }
}

export default StateWrapper;
