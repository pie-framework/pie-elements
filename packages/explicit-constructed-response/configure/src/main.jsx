import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
import EditableHtml, {ALL_PLUGINS} from '@pie-lib/editable-html';
import {InputContainer, layout, settings} from '@pie-lib/config-ui';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import ECRToolbar from './ecr-toolbar';
import AlternateResponses from './alternateResponses';
import { getAdjustedLength } from './markupUtils';
import {generateValidationMessage} from './utils';

const { toggle, Panel } = settings;

const styles = theme => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  markup: {
    minHeight: '100px',
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '100px'
    }
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  },
  addButton: {
    float: 'right'
  },
  text: {
    color: '#495B8F',
    fontFamily: 'Cerebri Sans',
    fontSize: '16px',
    lineHeight: '19px',
    marginTop: theme.spacing.unit * 4
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    padding: '5px 0'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'end'
  }
});

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
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
      delete: PropTypes.func.isRequired
    })
  };

  state = {};

  componentDidMount() {
    const {
      model: { slateMarkup, choices, maxLengthPerChoice = []},
      onModelChanged
    } = this.props;
    const undefinedLengths = !maxLengthPerChoice.length;

    this.setState({ markup: slateMarkup });

    // calculate maxLengthPerChoice array if it is not defined or defined incorrectly
    Object.values(choices).forEach((choice, index) => {
      const labelLengthsArr = (choice || []).map(choice => (choice.label || '').length);
      const length = Math.max(...labelLengthsArr);

      if (
        undefinedLengths
        || !maxLengthPerChoice[index]
        || maxLengthPerChoice[index] < length
        || maxLengthPerChoice[index] > length + 10
      ) {
        maxLengthPerChoice[index] = getAdjustedLength(length);
      }
    });

    onModelChanged({
      ...this.props.model,
      maxLengthPerChoice
    });
  }

  onModelChange = newVal => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal
    });
  };

  onPromptChanged = prompt => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt
    });
  };

  onRationaleChanged = rationale => {
    this.props.onModelChanged({
      ...this.props.model,
      rationale
    });
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      teacherInstructions
    });
  };

  onMarkupChanged = slateMarkup => {
    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup
    });
  };

  onResponsesChanged = choices => {
    this.props.onModelChanged({
      ...this.props.model,
      choices
    });
  };

  onLengthChanged = maxLengthPerChoice => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      maxLengthPerChoice
    });
  };

  onChangeResponse = (index, newVal) => {
    const { model, onModelChanged} = this.props;
    const { choices } = model;
    let { maxLengthPerChoice } = model;
    const newValLength = (newVal || '').length;

    if (!choices[index]) {
      choices[index] = [{ label: newVal || '', value: '0' }];

      // add default values for missing choices up to the new index position
      const nbOfMissingChoices = index > maxLengthPerChoice.length ? index - maxLengthPerChoice.length : 0;

      maxLengthPerChoice = [ ...maxLengthPerChoice, ...Array(nbOfMissingChoices).fill(1) ];

      maxLengthPerChoice.splice(index, 0, getAdjustedLength(newValLength));
    } else {
      choices[index][0].label = newVal || '';

      if (
        maxLengthPerChoice
        && (maxLengthPerChoice[index] < newValLength || maxLengthPerChoice[index] > newValLength + 10)
      ) {
        maxLengthPerChoice[index] = getAdjustedLength(newValLength);
      }
    }

    onModelChanged({
      ...model,
      choices,
      maxLengthPerChoice
    });
  };

  onChange = markup => {
    const {
      model: { choices, maxLengthPerChoice },
      onModelChanged
    } = this.props;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll(
      '[data-type="explicit_constructed_response"]'
    );

    const allChoices = {};
    const updatedMaxLengthPerChoice = [];

    allRespAreas.forEach((el, index) => {
      const newChoices = cloneDeep(choices[el.dataset.index]);

      if (newChoices) {
        newChoices[0] = {
          label: el.dataset.value || '',
          value: '0'
        };

        updatedMaxLengthPerChoice[index] = maxLengthPerChoice[el.dataset.index];
      }

      allChoices[index] = newChoices;
      el.dataset.index = index;
    });

    const callback = () => onModelChanged({
      ...this.props.model,
      choices: allChoices,
      slateMarkup: domMarkup.innerHTML,
      maxLengthPerChoice: updatedMaxLengthPerChoice
    });

    this.setState({
      cachedChoices: undefined
    }, callback);
  };

  onHandleAreaChange = throttle((nodes) => {
    const {
      model: { choices },
      onModelChanged
    } = this.props;
    const { cachedChoices } = this.state;

    if (!nodes) {
      return;
    }

    const newChoices = choices ? cloneDeep(choices) : {};
    const newCachedChoices = cachedChoices ? cloneDeep(cachedChoices) : {};

    nodes.forEach((node) => {
      const keyForNode = node.data.get('index');

      if (!newChoices[keyForNode] && newCachedChoices[keyForNode]) {
        Object.assign(newChoices, pick(newCachedChoices, keyForNode));

        if (newCachedChoices.hasOwnProperty(keyForNode)) {
          delete newCachedChoices[keyForNode];
        }
      } else {
        Object.assign(newCachedChoices, pick(newChoices, keyForNode));

        if (newChoices.hasOwnProperty(keyForNode)) {
          delete newChoices[keyForNode];
        }
      }
    });

    const callback = () => onModelChanged({
      ...this.props.model,
      choices: newChoices
    });

    this.setState({
      cachedChoices: newCachedChoices
    }, callback);
  }, 500, { trailing: false, leading: true });

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      imageSupport,
      validate
    } = this.props;
    const {
      prompt = {},
      partialScoring = {},
      rationale = {},
      teacherInstructions = {},
      maxLengthPerChoice = {},
      spellCheck = {},
      playerSpellCheck = {},
    } = configuration || {};
    const {
      teacherInstructionsEnabled,
      promptEnabled,
      rationaleEnabled,
      maxLengthPerChoiceEnabled,
      spellCheckEnabled,
      errors
    } = model || {};
    const toolbarOpts = {};

    const { responseAreasError, choicesErrors = {} } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

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
              onChangeModel={model => this.onModelChange(model)}
              onChangeConfiguration={configuration =>
                onConfigurationChanged(configuration, true)
              }
              groups={{
                Settings: {
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  maxLengthPerChoiceEnabled:
                    maxLengthPerChoice.settings && toggle(maxLengthPerChoice.label),
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  spellCheckEnabled:
                  spellCheck.settings && toggle(spellCheck.label),
                  playerSpellCheckEnabled:
                  playerSpellCheck.settings && toggle(playerSpellCheck.label),
                }
              }}
            />
          }
        >
          <div>
            {teacherInstructionsEnabled && (
              <InputContainer
                label={teacherInstructions.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.teacherInstructions || ''}
                  onChange={this.onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                />
              </InputContainer>
            )}
            {promptEnabled && (
              <InputContainer
                label={prompt.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.prompt}
                  onChange={this.onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  disableUnderline
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                />
              </InputContainer>
            )}
            <div className={classes.flexContainer}>
              <Typography className={classes.text}>
                Define Template, Choices, and Correct Responses
              </Typography>
              <Tooltip
                classes={{tooltip: classes.tooltip}}
                disableFocusListener
                disableTouchListener
                placement={'right'}
                title={validationMessage}
              >
                <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }}/>
              </Tooltip>
            </div>
            {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}

            <EditableHtml
              activePlugins={ALL_PLUGINS}
              toolbarOpts={{ position: 'top' }}
              spellCheck={spellCheckEnabled}
              responseAreaProps={{
                type: 'explicit-constructed-response',
                options: {
                  duplicates: true
                },
                respAreaToolbar: (node, value, onToolbarDone) => {
                  const { model } = this.props;
                  const correctChoice = (model.choices[
                    node.data.get('index')
                  ] || [])[0];

                  return () => (
                    <ECRToolbar
                      onChangeResponse={newVal =>
                        this.onChangeResponse(node.data.get('index'), newVal)
                      }
                      node={node}
                      value={value}
                      onToolbarDone={onToolbarDone}
                      correctChoice={correctChoice}
                    />
                  );
                },
                error: () => choicesErrors,
                onHandleAreaChange: this.onHandleAreaChange
              }}
              className={classes.markup}
              markup={model.slateMarkup}
              onChange={this.onChange}
              imageSupport={imageSupport}
              onBlur={this.onBlur}
              disabled={false}
              highlightShape={false}
              error={responseAreasError}
            />
            {!isEmpty(model.choices) && (
              <Typography className={classes.text}>
                {`Define Alternates ${maxLengthPerChoiceEnabled ? 'and Character Limits' : ''}`}
              </Typography>
            )}
            <AlternateResponses
              model={model}
              onChange={this.onResponsesChanged}
              onLengthChange={this.onLengthChanged}
              maxLengthPerChoiceEnabled={maxLengthPerChoiceEnabled}
              spellCheck={spellCheckEnabled}
              choicesErrors={choicesErrors}
            />
            {rationaleEnabled && (
              <InputContainer
                label={rationale.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.rationale || ''}
                  onChange={this.onRationaleChanged}
                  imageSupport={imageSupport}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
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

export default Styled;
