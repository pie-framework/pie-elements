import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import { InputContainer, layout, settings } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const { toggle, Panel } = settings;
import ECRToolbar from './ecr-toolbar';
import AlternateResponses from './alternateResponses';

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
      model: { slateMarkup }
    } = this.props;

    this.setState({
      markup: slateMarkup
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

  onLengthChanged = maxChoicesLength => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      maxChoicesLength
    });
  };

  onChangeResponse = (index, newVal) => {
    console.log('index', index);
    console.log('newVal', newVal);
    const { model, onModelChanged} = this.props;
    const { choices, maxChoicesLength } = model;
    const newValLength = (newVal || '').length;

    if (!choices[index]) {
      choices[index] = [{ label: '', value: '0' }];
      maxChoicesLength.splice(index, 0, newValLength);
    }

    choices[index][0].label = newVal || '';

    if (maxChoicesLength && newVal && maxChoicesLength[index] < newValLength) {
      maxChoicesLength[index] = newVal.length;
    }

    onModelChanged({
      ...model,
      choices,
      maxChoicesLength
    });
  };

  onChange = markup => {
    console.log('ONchange called');
    const {
      model: { choices }
    } = this.props;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll(
      '[data-type="explicit_constructed_response"]'
    );

    const allChoices = {};

    allRespAreas.forEach((el, index) => {
      el.dataset.index = index;
    });

    console.log('allRespAreas', allRespAreas);

    allRespAreas.forEach((el, index) => {
      const newChoices = cloneDeep(Object.values(choices)[index]);
      console.log('newChoices', newChoices);

      if (newChoices) {
        newChoices[0] = {
          label: el.dataset.value || '',
          value: '0'
        };
      }

      allChoices[el.dataset.index] = newChoices;
    });
    console.log('allChoices', allChoices);

    this.props.onModelChanged({
      ...this.props.model,
      choices: allChoices,
      slateMarkup: domMarkup.innerHTML
    });
  };

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
      maxChoicesLength = {}
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled } =
      model || {};
    const toolbarOpts = {};
    console.log('model.maxChoicesLength', model.maxChoicesLength);

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
                  maxChoicesLengthEnabled:
                    maxChoicesLength.settings && toggle(maxChoicesLength.label),
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
                }
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
                Define Alternates
              </Typography>
            )}
            <AlternateResponses
              model={model}
              onChange={this.onResponsesChanged}
              onLengthChange={this.onLengthChanged}
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
