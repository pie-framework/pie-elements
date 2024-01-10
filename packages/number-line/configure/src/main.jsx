import React from 'react';
import { FormSection, InputContainer, AlertDialog, layout } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { NumberLineComponent, dataConverter, tickUtils } from '@pie-element/number-line';
import NumberTextField from './number-text-field';
import CardBar from './card-bar';
import Size from './size';
import PropTypes from 'prop-types';
import Domain from './domain';
import Arrows from './arrows';
import PointConfig from './point-config';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import * as math from 'mathjs';
import Ticks from './ticks';
import { model as defaultModel } from './defaults';
import { generateValidationMessage } from './utils';

const trimModel = (model) => ({
  ...model,
  feedback: undefined,
  prompt: undefined,
  teacherInstructions: undefined,
  graph: { ...model.graph, title: undefined, disabled: true },
  correctResponse: undefined,
});

// Object holding information related to tick and label interval values.
let ticksModel = {
  tickIntervalType: 'Fraction',
  integerTick: 0,
  fractionTick: '0/1',
  decimalTick: 0,
  fractionLabel: '0/1',
  decimalLabel: 0,
};
// Object holding data related to possible values for ticks and label interval in array.
let data = {
  minorLimits: {},
  minorValues: {},
  majorValues: {},
};

const { lineIsSwitched, switchGraphLine, toGraphFormat, toSessionFormat } = dataConverter;

const styles = (theme) => ({
  maxNumberOfPoints: {
    width: '150px',
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      paddingRight: theme.spacing.unit * 2,
    },
  },
  pointTypeChooser: {
    margin: `${theme.spacing.unit * 2.5}px 0`,
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  inlineFlexContainer: {
    display: 'inline-flex',
  },
  resetButton: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  description: {
    marginBottom: theme.spacing.unit * 2.5,
  },
});

