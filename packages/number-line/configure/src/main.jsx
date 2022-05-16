import { InputCheckbox, FeedbackConfig, FormSection } from '@pie-lib/config-ui';
import NumberTextField from './number-text-field';
import CardBar from './card-bar';
import {
  NumberLineComponent,
  dataConverter,
  tickUtils
} from '@pie-element/number-line';
import Size from './size';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Domain from './domain';
import Arrows from './arrows';
import PointConfig from './point-config';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import Ticks from './ticks';
import { model as defaultModel } from './defaults';
import { generateValidationMessage } from './utils';

const trimModel = model => ({
  ...model,
  feedback: undefined,
  prompt: undefined,
  graph: { ...model.graph, title: undefined },
  correctResponse: undefined
});

const {
  lineIsSwitched,
  switchGraphLine,
  toGraphFormat,
  toSessionFormat
} = dataConverter;

const styles = theme => ({
  maxNumberOfPoints: {
    width: '150px'
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      paddingRight: theme.spacing.unit * 2
    }
  },
  hide: {
    opacity: 0.5
  },
  resetDefaults: {
    margin: '20px 0'
  },
  pointTypeChooser: {
    margin: '20px 0'
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  section: {
    margin: 0,
    padding: 0
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px'
  },
  inlineFlexContainer: {
    display: 'inline-flex',
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    padding: '5px 0'
  }
});

