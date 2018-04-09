import React from 'react';
import { withStyles } from 'material-ui/styles';
import { PlotPoints, pointUtils as utils } from '@pie-lib/charting';
import { InputCheckbox, Checkbox, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Input from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import Controls from './controls';
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
  'options-column-container': {
    display: 'flex',
    'align-items': 'flex-start',
  },
  'options-column': {
    display: 'flex',
    flex: 1,
    'flex-direction': 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  'options-checkbox': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }
});

class Configure extends React.Component {
  static propTypes = {
    session: PropTypes.shape({
      points: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
        })
      )
    }),
    onSessionChange: PropTypes.func,
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const points = props.session && props.session.points || [];
    this.state = {
      session: { ...props.session, points },
      selection: [],
      showCorrect: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const points = nextProps.session && nextProps.session.points || [];
    const session = { ...nextProps.session, points };
    this.setState({ session });
  }

  addPoint = p => {
    const { pointLabels } = this.props.model;
    const points = utils.addPoint(this.state.session.points, p, pointLabels);
    const session = { ...this.state.session, points };
    log('[addPoint] points: ', session.points);
    this.setState({ session }, this.callOnSessionChange);
  };

  selectionChange = selection => {
    log('[selectionChange]: ', selection);
    this.setState({ selection });
  };

  callOnSessionChange = () => {
    const { onSessionChange } = this.props;
    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  deleteSelection = () => {
    const points = utils.removePoints(
      this.state.session.points,
      this.state.selection
    );

    const session = { ...this.state.session, points };
    this.setState({ session, selection: [] }, this.callOnSessionChange());
  };

  movePoint = (from, to) => {
    const points = utils.swapPoint(this.state.session.points, from, to);
    const session = { ...this.state.session, points };
    const selection = utils.swapPoint(this.state.selection, from, to);
    this.setState({ session, selection }, this.callOnSessionChange);
  };

  onModelConfigChange = (name) => event => {
    this.props.model[name] = event.target.checked;
    this.props.onModelChanged(this.props.model);
  };

  onPointLabelChange = (index) => event => {
    const session = this.state.session;
    session.points[index].label = event.target.value;
    this.setState({ session }, this.callOnSessionChange);
  };

  onRangeModelConfigChange = (name, shouldNotBeNumber) => event => {
    const newNumberValue = parseInt(event.target.value, 10);

    if (!shouldNotBeNumber && !isNaN(newNumberValue) || shouldNotBeNumber) {
      this.props.model.range[name] = shouldNotBeNumber ? event.target.value : newNumberValue;
      this.props.onModelChanged(this.props.model);
    }
  };

  onDomainModelConfigChange = (name, shouldNotBeNumber) => event => {
    const newNumberValue = parseInt(event.target.value, 10);

    if (!shouldNotBeNumber && !isNaN(newNumberValue) || shouldNotBeNumber) {
      this.props.model.domain[name] = shouldNotBeNumber ? event.target.value : newNumberValue;
      this.props.onModelChanged(this.props.model);
    }
  };

  render() {
    const { classes, model } = this.props;
    const { selection, session } = this.state;

    log('[render] model', model);

    return (
      <div>
        <Typography type="body1">
          <span>In Plot Points, students identify coordinates or plot points on a graph by clicking on the graph.</span>
          <span className={classes.title}>Plot the points</span>
          <span>Plot the points in the table against which the the student&#39;s response will be evaluated.</span>
        </Typography>
        <Controls
          disabled={!(selection && selection.length > 0)}
          onDeleteClick={this.deleteSelection}
        />
        <PlotPoints
          width={model.width}
          height={model.height}
          domain={model.domain}
          range={model.range}
          disabled={model.disabled || false}
          onAddPoint={this.addPoint}
          onSelectionChange={this.selectionChange}
          onMovePoint={this.movePoint}
          points={session.points}
          selection={selection}
        />
        <br />
        <Typography>
          Options
        </Typography>
        <br />
        <div className={classes['options-checkbox']}>
          <InputCheckbox
            label="Points Must Match Labels"
            checked={model.pointsMustMatchLabels}
            onChange={this.onModelConfigChange('pointsMustMatchLabels')} />
          <InputCheckbox
            label="Allow Partial Scoring"
            checked={model.allowPartialScoring}
            onChange={this.onModelConfigChange('allowPartialScoring')} />
        </div>
        <Box>
          <Typography>Point Labels</Typography>
          <br />
          <div className={classes['options-column-container']}>
            {session.points.length === 0 && <Typography>There are currently no points on the table.</Typography>}
            <div className={classes['options-column']}>
              {session.points.map((point, index) => index % 2 === 0 && (
                <InputContainer label={`Point ${index + 1}`} key={index}>
                  <Input
                    type="text"
                    onChange={this.onPointLabelChange(index)}
                    value={point.label}
                    placeholder="Enter Label"
                  />
                </InputContainer>
              ))}
            </div>
            <div className={classes['options-column']}>
              {session.points.map((point, index) => index % 2 === 1 && (
                <InputContainer label={`Point ${index + 1}`} key={index}>
                  <Input
                    type="text"
                    onChange={this.onPointLabelChange(index)}
                    value={point.label}
                    placeholder="Enter Label"
                  />
                </InputContainer>
              ))}
            </div>
          </div>
        </Box>
        <Box>
          <br />
          <div className={classes['options-column-container']}>
            <div className={classes['options-column']}>
              <Typography>Range Options</Typography>
              <InputContainer label="Label">
                <Input
                  type="text"
                  onChange={this.onRangeModelConfigChange('label', true)}
                  value={model.range.label}
                  placeholder="Enter Label"
                />
              </InputContainer>
              <InputContainer label="Minimum">
                <Input
                  type="number"
                  onChange={this.onRangeModelConfigChange('min')}
                  value={model.range.min}
                  placeholder="Enter Minimum"
                />
              </InputContainer>
              <InputContainer label="Maximum">
                <Input
                  type="number"
                  onChange={this.onRangeModelConfigChange('max')}
                  value={model.range.max}
                  placeholder="Enter Maximum"
                />
              </InputContainer>
              <InputContainer label="Step">
                <Input
                  type="number"
                  onChange={this.onRangeModelConfigChange('step')}
                  value={model.range.step}
                  placeholder="Enter Step"
                />
              </InputContainer>
              <InputContainer label="Snap">
                <Input
                  className={classes['options-input']}
                  type="number"
                  onChange={this.onRangeModelConfigChange('snap')}
                  value={model.range.snap}
                  placeholder="Enter Snap"
                />
              </InputContainer>
              <InputContainer label="Label Frequency">
                <Input
                  type="number"
                  onChange={this.onRangeModelConfigChange('labelFrequency')}
                  value={model.range.labelFrequency}
                  placeholder="Enter Label Frequency"
                />
              </InputContainer>
              <InputContainer label="Padding">
                <Input
                  type="number"
                  onChange={this.onRangeModelConfigChange('padding')}
                  value={model.range.padding}
                  placeholder="Enter Padding"
                />
              </InputContainer>
            </div>
            <div className={classes['options-column']}>
              <Typography>Domain Options</Typography>
              <InputContainer label="Label">
                <Input
                  type="text"
                  onChange={this.onDomainModelConfigChange('label', true)}
                  value={model.domain.label}
                  placeholder="Enter Label"
                />
              </InputContainer>
              <InputContainer label="Minimum">
                <Input
                  type="number"
                  onChange={this.onDomainModelConfigChange('min')}
                  value={model.domain.min}
                  placeholder="Enter Minimum"
                />
              </InputContainer>
              <InputContainer label="Maximum">
                <Input
                  type="number"
                  onChange={this.onDomainModelConfigChange('max')}
                  value={model.domain.max}
                  placeholder="Enter Maximum"
                />
              </InputContainer>
              <InputContainer label="Step">
                <Input
                  type="number"
                  onChange={this.onDomainModelConfigChange('step')}
                  value={model.domain.step}
                  placeholder="Enter Step"
                />
              </InputContainer>
              <InputContainer label="Snap">
                <Input
                  className={classes['options-input']}
                  type="number"
                  onChange={this.onDomainModelConfigChange('snap')}
                  value={model.domain.snap}
                  placeholder="Enter Snap"
                />
              </InputContainer>
              <InputContainer label="Label Frequency">
                <Input
                  type="number"
                  onChange={this.onDomainModelConfigChange('labelFrequency')}
                  value={model.domain.labelFrequency}
                  placeholder="Enter Label Frequency"
                />
              </InputContainer>
              <InputContainer label="Padding">
                <Input
                  type="number"
                  onChange={this.onDomainModelConfigChange('padding')}
                  value={model.domain.padding}
                  placeholder="Enter Padding"
                />
              </InputContainer>
            </div>
          </div>
        </Box>
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
