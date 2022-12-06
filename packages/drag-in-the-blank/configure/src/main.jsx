import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import { InputContainer, layout, settings } from '@pie-lib/config-ui';
import { withDragContext } from '@pie-lib/drag';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import Choices from './choices';
import { createSlateMarkup } from './markupUtils';
import { generateValidationMessage } from '../utils';
const { dropdown, toggle, Panel } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
  markup: {
    minHeight: '235px',
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '235px',
    },
  },
  design: {
    paddingTop: theme.spacing.unit * 3,
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0,
  },
  addButton: {
    float: 'right',
  },
  text: {
    fontFamily: 'Cerebri Sans',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#495B8F',
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    padding: '5px 0',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'end',
  },
});

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
  };

  state = {};

  componentDidUpdate() {
    // eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onModelChange = (newVal) => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal,
    });
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt,
    });
  };

  onRationaleChanged = (rationale) => {
    this.props.onModelChanged({
      ...this.props.model,
      rationale,
    });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions,
    });
  };

  onMarkupChanged = (slateMarkup) => {
    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup,
    });
  };

  onResponsesChanged = (choices) => {
    const {
      model: { correctResponse, markup },
    } = this.props;
    const slateMarkup = createSlateMarkup(markup, choices, correctResponse);

    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup,
      choices,
    });
  };

  render() {
    const { classes, model, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } = this.props;
    const {
      duplicates = {},
      prompt = {},
      partialScoring = {},
      lockChoiceOrder = {},
      rationale = {},
      teacherInstructions = {},
      choicesPosition = {},
      spellCheck = {},
      maxChoices,
      maxResponseAreas,
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
    } = configuration || {};
    const { rationaleEnabled, promptEnabled, teacherInstructionsEnabled, spellCheckEnabled, errors, rubricEnabled } =
      model || {};
    const toolbarOpts = {};

    const { responseAreasError, choicesError } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }
    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              configuration={configuration}
              onChangeModel={(model) => this.onModelChange(model)}
              onChangeConfiguration={(configuration) => onConfigurationChanged(configuration, true)}
              groups={{
                Settings: {
                  partialScoring: partialScoring.settings && toggle(partialScoring.label),
                  duplicates: duplicates.settings && toggle(duplicates.label),
                  lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
                  choicesPosition:
                    choicesPosition.settings && dropdown(choicesPosition.label, ['above', 'below', 'left', 'right']),
                },
                Properties: {
                  teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
                  rationaleEnabled: rationale.settings && toggle(rationale.label),
                  spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
                },
              }}
            />
          }
        >
          <div>
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
                <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }} />
              </Tooltip>
            </div>
            {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}
            {choicesError && <div className={classes.errorText}>{choicesError}</div>}
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              responseAreaProps={{
                type: 'drag-in-the-blank',
                options: {
                  duplicates: model.duplicates,
                },
                maxResponseAreas: maxResponseAreas,
              }}
              className={classes.markup}
              markup={model.slateMarkup}
              onChange={this.onMarkupChanged}
              imageSupport={imageSupport}
              disableImageAlignmentButtons={true}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
            <Choices
              model={model}
              duplicates={model.duplicates}
              onChange={this.onResponsesChanged}
              toolbarOpts={toolbarOpts}
              maxChoices={maxChoices}
              uploadSoundSupport={uploadSoundSupport}
            />
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
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default withDragContext(Styled);
