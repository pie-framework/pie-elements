import React from 'react';
import { FormSection, InputContainer, AlertDialog, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
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
import Ticks from './ticks';
import { model as defaultModel } from './defaults';
import { generateValidationMessage } from './utils';
import * as math from 'mathjs';

const trimModel = (model) => ({
  ...model,
  feedback: undefined,
  prompt: undefined,
  teacherInstructions: undefined,
  graph: { ...model.graph, title: undefined, disabled: true },
  correctResponse: undefined,
});

const { lineIsSwitched, switchGraphLine, toGraphFormat, toSessionFormat } = dataConverter;
const { Panel, toggle } = settings;

let minorLimits = {};
let minorValues = {};
let majorValues = {};

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
    onConfigurationChanged: PropTypes.func.isRequired,
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

  componentDidMount() {
    const { configuration, model, onChange } = this.props;
    const { title } = configuration || {};
    const { titleEnabled: showTitle } = model || {};

    const titleEnabled = showTitle === undefined || showTitle === null ? title.enabled : showTitle;

    onChange && onChange({ ...model, titleEnabled });
  }

  graphChange = (obj) => {
    const { model, onChange } = this.props;
    let graph = { ...model.graph, ...obj };
    let respIndex = [];
    model.correctResponse.forEach((correctResp, key) => {
      if (
        correctResp.domainPosition < graph.domain.min ||
        correctResp.domainPosition > graph.domain.max ||
        (correctResp.size &&
          (correctResp.domainPosition + correctResp.size < graph.domain.min ||
            correctResp.domainPosition + correctResp.size > graph.domain.max))
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
          graph: model.graph,
        },
      });
    }
    //reload ticks value whenever domain and width is changed
    graph = this.reloadTicksData(graph);
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
    return maxNumberOfPoints && (maxNumberOfPoints === 1 || onlyPFAvailable)
      ? 100
      : 50 + (maxNumberOfPoints || 20) * 25;
  };

  changeMaxNoOfPoints = (e, maxNumberOfPoints) => {
    maxNumberOfPoints = Math.floor(maxNumberOfPoints);
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

  changeGraphTitle = (title) => this.graphChange({ title });

  /*
   * Gets triggered whenever ticks related data is changed by user.
   * */
  changeTicks = (object) => {
    const { model, onChange } = this.props;
    let { ticks } = object;
    const correctResponse = tickUtils.snapElements(model.graph.domain, ticks, model.correctResponse);
    const initialElements = tickUtils.snapElements(model.graph.domain, ticks, model.graph.initialElements);
    let updatedGraph = this.updateMajorValue({ ...model.graph, ticks });
    const graph = { ...updatedGraph, initialElements };
    onChange({ graph, correctResponse });
  };

  /*
   * This function is duplicated in controller/index.js
   * This function will reload ticks data whenever graph object is changed and also sets required tick object
   * for rendering Ticks Components.
   * @param graph object containing domain, ticks and width value
   * @return graph object with updated ticks values
   * */
  reloadTicksData = (graph) => {
    const { domain, ticks, width } = graph;
    //Set tick interval type if not present for legacy number line models depending upon minor value
    if (!ticks.tickIntervalType) {
      if (ticks.minor > 0.5) {
        ticks.tickIntervalType = 'Integer';
      } else {
        ticks.tickIntervalType = 'Decimal';
      }
    }
    // This section will calculate minor and major values array and assign respective value
    // to different tick types object
    minorLimits = tickUtils.getMinorLimits(domain, width);
    if (minorLimits.min >= 1) {
      /*
       * In this scenario only integer tick will be enabled
       * */
      ticks.tickIntervalType = 'Integer';
      ticks.minor =
        ticks.minor < 1
          ? math.number(math.ceil(minorLimits.min))
          : ticks.minor >= math.number(math.ceil(minorLimits.min)) &&
            ticks.minor <= math.number(math.floor(minorLimits.max))
          ? ticks.minor
          : math.number(math.ceil(minorLimits.min));
      ticks.integerTick = ticks.minor;
      minorValues = { decimal: [], fraction: [] };
      ticks.fractionTick = '0';
      ticks.decimalTick = 0;
    } else if (minorLimits.min >= 0 && minorLimits.max < 1) {
      /*
       * In this scenario only decimal or fraction tick will be enabled
       * */
      if (ticks.tickIntervalType === 'Integer') {
        ticks.tickIntervalType = 'Fraction';
      }
      minorValues = tickUtils.generateMinorValues(minorLimits);
      let minValue = math.number(math.fraction(minorValues.fraction[0]));
      let maxValue = math.number(math.fraction(minorValues.fraction[minorValues.fraction.length - 1]));
      if (ticks.minor < minValue || ticks.minor > maxValue) {
        switch (ticks.tickIntervalType) {
          case 'Fraction':
            ticks.minor = math.number(math.fraction(minorValues.fraction[minorValues.fraction.length - 1]));
            ticks.fractionTick = minorValues.fraction[minorValues.fraction.length - 1];
            ticks.decimalTick = minorValues.decimal[0];
            break;
          case 'Decimal':
          case 'Integer':
            ticks.minor = minorValues.decimal[minorValues.decimal.length - 1];
            ticks.decimalTick = minorValues.decimal[minorValues.decimal.length - 1];
            ticks.fractionTick = minorValues.fraction[0];
        }
      } else {
        switch (ticks.tickIntervalType) {
          case 'Fraction':
            let fraction = math.fraction(math.number(ticks.minor));
            ticks.fractionTick = fraction.n + '/' + fraction.d;
            ticks.decimalTick = ticks.decimalTick ? ticks.decimalTick : minorValues.decimal[0];
            break;
          case 'Decimal':
          case 'Integer':
            ticks.decimalTick = ticks.minor;
            ticks.fractionTick = ticks.fractionTick ? ticks.fractionTick : minorValues.fraction[0];
        }
      }
      ticks.integerTick = 1;
    } else if (minorLimits.min < 1 && minorLimits.max >= 1) {
      /*
       * In this scenario all integer, decimal or fraction tick will be enabled
       * */
      minorValues = tickUtils.generateMinorValues(minorLimits);
      if (!(ticks.minor >= minorLimits.min && ticks.minor <= minorLimits.max)) {
        if (minorLimits.min > 0.5) {
          ticks.tickIntervalType = 'Integer';
        }
        switch (ticks.tickIntervalType) {
          case 'Integer':
            ticks.minor = math.number(math.ceil(minorLimits.min));
            ticks.integerTick = ticks.minor;
            ticks.decimalTick = minorLimits.min > 0.5 ? 0 : minorValues.decimal[0];
            ticks.fractionTick = minorLimits.min > 0.5 ? '0' : minorValues.fraction[0];
            break;
          case 'Decimal':
            ticks.minor = minorValues.decimal[0];
            ticks.integerTick = 1;
            ticks.decimalTick = ticks.minor;
            ticks.fractionTick = minorValues.fraction[0];
            break;
          case 'Fraction':
            ticks.minor = math.number(math.fraction(minorValues.fraction[0]));
            ticks.integerTick = 1;
            ticks.decimalTick = minorValues.decimal[0];
            ticks.fractionTick = minorValues.fraction[0];
        }
      } else {
        switch (ticks.tickIntervalType) {
          case 'Integer':
            ticks.integerTick = ticks.minor;
            ticks.decimalTick = minorLimits.min > 0.5 ? 0 : minorValues.decimal[0];
            ticks.fractionTick = minorLimits.min > 0.5 ? '0' : minorValues.fraction[0];
            break;
          case 'Decimal':
            ticks.integerTick = 1;
            ticks.decimalTick = ticks.minor;
            ticks.fractionTick = minorValues.fraction[0];
            break;
          case 'Fraction':
            ticks.integerTick = 1;
            ticks.decimalTick = minorValues.decimal[0];
            let fraction = math.fraction(math.number(ticks.minor));
            ticks.fractionTick = fraction.n + '/' + fraction.d;
        }
      }
    }
    return this.updateMajorValue({ ...graph, ticks });
  };

  /*
   * This function is duplicated in controller/index.js
   * This function will update major value whenever minor value is changed or tick type is changed
   * @param graph object containing domain, ticks and width value
   * @return graph object with updated ticks values
   * */
  updateMajorValue = (graph) => {
    const { domain, ticks, width } = graph;
    majorValues = tickUtils.generateMajorValuesForMinor(ticks.minor, domain, width);
    if (majorValues.decimal.indexOf(ticks.major) === -1) {
      let currIndex = 0;
      if (ticks.tickIntervalType === 'Integer') {
        currIndex = majorValues.decimal.length > 4 ? 4 : majorValues.decimal.length - 1;
      } else {
        currIndex = majorValues.decimal.length - 1;
      }
      ticks.major = majorValues.decimal[currIndex];
    }
    graph.fraction = ticks.tickIntervalType === 'Fraction' && ticks.major < 1;
    return { ...graph, ticks };
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

    new Set(correctResponse.map(toPointType)).forEach((pointType) => {
      availableTypes[pointType] = true;
    });

    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);
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
    const { classes, model, onChange, configuration, onConfigurationChanged, uploadSoundSupport } = this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      instruction = {},
      teacherInstructions = {},
      title = {},
      prompt = {},
      rationale = {},
      spellCheck = {},
      mathMlOptions = {},
      numberLineDimensions = {},
      maxMaxElements = 20,
      hidePointConfigButtons = false,
      availableTools = ['PF'],
      settingsPanelDisabled = false,
    } = configuration || {};
    const {
      errors = {},
      spellCheckEnabled,
      toolbarEditorPosition,
      teacherInstructionsEnabled,
      titleEnabled,
      promptEnabled,
      rationaleEnabled,
    } = model || {};

    let { graph } = model;
    graph = this.reloadTicksData(graph);

    const { dialog, correctAnswerDialog } = this.state;
    const {
      correctResponseError,
      domainError,
      maxError,
      pointsError,
      prompt: promptError,
      rationale: rationaleError,
      teacherInstructions: teacherInstructionsError,
      widthError,
    } = errors || {};
    const validationMessage = generateValidationMessage();
    const correctResponse = cloneDeep(model.correctResponse || []).map(toGraphFormat);
    const initialModel = cloneDeep(model);
    initialModel['disabled'] = true;
    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      titleEnabled: title.settings && toggle(title.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onChange}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Properties: panelProperties,
            }}
          />
        }
      >
        <Typography component="div" type="body1" className={classes.description}>
          {instruction.label}
        </Typography>

        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptContainer}>
            <EditableHtml
              className={classes.teacherInstructions}
              markup={model.teacherInstructions || ''}
              onChange={(teacherInstructions) => onChange({ teacherInstructions })}
              nonEmpty={false}
              disableUnderline
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptContainer}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt || ''}
              onChange={(prompt) => onChange({ prompt })}
              nonEmpty={false}
              disableUnderline
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
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
            <Ticks
              ticks={graph.ticks}
              minorLimits={minorLimits}
              minorValues={minorValues}
              majorValues={majorValues}
              onChange={this.changeTicks}
            />
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
          minWidth={numberLineDimensions.min}
          maxWidth={numberLineDimensions.max}
          maxHeight={70}
          model={trimModel(initialModel)}
        />

        {titleEnabled && (
          <FormSection label={title?.label || 'Title'} className={classes.title}>
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
              pluginProps={getPluginProps(title?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </FormSection>
        )}

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
              minWidth={numberLineDimensions.min}
              maxWidth={numberLineDimensions.max}
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
            onChange({ graph });
            this.setState({ correctAnswerDialog: { open: false } });
          }}
          onConfirmText={'OK'}
          onCloseText={'Cancel'}
        />
        {rationaleEnabled && (
          <InputContainer label={rationale.label || 'Rationale'} className={classes.promptContainer}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={(rationale) => onChange({ rationale })}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              pluginProps={getPluginProps(rationale?.inputConfiguration)}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