export const toPointType = (response) => {
  function rest(response) {
    if (response.pointType) {
      if (response.direction) {
        return `${response.pointType[0]}${response.direction[0]}`;
      }

      return response.pointType[0];
    }

    return `${response.leftPoint[0]}${response.rightPoint[0]}`;
  }

  return `${response.type[0]}${rest(response)}`.toUpperCase();
};

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      model: {
        graph: { availableTypes, maxNumberOfPoints },
      },
    } = props;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);
    this.state = {
      dialog: {
        open: false,
        text: '',
      },
      correctAnswerDialog: {
        open: false,
        text: '',
      },
    };
    this.graphChange({ height });
  }

  graphChange = (obj) => {
    const { model, onChange } = this.props;
    const graph = { ...model.graph, ...obj };
    this.reloadTicksData(graph.domain, graph.width, graph.ticks);
    this.assignTicksModelToGraph(graph);
    onChange({ graph });
  };

  changeSize = ({ width, height }) => this.graphChange({ width, height });

  /*
   * This function gets called whenever the min, max or width for number line is changed
   * and it calculates ticks and label values and stores in ticks model.
   * @param domain containing min and max values.
   * @param width represents number line width
   * @param ticks represnt current values for minor and major.
   * */
  reloadTicksData = (domain, width, ticks) => {
    //check correct response
    const { model } = this.props;
    const graph = { ...model.graph };
    let respIndex = [];
    model.correctResponse.forEach((correctResp, key) => {
      if (
        correctResp.domainPosition < domain.min ||
        correctResp.domainPosition > domain.max ||
        (correctResp.size &&
          (correctResp.domainPosition + correctResp.size < domain.min ||
            correctResp.domainPosition + correctResp.size > domain.max))
      ) {
        respIndex.push(key);
      }
    });
    if (respIndex.length > 0) {
      this.setState({
        correctAnswerDialog: {
          open: true,
          text:
            'This\n' +
            'change would make it impossible for students to plot one or more elements in the current\n' +
            'correct answer. If you proceed, all such elements will be removed from the correct\n' +
            'answer.',
          indices: respIndex,
          graph: graph,
        },
      });
    }

    data.minorLimits = tickUtils.getMinorLimits(domain, width);
    data.minorValues = tickUtils.generateMinorValues(data.minorLimits);
    data.majorValues = {};
    const initTickModel = () => {
      if (ticks.tickIntervalType) ticksModel.tickIntervalType = ticks.tickIntervalType;
      //setting minor values
      if (ticks.minor < data.minorLimits.min || ticks.minor > data.minorLimits.max) {
        ticksModel.decimalTick = data.minorValues.decimal[0];
        ticksModel.fractionTick = data.minorValues.fraction[0];
      } else {
        ticksModel.decimalTick = math.number(ticks.minor);
        ticksModel.fractionTick = data.minorValues.fraction[data.minorValues.decimal.indexOf(ticksModel.decimalTick)];
      }
      if (Number.isInteger(ticksModel.decimalTick)) {
        ticksModel.integerTick = math.number(ticksModel.decimalTick);
      } else {
        const firstInteger = data.minorValues.decimal.find(function (el) {
          return Number.isInteger(el);
        });
        if (firstInteger) {
          const index = data.minorValues.decimal.indexOf(firstInteger);
          ticksModel.integerTick = math.number(firstInteger);
          if (ticksModel.tickIntervalType === 'Integer') {
            ticksModel.fractionTick = data.minorValues.fraction[index];
            ticksModel.decimalTick = data.minorValues.decimal[index];
          }
        } else {
          if (ticksModel.tickIntervalType === 'Integer') {
            ticksModel.tickIntervalType = 'Fraction';
            ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.decimal.length - 1];
            ticksModel.fractionTick = data.minorValues.fraction[data.minorValues.fraction.length - 1];
          }
          ticksModel.integerTick = data.minorValues.decimal.reduce((a, b) => {
            return Math.abs(b - ticksModel.decimalTick) < Math.abs(a - ticksModel.decimalTick) ? b : a;
          });
          if (!Number.isInteger(ticksModel.integerTick)) {
            ticksModel.integerTick = math.ceil(ticksModel.integerTick);
          }
        }
      }
      //setting major values
      data.majorValues = tickUtils.generateMajorValuesForMinor(ticksModel.decimalTick, data.minorValues);
      if (!ticks.major) {
        ticksModel.decimalLabel = data.majorValues.decimal[0];
        ticksModel.fractionLabel = data.majorValues.fraction[0];
      } else {
        ticksModel.decimalLabel = math.number(ticks.major);
        if (data.majorValues.decimal.indexOf(ticksModel.decimalLabel) === -1) {
          let currIndex = 0;
          if (ticksModel.tickIntervalType === 'Integer') {
            currIndex = 4;
          } else {
            currIndex = data.majorValues.decimal.length - 1;
          }
          while (currIndex !== 0) {
            let ticksData = { minor: ticksModel.decimalTick, major: data.majorValues.decimal[currIndex] };
            let out = tickUtils.buildTickData(domain, width, ticksData, { fraction: undefined });
            if (out.filter((x) => x.type === 'major').length > 1) {
              break;
            } else {
              currIndex = currIndex - 1;
            }
          }
          ticksModel.decimalLabel = data.majorValues.decimal[currIndex];
          ticksModel.fractionLabel = data.majorValues.fraction[currIndex];
        } else {
          ticksModel.fractionLabel =
            data.majorValues.fraction[data.majorValues.decimal.indexOf(ticksModel.decimalLabel)];
        }
      }
    };
    initTickModel();
  };

  /*
   * This function updates calculated ticks values to graph model.
   * @param graph object
   * */
  assignTicksModelToGraph = (graph) => {
    graph.ticks.minor = ticksModel.decimalTick;
    graph.ticks.major = ticksModel.decimalLabel;
    graph.ticks.tickIntervalType = ticksModel.tickIntervalType;
    graph.ticks.tickStep = ticksModel.fractionTick;
    graph.ticks.labelStep = ticksModel.fractionLabel;
  };

  getAdjustedHeight = (availableTypes, maxNumberOfPoints) => {
    let onlyPFAvailable = true;
    Object.entries(availableTypes || {}).forEach(([type, value]) => {
      if (type !== 'PF' && value) {
        onlyPFAvailable = false;
        return;
      }
    });
    return maxNumberOfPoints && (maxNumberOfPoints === 1 || onlyPFAvailable)
      ? 100
      : 50 + (maxNumberOfPoints || 20) * 25;
  };

  changeMaxNoOfPoints = (e, maxNumberOfPoints) => {
    maxNumberOfPoints = Math.floor(maxNumberOfPoints);
    if (this.isAvailableTypesGreaterThanMaxElements(this.props.model.graph.availableTypes, maxNumberOfPoints)) {
      this.setState({
        dialog: {
          open: true,
          text: 'To use this value, you must first remove one or more elements from the available types.',
        },
      });
      return;
    }
    if (this.props.model.correctResponse.length > maxNumberOfPoints) {
      this.setState({
        dialog: {
          open: true,
          text: 'To use this value, you must first remove one or more elements from the correct answers.',
        },
      });
      return;
    }
    const {
      model: {
        graph: { availableTypes },
      },
    } = this.props;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);

    this.graphChange({ maxNumberOfPoints, height });
  };

  /*
   * Validation check on wether available type of dot plot is greater than max elements allowed to plot.
   * @param availableTypes array of string.
   * @param maxElements number of max elements to use set by user.
   * @return boolean.
   * */
  isAvailableTypesGreaterThanMaxElements = (availableTypes, maxElements) => {
    let availableTypeCount = 0;
    Object.entries(availableTypes || {}).forEach(([type, value]) => {
      if (value) {
        availableTypeCount = availableTypeCount + 1;
      }
    });
    return availableTypeCount > maxElements;
  };

  changeGraphTitle = (title) => this.graphChange({ title });

  /*
   * Gets triggered whenever ticks related data is changed by user.
   * */
  changeTicks = (object) => {
    const { model, onChange } = this.props;
    const { ticks } = model.graph;
    ticks.minor = object.ticksModel.decimalTick;
    ticks.major = object.ticksModel.decimalLabel;
    ticks.tickIntervalType = object.ticksModel.tickIntervalType;
    ticks.tickStep = object.ticksModel.fractionTick;
    ticks.labelStep = object.ticksModel.fractionLabel;
    const correctResponse = tickUtils.snapElements(model.graph.domain, ticks, model.correctResponse);
    const initialElements = tickUtils.snapElements(model.graph.domain, ticks, model.graph.initialElements);
    const graph = { ...model.graph, ticks, initialElements };
    this.reloadTicksData(graph.domain, graph.width, graph.ticks);
    this.assignTicksModelToGraph(graph);
    onChange({ graph, correctResponse });
  };

  changeArrows = (arrows) => this.graphChange({ arrows });

  setDefaults = () => {
    const {
      graph: { availableTypes, maxNumberOfPoints },
    } = defaultModel;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);
    const graph = { ...cloneDeep(defaultModel.graph), height };

    this.props.onChange({ graph });
  };

  moveCorrectResponse = (index, el, position) => {
    el.position = position;

    const { onChange, model } = this.props;
    const update = toSessionFormat(el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el);
    const correctResponse = [...model.correctResponse];
    correctResponse[index] = update;

    onChange({ correctResponse });
  };

  availableTypesChange = (availableTypes) => {
    const { model, onChange } = this.props;
    const {
      correctResponse,
      graph: { maxNumberOfPoints },
    } = model;

    let availableTypeCount = 0;
    Object.entries(availableTypes || {}).forEach(([type, value]) => {
      if (value) {
        availableTypeCount = availableTypeCount + 1;
      }
    });
    if (maxNumberOfPoints < availableTypeCount) {
      this.props.model.graph.maxNumberOfPoints = availableTypeCount;
    }

    new Set(correctResponse.map(toPointType)).forEach((pointType) => {
      availableTypes[pointType] = true;
    });

    const height = this.getAdjustedHeight(availableTypes, this.props.model.graph.maxNumberOfPoints);
    const graph = { ...model.graph, availableTypes, height };

    onChange({ graph });
  };

  deleteCorrectResponse = (indices) => {
    const { model, onChange } = this.props;
    const correctResponse = model.correctResponse.filter((v, index) => !indices.some((d) => d === index));

    onChange({ correctResponse });
  };

  addCorrectResponse = (data) => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.push(toSessionFormat(data));

    onChange({ correctResponse });
  };

  clearCorrectResponse = () => {
    const { onChange } = this.props;

    onChange({ correctResponse: [] });
  };

  undoCorrectResponse = () => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.pop();
    onChange({ correctResponse });
  };

  render() {
    const { classes, model, onChange, configuration, uploadSoundSupport } = this.props;
    const {
      contentDimensions = {},
      instruction = {},
      teacherInstructions = {},
      prompt = {},
      mathMlOptions = {},
      numberLineDimensions = {},
      maxMaxElements = 20,
      hidePointConfigButtons = false,
      availableTools = ['PF'],
    } = configuration || {};
    const { errors = {}, graph, spellCheckEnabled, toolbarEditorPosition } = model || {};
    const { dialog, correctAnswerDialog } = this.state;

    const { widthError, domainError, maxError, pointsError, correctResponseError } = errors || {};
    const validationMessage = generateValidationMessage();

    const correctResponse = cloneDeep(model.correctResponse || []).map(toGraphFormat);

    const initialModel = cloneDeep(model);
    initialModel['disabled'] = true;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    return (
      <layout.ConfigLayout dimensions={contentDimensions} hideSettings={true} settings={null}>
        <Typography component="div" type="body1" className={classes.description}>
          {instruction.label}
        </Typography>

        {teacherInstructions.settings && (
          <InputContainer label={teacherInstructions.label} className={classes.promptContainer}>
            <EditableHtml
              className={classes.teacherInstructions}
              markup={model.teacherInstructions}
              onChange={(teacherInstructions) => onChange({ teacherInstructions })}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </InputContainer>
        )}

        {prompt.settings && (
          <InputContainer label={prompt.label} className={classes.promptContainer}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={(prompt) => onChange({ prompt })}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </InputContainer>
        )}

        <CardBar
          header="Set Up Number Line"
          info={
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px' }} />
            </Tooltip>
          }
        >
          Set up the number line by entering the domain and number of tick marks to display. Labels on the number line
          can be edited or removed by clicking on the label.
        </CardBar>

        <div className={classes.row}>
          <Domain domain={graph.domain} errors={errors} onChange={(domain) => this.graphChange({ domain })} />
        </div>

        {maxError && <div className={classes.errorText}>{maxError}</div>}
        {domainError && <div className={classes.errorText}>{domainError}</div>}

        <div>
          <FormSection>
            <Ticks ticksModel={ticksModel} data={data} onChange={this.changeTicks} />
          </FormSection>
        </div>

        <div className={classes.flexRow}>
          {model.widthEnabled && (
            <Size
              size={graph}
              min={numberLineDimensions.min}
              max={numberLineDimensions.max}
              step={numberLineDimensions.step}
              onChange={this.changeSize}
            />
          )}
          <div></div>
          <Arrows arrows={graph.arrows} onChange={this.changeArrows} />
        </div>

        {widthError && <div className={classes.errorText}>{widthError}</div>}

        <NumberLineComponent
          onMoveElement={() => {}}
          onDeleteElements={() => {}}
          onAddElement={() => {}}
          onClearElements={() => {}}
          onUndoElement={() => {}}
          model={trimModel(initialModel)}
        />

        <FormSection label={'Title'} className={classes.title}>
          <EditableHtml
            markup={graph.title || ''}
            onChange={this.changeGraphTitle}
            toolbarOpts={toolbarOpts}
            activePlugins={[
              'bold',
              'html',
              'italic',
              'underline',
              'strikethrough',
              'image',
              'math',
              'languageCharacters',
              'responseArea',
            ]}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </FormSection>

        {!graph.exhibitOnly && (
          <React.Fragment>
            <CardBar header="Define Tool Set and Correct Response">
              Select answer type and place it on the number line. Intersecting points, line segments and/or rays will
              appear above the number line. <i>Note: A maximum of 20 points, line segments or rays may be plotted.</i>
            </CardBar>

            <CardBar header="Available Tools" mini>
              Click on the input options to be displayed to the students. All inputs will display by default.
            </CardBar>

            <div className={classes.pointTypeChooser}>
              <PointConfig
                onSelectionChange={this.availableTypesChange}
                selection={graph.availableTypes}
                availableTools={availableTools}
                hideButtons={hidePointConfigButtons}
              />
            </div>

            <FormSection className={classes.flexRow}>
              <label>Max No of Elements</label>
              <NumberTextField
                className={classes.maxNumberOfPoints}
                min={1}
                max={maxMaxElements}
                onlyIntegersAllowed={true}
                value={graph.maxNumberOfPoints}
                onChange={this.changeMaxNoOfPoints}
              />
              {pointsError && <div className={classes.errorText}>{pointsError}</div>}
            </FormSection>

            <label>Correct Answer</label>

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
            {correctResponseError && <div className={classes.errorText}>{correctResponseError}</div>}
          </React.Fragment>
        )}
        <AlertDialog
          open={dialog.open}
          title="Warning"
          text={dialog.text}
          onConfirm={() => this.setState({ dialog: { open: false } })}
        />
        <AlertDialog
          open={correctAnswerDialog.open}
          title="Warning"
          text={correctAnswerDialog.text}
          onConfirm={() => {
            let indices = this.state.correctAnswerDialog.indices;
            if (indices && indices.length > 0) {
              this.deleteCorrectResponse(indices);
            }
            this.setState({ correctAnswerDialog: { open: false } });
          }}
          onClose={() => {
            const graph = this.state.correctAnswerDialog.graph;
            this.reloadTicksData(graph.domain, graph.width, graph.ticks);
            this.assignTicksModelToGraph(graph);
            onChange({ graph });
            this.setState({ correctAnswerDialog: { open: false } });
          }}
          onConfirmText={'OK'}
          onCloseText={'Cancel'}
        />
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