export const toPointType = response => {
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

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { model: { graph: { availableTypes, maxNumberOfPoints }}} = props;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);

    this.graphChange({ height });
  }

  graphChange = o => {
    const { onChange } = this.props;
    const graph = { ...this.props.model.graph, ...o };
    onChange({ graph });
  };

  changeSize = ({ width, height }) => this.graphChange({ width, height });

  getAdjustedHeight = (availableTypes, maxNumberOfPoints) => {
    let onlyPFAvailable = true;

    Object.entries(availableTypes || {}).forEach(([type, value]) => {
      if (type !== 'PF' && value) {
        onlyPFAvailable = false;
        return;
      }
    });

    const height = maxNumberOfPoints && (maxNumberOfPoints === 1 || onlyPFAvailable)
      ? 100 : (50 + (maxNumberOfPoints || 20) * 25);

    return height;
  };

  changeMaxNoOfPoints = (e, maxNumberOfPoints) => {
    const { model : { graph: { availableTypes }}} = this.props;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);

    this.graphChange({ maxNumberOfPoints, height });
  };

  changeGraphTitle = title => this.graphChange({ title });

  changeTicks = ticks => {
    const { model, onChange } = this.props;
    const correctResponse = tickUtils.snapElements(
      model.graph.domain,
      ticks,
      model.correctResponse
    );
    const initialElements = tickUtils.snapElements(
      model.graph.domain,
      ticks,
      model.graph.initialElements
    );

    const graph = { ...this.props.model.graph, ticks, initialElements };
    onChange({ graph, correctResponse });
  };

  changeArrows = arrows => this.graphChange({ arrows });

  setDefaults = () => {
    const { graph: { availableTypes, maxNumberOfPoints }} = defaultModel;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);
    const graph = { ...cloneDeep(defaultModel.graph), height };

    this.props.onChange({ graph });
  };

  exhibitChanged = (event, value) => {
    const graph = { ...this.props.model.graph, exhibitOnly: value };
    this.props.onChange({ graph });
  };

  moveCorrectResponse = (index, el, position) => {
    const { onChange, model } = this.props;
    el.position = position;
    const update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    const correctResponse = [...model.correctResponse];
    correctResponse[index] = update;
    onChange({ correctResponse });
  };

  moveInitialView = (index, el, position) => {
    const { model, onChange } = this.props;
    el.position = position;
    const update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    const initialElements = [...this.props.model.graph.initialElements];
    initialElements[index] = update;
    const graph = { ...model.graph, initialElements };
    onChange({ graph });
  };

  availableTypesChange = availableTypes => {
    const { model, onChange } = this.props;
    const { correctResponse, graph: { maxNumberOfPoints }} = model;

    new Set(correctResponse.map(toPointType)).forEach(pointType => {
      availableTypes[pointType] = true;
    });

    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);
    const graph = { ...model.graph, availableTypes, height };

    onChange({ graph });
  };

  deleteCorrectResponse = indices => {
    const { model, onChange } = this.props;
    const correctResponse = model.correctResponse.filter((v, index) => {
      return !indices.some(d => d === index);
    });
    onChange({ correctResponse });
  };

  deleteInitialView = indices => {
    const { model, onChange } = this.props;
    const initialElements = model.graph.initialElements.filter((v, index) => {
      return !indices.some(d => d === index);
    });
    const graph = { ...model.graph, initialElements };
    onChange({ graph });
  };

  addCorrectResponse = data => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.push(toSessionFormat(data));
    onChange({ correctResponse });
  };

  addInitialView = data => {
    const { onChange, model } = this.props;
    const graph = { ...model.graph };
    graph.initialElements = graph.initialElements || [];
    graph.initialElements.push(toSessionFormat(data));
    onChange({ graph });
  };

  clearCorrectResponse = () => {
    const { onChange } = this.props;
    const correctResponse = [];
    onChange({ correctResponse });
  };

  clearInitialView = () => {
    const { model, onChange } = this.props;
    const initialElements = [];
    const graph = { ...model.graph, initialElements };
    onChange({ graph });
  };

  undoCorrectResponse = () => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.pop();
    onChange({ correctResponse });
  };

  undoInitialView = () => {
    const { onChange, model } = this.props;
    const graph = { ...model.graph };
    graph.initialElements = graph.initialElements || [];
    graph.initialElements.pop();
    onChange({ graph });
  };

  onAddElement = this.addInitialView;

  render() {
    const { classes, model, onChange, configuration } = this.props;

    const { graph, spellCheckEnabled, errors } = model || {};
    const { prompt = {}, spellCheck = {} } = configuration || {};
    const { widthError, domainError, maxError, pointsError, correctResponseError } = errors || {};
    const validationMessage = generateValidationMessage();

    const correctResponse = cloneDeep(model.correctResponse || []).map(
      toGraphFormat
    );

    const initialView = cloneDeep(graph.initialElements || []).map(
      toGraphFormat
    );
    const toolbarOpts = {};

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }

    return (
      <div className={classes.root}>

        {prompt.settings && (
          <FormSection label={prompt.label}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={prompt => onChange({ prompt })}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
            />
          </FormSection>
        )}
        <CardBar
          header="Attributes"
          info={<Tooltip
            classes={{tooltip: classes.tooltip}}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }}/>
          </Tooltip>}
        >
          Set up the number line by entering the domain and number of tick marks
          to display. Labels on the number line can be edited or removed by
          clicking on the label.
        </CardBar>

        {widthError && <div className={classes.errorText}>{widthError}</div>}
        {domainError && <div className={classes.errorText}>{domainError}</div>}
        {maxError && <div className={classes.errorText}>{maxError}</div>}

        <div className={classes.row}>
          <FormSection label={'Size'}>
            <Size size={graph} onChange={this.changeSize} />
          </FormSection>

          <FormSection label={'Domain'}>
            <Domain
              domain={graph.domain}
              onChange={domain => this.graphChange({ domain })}
            />
          </FormSection>
        </div>
        <div className={classes.row}>
          <FormSection label={'Ticks'}>
            <Ticks
              ticks={graph.ticks}
              onChange={this.changeTicks}
              domain={graph.domain}
            />
          </FormSection>
          <FormSection label={'Arrows'}>
            <Arrows arrows={graph.arrows} onChange={this.changeArrows} />
          </FormSection>
        </div>
        <FormSection label={'Title'}>
          <EditableHtml
            markup={graph.title || ''}
            onChange={this.changeGraphTitle}
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
          />
        </FormSection>
        <FormSection label={'Limits'}>
          <NumberTextField
            className={classes.maxNumberOfPoints}
            label="Max No of Elements"
            min={1}
            max={20}
            value={graph.maxNumberOfPoints}
            onChange={this.changeMaxNoOfPoints}
          />
        </FormSection>
        <Button
          variant="outlined"
          mini
          color="primary"
          onClick={this.setDefaults}
        >
          Reset to default values
        </Button>
        <br />
        <br />

        {!graph.exhibitOnly && (
          <div>
            <CardBar header="Correct Response">
              Select answer type and place it on the number line. Intersecting
              points, line segments and/or rays will appear above the number
              line.{' '}
              <i>
                Note: A maximum of 20 points, line segments or rays may be
                plotted.
              </i>
            </CardBar>

            {pointsError && <div className={classes.errorText}>{pointsError}</div>}
            {correctResponseError && <div className={classes.errorText}>{correctResponseError}</div>}

            <NumberLineComponent
              onMoveElement={this.moveCorrectResponse}
              onDeleteElements={this.deleteCorrectResponse}
              onAddElement={this.addCorrectResponse}
              onClearElements={this.clearCorrectResponse}
              onUndoElement={this.undoCorrectResponse}
              answer={correctResponse}
              //strip feedback for this model
              model={trimModel(model)}
            />
            <CardBar header="Available Types" mini>
              Click on the input options to be displayed to the students. All
              inputs will display by default.
            </CardBar>
            <div className={classes.pointTypeChooser}>
              <PointConfig
                onSelectionChange={this.availableTypesChange}
                selection={graph.availableTypes}
              />
            </div>
          </div>
        )}
        <CardBar header="Initial view/Make Exhibit">
          Use this number line to set a starting point, line segment or ray.
          This is optional. <br />
          This number line may also be used to make an exhibit number line,
          which can not be manipulated by a student.
        </CardBar>
        <NumberLineComponent
          onMoveElement={this.moveInitialView}
          onDeleteElements={this.deleteInitialView}
          onAddElement={this.onAddElement}
          onClearElements={this.clearInitialView}
          onUndoElement={this.undoInitialView}
          answer={initialView}
          model={trimModel(model)}
        />
        <InputCheckbox
          label="Make exhibit"
          className={classes.checkbox}
          checked={graph.exhibitOnly}
          onChange={this.exhibitChanged}
          value={'exhibitOnly'}
        />

        {!graph.exhibitOnly && (
          <React.Fragment>
            <br />
            <FeedbackConfig
              feedback={model.feedback}
              onChange={feedback => onChange({ feedback })}
              toolbarOpts={toolbarOpts}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
