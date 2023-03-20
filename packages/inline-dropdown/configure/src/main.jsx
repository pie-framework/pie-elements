import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import { AlertDialog, InputContainer, layout, settings } from '@pie-lib/config-ui';
import { renderMath } from '@pie-lib/math-rendering';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import max from 'lodash/max';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Info from '@material-ui/icons/Info';
import InlineDropdownToolbar from './inline-dropdown-toolbar';
import { generateValidationMessage } from './utils';

const { toggle, Panel } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  markup: {
    minHeight: '100px',
    paddingBottom: theme.spacing.unit * 2.5,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '100px',
    },
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  text: {
    fontSize: theme.typography.fontSize + 2,
    marginRight: theme.spacing.unit,
  },
  rationaleLabel: {
    display: 'flex',
    whiteSpace: 'break-spaces',
  },
  rationaleChoices: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  panelDetails: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');

  div.innerHTML = (htmlString || '').trim();

  return div;
};

const prepareVal = (html) => {
  const tmp = document.createElement('DIV');

  tmp.innerHTML = html;

  const value = tmp.textContent || tmp.innerText || '';

  return value.trim();
};

export class Main extends React.Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  state = {
    warning: { open: false },
  };

  componentDidMount() {
    const {
      model: { choices },
    } = this.props;

    this.setState({ respAreaChoices: cloneDeep(choices) });
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const newState = {};

    if (
      !isEqual(nProps.model.choices, this.props.model.choices) ||
      !isEqual(nProps.model.choices, this.state.respAreaChoices)
    ) {
      newState.respAreaChoices = cloneDeep(nProps.model.choices);
    }

    if (!isEmpty(newState)) {
      this.setState(newState);
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onModelChange = (newVal) => {
    this.props.onModelChanged({ ...this.props.model, ...newVal });
  };

  onPromptChanged = (prompt) => {
    this.onModelChange({ prompt });
  };

  onRationaleChanged = (rationale) => {
    this.onModelChange({ rationale });
  };

  onChoiceRationaleChanged = (index, choice) => {
    const { model } = this.props;
    const indexOfChoice =
      model.choices &&
      model.choices[index] &&
      model.choices[index].findIndex((elem) => elem.label === choice.label && elem.value === choice.value);

    model.choices[index] && model.choices[index].splice(indexOfChoice, 1, choice);

    this.onModelChange(model);
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.onModelChange({ teacherInstructions });
  };

  onMarkupChanged = (slateMarkup) => {
    this.onModelChange({ slateMarkup });
  };

  onCheck = (callback) => {
    this.setState({
      warning: {
        open: true,
        text: 'Response areas with under 2 options or with no correct answers will be discarded.',
        onClose: () => {
          this.setState({ warning: { open: false } });
        },
        onConfirm: () => {
          this.setState({ warning: { open: false } }, callback);
        },
      },
    });
  };

  onChange = (markup) => {
    const { respAreaChoices } = this.state;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="inline_dropdown"]');
    const allChoices = {};

    allRespAreas.forEach((el) => {
      allChoices[el.dataset.index] = el.dataset.value || '';
    });

    const existingRespAreaChoices = reduce(
      respAreaChoices,
      (obj, choices, key) => {
        if (!isUndefined(allChoices[key])) {
          obj[key] = respAreaChoices[key];
        }

        return obj;
      },
      {},
    );

    const newRespAreaChoices = {};
    let shouldWarn = false;

    allRespAreas.forEach((el, index) => {
      const newChoices = existingRespAreaChoices[el.dataset.index] || [];

      if (newChoices.length < 2 || !newChoices.find((c) => c.correct)) {
        el.remove();
        shouldWarn = true;
      } else {
        newRespAreaChoices[index] = existingRespAreaChoices[el.dataset.index] || [];
        el.dataset.index = index;
      }
    });

    if (shouldWarn) {
      this.setState({
        warning: {
          open: true,
          text: 'Response areas with under 2 options or with no correct answers will be discarded.',
          onClose: () => {
            this.setState({ warning: { open: false } });
          },
          onConfirm: () => {
            this.setState({ warning: { open: false } }, () =>
              this.onModelChange({
                choices: cloneDeep(newRespAreaChoices),
                slateMarkup: domMarkup.innerHTML,
              }),
            );
          },
        },
      });
    } else {
      this.onModelChange({
        choices: cloneDeep(newRespAreaChoices),
        slateMarkup: domMarkup.innerHTML,
      });
    }
  };

  onAddChoice = (index, label) => {
    const { respAreaChoices } = this.state;
    const { maxResponseAreaChoices } = this.props.configuration;

    if (respAreaChoices[index] && respAreaChoices[index].length >= maxResponseAreaChoices) {
      this.setState({
        warning: {
          open: true,
          text: `There are only ${maxResponseAreaChoices} answers allowed per choice.`,
          onClose: undefined,
          onConfirm: () => {
            this.setState({ warning: { open: false } });
          },
        },
      });

      return;
    }

    if (!respAreaChoices[index]) {
      respAreaChoices[index] = [];
    }

    if ((respAreaChoices[index] || []).find((r) => prepareVal(r.label) === prepareVal(label))) {
      this.setState({
        warning: {
          open: true,
          text: 'Duplicate answers are not allowed.',
          onClose: undefined,
          onConfirm: () => {
            this.setState({ warning: { open: false } });
          },
        },
      });

      return;
    }

    const value =
      (respAreaChoices[index] &&
        max(respAreaChoices[index].map((c) => parseInt(c.value)).filter((val) => !isNaN(val)))) ||
      0;

    respAreaChoices[index].push({
      label,
      value: `${value + 1}`,
      correct: false,
    });

    this.onModelChange({ choices: cloneDeep(respAreaChoices) });
  };

  onRemoveChoice = (respIndex, index) => {
    const { respAreaChoices } = this.state;

    respAreaChoices[respIndex].splice(index, 1);

    this.onModelChange({ choices: cloneDeep(respAreaChoices) });
  };

  onSelectChoice = (respIndex, selectedIndex) => {
    const { respAreaChoices } = this.state;

    respAreaChoices[respIndex] = respAreaChoices[respIndex].map((choice, index) => ({
      ...choice,
      correct: index === selectedIndex,
    }));

    this.onModelChange({ choices: cloneDeep(respAreaChoices) });
  };

  render() {
    const { warning } = this.state;
    const { classes, model, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } = this.props;
    const {
      choiceRationale = {},
      lockChoiceOrder = {},
      maxResponseAreas,
      maxImageWidth = {},
      maxImageHeight = {},
      partialScoring = {},
      prompt = {},
      rationale = {},
      settingsPanelDisabled,
      spellCheck = {},
      teacherInstructions = {},
      withRubric = {},
    } = configuration || {};
    const {
      choiceRationaleEnabled,
      choices,
      errors,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};
    const { responseAreasError, responseAreaChoicesError } = errors || {};

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const renderChoiceRationale = () =>
      (Object.keys(choices) || []).map((key, index) => (
        <div key={key} className={classes.rationaleChoices}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.text}>{`Rationale for response area #${index + 1}`}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails className={classes.panelDetails}>
              {(choices[key] || []).map((choice) => (
                <InputContainer
                  key={choice.label}
                  label={
                    <span
                      className={classes.rationaleLabel}
                      dangerouslySetInnerHTML={{
                        __html: `${rationale.label} for ${choice.label} (${choice.correct ? 'correct' : 'incorrect'})`,
                      }}
                    />
                  }
                  className={classes.promptHolder}
                >
                  <EditableHtml
                    className={classes.prompt}
                    markup={choice.rationale || ''}
                    spellCheck={spellCheckEnabled}
                    onChange={(c) => this.onChoiceRationaleChanged(key, { ...choice, rationale: c })}
                    imageSupport={imageSupport}
                    maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                    maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                    uploadSoundSupport={uploadSoundSupport}
                  />
                </InputContainer>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ));

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const validationMessage = generateValidationMessage(configuration);

    const panelSettings = {
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
    };
    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      choiceRationaleEnabled: choiceRationale.settings && toggle(choiceRationale.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    return (
      <layout.ConfigLayout
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => this.onModelChange(model)}
            onChangeConfiguration={(configuration) => onConfigurationChanged(configuration, true)}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}

        <div className={classes.flexContainer}>
          <Typography className={classes.text}>Define Template, Choices, and Correct Responses</Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} />
          </Tooltip>
        </div>

        <EditableHtml
          activePlugins={ALL_PLUGINS}
          toolbarOpts={{ position: 'top' }}
          responseAreaProps={{
            type: 'inline-dropdown',
            options: {
              duplicates: true,
            },
            maxResponseAreas: maxResponseAreas,
            respAreaToolbar: (node, value, onToolbarDone) => {
              const { respAreaChoices } = this.state;

              return () => (
                <InlineDropdownToolbar
                  onAddChoice={this.onAddChoice}
                  onCheck={this.onCheck}
                  onRemoveChoice={(index) => this.onRemoveChoice(node.data.get('index'), index)}
                  onSelectChoice={(index) => this.onSelectChoice(node.data.get('index'), index)}
                  node={node}
                  value={value}
                  onToolbarDone={onToolbarDone}
                  choices={respAreaChoices[node.data.get('index')]}
                  spellCheck={spellCheckEnabled}
                  uploadSoundSupport={uploadSoundSupport}
                />
              );
            },
          }}
          spellCheck={spellCheckEnabled}
          className={classes.markup}
          markup={model.slateMarkup || ''}
          onChange={this.onChange}
          imageSupport={imageSupport}
          disableImageAlignmentButtons={true}
          onBlur={this.onBlur}
          disabled={false}
          highlightShape={false}
          error={responseAreasError}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
        />
        {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}
        {responseAreaChoicesError && <div className={classes.errorText}>{responseAreaChoicesError}</div>}

        {choiceRationaleEnabled && renderChoiceRationale()}

        {rationaleEnabled && (
          <InputContainer label={rationale.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChanged}
              imageSupport={imageSupport}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}

        <AlertDialog
          open={warning.open}
          title="Warning"
          text={warning.text}
          onClose={warning.onClose}
          onConfirm={warning.onConfirm}
        />
      </layout.ConfigLayout>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
