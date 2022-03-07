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
import ECRToolbar from './ecr-toolbar';
import AlternateResponses from './alternateResponses';
import { getAdjustedLength } from './markupUtils';

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
      const length = getAdjustedLength(Math.max(...labelLengthsArr));

      if (undefinedLengths || !maxLengthPerChoice[index] || maxLengthPerChoice[index] < length) {
        maxLengthPerChoice[index] = length;
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
    const { choices, maxLengthPerChoice } = model;
    const newValLength = getAdjustedLength((newVal || '').length);

    if (!choices[index]) {
      choices[index] = [{ label: '', value: '0' }];
      maxLengthPerChoice.splice(index, 0, newValLength);
    }

    choices[index][0].label = newVal || '';

    if (maxLengthPerChoice && newVal && maxLengthPerChoice[index] < newValLength) {
      maxLengthPerChoice[index] = newValLength;
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
      imageSupport
    } = this.props;
    const {
      prompt = {},
      partialScoring = {},
      rationale = {},
      teacherInstructions = {},
      maxLengthPerChoice = {}
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled, maxLengthPerChoiceEnabled } = model || {};
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
                  promptEnabled: prompt.settings && toggle(prompt.label)
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
                />
              </InputContainer>
            )}
            <Typography className={classes.text}>
              Define Template, Choices, and Correct Responses
            </Typography>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              toolbarOpts={{ position: 'top' }}
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
                onHandleAreaChange: this.onHandleAreaChange
              }}
              className={classes.markup}
              markup={model.slateMarkup}
              onChange={this.onChange}
              imageSupport={imageSupport}
              onBlur={this.onBlur}
              disabled={false}
              highlightShape={false}
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
