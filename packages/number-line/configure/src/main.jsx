import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Checkbox, FeedbackConfig } from '@pie-lib/config-ui';
import NumberTextField from './number-text-field';

import {
  Graph,
  NumberLineComponent,
  dataConverter,
  tickUtils
} from '@pie-ui/number-line';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Domain from './domain';
import PointConfig from './point-config';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';

const {
  lineIsSwitched,
  switchGraphLine,
  toGraphFormat,
  toSessionFormat
} = dataConverter;

const styles = {
  row: {
    display: 'flex'
  },
  hide: {
    opacity: 0.5
  },
  resetDefaults: {
    margin: '20px 0'
  },
  pointTypeChooser: {
    margin: '20px 0'
  }
};

const defaultConfig = {
  domain: [0, 5],
  width: 500,
  height: 40,
  tickFrequency: 6,
  showMinorTicks: true,
  snapPerTick: 1,
  tickLabelOverrides: [],
  initialType: 'PF',
  exhibitOnly: false,
  availableTypes: {
    PF: true,
    PE: true,
    LFF: true,
    LEF: true,
    LFE: true,
    LEE: true,
    RFN: true,
    RFP: true,
    REN: true,
    REP: true
  },
  initialElements: []
};

class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onConfigChange: PropTypes.func.isRequired,
    onCorrectResponseChange: PropTypes.func.isRequired,
    onInitialElementsChange: PropTypes.func.isRequired,
    onAvailableTypesChange: PropTypes.func.isRequired,
    onDomainChange: PropTypes.func.isRequired,
    onFeedbackChange: PropTypes.func.isRequired,
    onSnapPerTickChange: PropTypes.func.isRequired,
    onMinorTicksChanged: PropTypes.func.isRequired,
    onTickFrequencyChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.setDefaults = this.setDefaults.bind(this);
    this.moveCorrectResponse = this.moveCorrectResponse.bind(this);
    this.deleteCorrectResponse = this.deleteCorrectResponse.bind(this);
    this.addCorrectResponse = this.addCorrectResponse.bind(this);
    this.availableTypesChange = this.availableTypesChange.bind(this);

    this.moveInitialView = this.moveInitialView.bind(this);
    this.addInitialView = this.addInitialView.bind(this);
    this.deleteInitialView = this.deleteInitialView.bind(this);
    this.exhibitChanged = this.exhibitChanged.bind(this);
  }

  getDomain() {
    let config = this.props.model.config;
    let domainArray = config.domain;
    return {
      min: domainArray[0],
      max: domainArray[1]
    };
  }

  setDefaults() {
    this.props.model.config = _.cloneDeep(defaultConfig);
    this.props.onConfigChange(this.props.model.config);
  }

  getTicks() {
    let config = this.props.model.config;
    return {
      major: config.tickFrequency || 2,
      minor: config.showMinorTicks ? config.snapPerTick || 0 : 0
    };
  }

  exhibitChanged(event, value) {
    this.props.model.config.exhibitOnly = value;
    this.props.onConfigChange(this.props.model.config);
  }

  moveCorrectResponse(index, el, position) {
    el.position = position;
    let update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    this.props.model.correctResponse[index] = update;
    this.props.onCorrectResponseChange(this.props.model.correctResponse);
  }

  moveInitialView(index, el, position) {
    el.position = position;
    let update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    this.props.model.config.initialElements[index] = update;
    this.props.onInitialElementsChange(this.props.model.config.initialElements);
  }

  availableTypesChange(availableTypes) {
    let toPointType = response => {
      function rest(response) {
        if (response.pointType) {
          if (response.direction) {
            return `${response.pointType[0]}${response.direction[0]}`;
          }
          return response.pointType[0];
        } else {
          return `${response.leftPoint[0]}${response.rightPoint[0]}`;
        }
      }
      return `${response.type[0]}${rest(response)}`.toUpperCase();
    };
    new Set(this.props.model.correctResponse.map(toPointType)).forEach(
      pointType => {
        availableTypes[pointType] = true;
      }
    );
    this.props.onAvailableTypesChange(availableTypes);
  }

  deleteCorrectResponse(indices) {
    this.props.model.correctResponse = this.props.model.correctResponse.filter(
      (v, index) => {
        return !indices.some(d => d === index);
      }
    );
    this.props.onCorrectResponseChange(this.props.model.correctResponse);
  }

  deleteInitialView(indices) {
    this.props.model.config.initialElements = this.props.model.config.initialElements.filter(
      (v, index) => {
        return !indices.some(d => d === index);
      }
    );
    this.props.onInitialElementsChange(this.props.model.config.initialElements);
  }

  addCorrectResponse(data) {
    this.props.model.correctResponse.push(toSessionFormat(data));
    this.props.onCorrectResponseChange(this.props.model.correctResponse);
  }

  addInitialView(data) {
    this.props.model.config.initialElements.push(toSessionFormat(data));
    this.props.onCorrectResponseChange(this.props.model.config.initialElements);
  }

  render() {
    const { classes, onDomainChange, model } = this.props;

    const { config } = model;
    const numberFieldStyle = {
      width: '50px',
      margin: '0 10px'
    };

    let noOp = () => {};

    let correctResponse = cloneDeep(model.correctResponse).map(toGraphFormat);
    let initialView = cloneDeep(config.initialElements).map(toGraphFormat);

    return (
      <div className={classes.root}>
        <p>
          In this interaction, students plot points, line segments or rays on a
          number line.
        </p>
        <Card>
          <CardContent>
            <Typography type="headline">Number Line Attributes</Typography>
            <p>
              Set up the number line by entering the domain and number of tick
              marks to display. Labels on the number line can be edited or
              removed by clicking on the label.
            </p>

            <Graph
              elements={[]}
              domain={this.getDomain()}
              ticks={this.getTicks()}
              interval={tickUtils.getInterval(
                this.getDomain(),
                this.getTicks()
              )}
              width={defaultConfig.width}
              height={defaultConfig.height}
              onAddElement={noOp}
              onMoveElement={noOp}
              onToggleElement={noOp}
              onDeselectElements={noOp}
            />
            <Domain domain={config.domain} onChange={onDomainChange} />
            <div>
              Number of Ticks:
              <NumberTextField
                value={config.tickFrequency}
                name="numberOfTicks"
                min={2}
                style={numberFieldStyle}
                onChange={this.props.onTickFrequencyChange.bind(this)}
              />
            </div>
            <div>
              <div className={classes.row}>
                <div
                  className={classNames(classes.minorTicks, {
                    [classes.hide]: !config.showMinorTicks
                  })}
                >
                  Minor Tick Frequency:
                  <NumberTextField
                    name="snapPerTick"
                    style={numberFieldStyle}
                    value={config.snapPerTick}
                    max={12}
                    onChange={this.props.onSnapPerTickChange.bind(this)}
                  />
                </div>
                <Checkbox
                  checked={config.showMinorTicks}
                  label={'Show'}
                  onChange={this.props.onMinorTicksChanged.bind(this)}
                  value={'showMinorTicks'}
                />
              </div>
            </div>
            <Button variant="contained" color="primary" onClick={this.setDefaults}>
              Reset to default values
            </Button>
          </CardContent>
        </Card>
        <br />

        {!config.exhibitOnly && (
          <Card>
            <CardContent>
              <Typography type="headline">Correct Response</Typography>
              <p>
                Select answer type and place it on the number line. Intersecting
                points, line segments and/or rays will appear above the number
                line.{' '}
                <i>
                  Note: A maximum of 20 points, line segments or rays may be
                  plotted.
                </i>
              </p>
              <NumberLineComponent
                onMoveElement={this.moveCorrectResponse}
                onDeleteElements={this.deleteCorrectResponse}
                onAddElement={this.addCorrectResponse}
                answer={correctResponse}
                //strip feedback for this model
                model={{
                  ...model,
                  feedback: undefined,
                  correctResponse: undefined
                }}
              />
              <hr />
              <Typography type="headline">Available Types</Typography>
              <p>
                Click on the input options to be displayed to the students. All
                inputs will display by default.
              </p>
              <div className={classes.pointTypeChooser}>
                <PointConfig
                  onSelectionChange={this.availableTypesChange}
                  selection={config.availableTypes}
                />
              </div>
            </CardContent>
          </Card>
        )}
        <br />
        <Card>
          <CardContent>
            <Typography type="headline">Initial view/Make Exhibit</Typography>
            <p>
              Use this number line to set a starting point, line segment or ray.
              This is optional.
            </p>
            <p>
              This number line may also be used to make an exhibit number line,
              which can not be manipulated by a student.
            </p>
            <NumberLineComponent
              onMoveElement={this.moveInitialView}
              onDeleteElements={this.deleteInitialView}
              onAddElement={this.addInitialView}
              answer={initialView}
              model={{
                ...model,
                feedback: undefined,
                correctResponse: undefined
              }}
            />
            <Checkbox
              label="Make exhibit"
              checked={config.exhibitOnly}
              onChange={this.exhibitChanged}
              value={'exhibitOnly'}
            />
          </CardContent>
        </Card>

        {!config.exhibitOnly && (
          <React.Fragment>
            <br />
            <FeedbackConfig
              feedback={model.feedback}
              onChange={this.props.onFeedbackChange.bind(this)}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
