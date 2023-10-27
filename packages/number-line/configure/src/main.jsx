import React from 'react';
import { InputCheckbox, FeedbackConfig, FormSection, InputContainer, layout } from '@pie-lib/pie-toolbox/config-ui';
import EditableHtml from '@pie-lib/pie-toolbox/editable-html';
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
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import Ticks from './ticks';
import { model as defaultModel } from './defaults';
import { generateValidationMessage } from './utils';

const trimModel = (model) => ({
  ...model,
  feedback: undefined,
  prompt: undefined,
  graph: { ...model.graph, title: undefined },
  correctResponse: undefined,
});

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

    this.graphChange({ height });
  }

  graphChange = (obj) => {
    const { model, onChange } = this.props;
    const graph = { ...model.graph, ...obj };

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
    const {
      model: {
        graph: { availableTypes },
      },
    } = this.props;
    const height = this.getAdjustedHeight(availableTypes, maxNumberOfPoints);

    this.graphChange({ maxNumberOfPoints, height });
  };

  changeGraphTitle = (title) => this.graphChange({ title });

  changeTicks = (ticks) => {
    const { model, onChange } = this.props;
    const correctResponse = tickUtils.snapElements(model.graph.domain, ticks, model.correctResponse);
    const initialElements = tickUtils.snapElements(model.graph.domain, ticks, model.graph.initialElements);
    const graph = { ...model.graph, ticks, initialElements };

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

  exhibitChanged = (event, value) => {
    const graph = { ...this.props.model.graph, exhibitOnly: value };

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

  moveInitialView = (index, el, position) => {
    el.position = position;

    const { model, onChange } = this.props;
    const update = toSessionFormat(el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el);
    const initialElements = [...model.graph.initialElements];
    initialElements[index] = update;
    const graph = { ...model.graph, initialElements };

    onChange({ graph });
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

  deleteInitialView = (indices) => {
    const { model, onChange } = this.props;
    const initialElements = model.graph.initialElements.filter((v, index) => !indices.some((d) => d === index));
    const graph = { ...model.graph, initialElements };

    onChange({ graph });
  };

  addCorrectResponse = (data) => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.push(toSessionFormat(data));

    onChange({ correctResponse });
  };

  addInitialView = (data) => {
    const { onChange, model } = this.props;
    const graph = { ...model.graph };
    graph.initialElements = graph.initialElements || [];
    graph.initialElements.push(toSessionFormat(data));

    onChange({ graph });
  };

  clearCorrectResponse = () => {
    const { onChange } = this.props;

    onChange({ correctResponse: [] });
  };

  clearInitialView = () => {
    const { model, onChange } = this.props;
    const graph = { ...model.graph, initialElements: [] };

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

  render() {
    const { classes, model, onChange, configuration, uploadSoundSupport } = this.props;
    const { contentDimensions = {}, prompt = {}, mathMlOptions = {} } = configuration || {};
    const { errors, graph, spellCheckEnabled, toolbarEditorPosition } = model || {};

    const { widthError, domainError, maxError, pointsError, correctResponseError } = errors || {};
    const validationMessage = generateValidationMessage();

    const correctResponse = cloneDeep(model.correctResponse || []).map(toGraphFormat);
    const initialView = cloneDeep(graph.initialElements || []).map(toGraphFormat);

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    return (
      <layout.ConfigLayout dimensions={contentDimensions} hideSettings={true} settings={null}>
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
          header="Attributes"
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
          <FormSection label={'Size'}>
            <Size size={graph} onChange={this.changeSize} />
          </FormSection>

          <FormSection label={'Domain'}>
            <Domain domain={graph.domain} onChange={(domain) => this.graphChange({ domain })} />
          </FormSection>
        </div>

        {widthError && <div className={classes.errorText}>{widthError}</div>}
        {maxError && <div className={classes.errorText}>{maxError}</div>}
        {domainError && <div className={classes.errorText}>{domainError}</div>}

        <div className={classes.row}>
          <FormSection label={'Ticks'}>
            <Ticks ticks={graph.ticks} onChange={this.changeTicks} domain={graph.domain} />
          </FormSection>

          <FormSection label={'Arrows'}>
            <Arrows arrows={graph.arrows} onChange={this.changeArrows} />
          </FormSection>
        </div>

        <FormSection label={'Title'} className={classes.title}>
          <EditableHtml
            markup={graph.title || ''}
            onChange={this.changeGraphTitle}
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
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
          {pointsError && <div className={classes.errorText}>{pointsError}</div>}
        </FormSection>

        <Button className={classes.resetButton} variant="outlined" mini color="primary" onClick={this.setDefaults}>
          Reset to default values
        </Button>

        {!graph.exhibitOnly && (
          <React.Fragment>
            <CardBar header="Available Types" mini>
              Click on the input options to be displayed to the students. All inputs will display by default.
            </CardBar>

            <div className={classes.pointTypeChooser}>
              <PointConfig onSelectionChange={this.availableTypesChange} selection={graph.availableTypes} />
            </div>

            <CardBar header="Correct Response">
              Select answer type and place it on the number line. Intersecting points, line segments and/or rays will
              appear above the number line. <i>Note: A maximum of 20 points, line segments or rays may be plotted.</i>
            </CardBar>
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

        <CardBar header="Initial view/Make Exhibit">
          Use this number line to set a starting point, line segment or ray. This is optional. <br />
          This number line may also be used to make an exhibit number line, which can not be manipulated by a student.
        </CardBar>
        <NumberLineComponent
          onMoveElement={this.moveInitialView}
          onDeleteElements={this.deleteInitialView}
          onAddElement={this.addInitialView}
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
          <FeedbackConfig
            feedback={model.feedback}
            onChange={(feedback) => onChange({ feedback })}
            toolbarOpts={toolbarOpts}
          />
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
