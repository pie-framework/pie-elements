import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import {
  InputContainer, layout, settings
} from '@pie-lib/config-ui';
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
    minHeight: '235px',
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '235px'
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
    fontFamily: 'Cerebri Sans',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#495B8F'
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
    const { model: { slateMarkup } } = this.props;

    this.setState({
      markup: slateMarkup
    })
  }

  onPromptChanged = prompt => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt
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

  onTeacherInstructionsChanged = teacherInstructions => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      teacherInstructions
    });
  };

  onChangeResponse = (index, newVal) => {
    const { model: { choices } } = this.props;

    if (!choices[index]) {
      choices[index] = [{ label: '', id: '0' }];
    }

    choices[index][0].label = newVal || '';

    this.props.onModelChanged({
      ...this.props.model,
      choices
    });
  };

  onChange = markup => {
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="explicit_constructed_response"]');

    const allChoices = {};

    allRespAreas.forEach(el => {
      allChoices[el.dataset.index] = el.dataset.value || '';
    });

    allRespAreas.forEach((el, index) => {
      el.dataset.index = index;
    });

    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup: domMarkup.innerHTML
    });
  };

  onModelChange = newVal => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal
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
      prompt,
      partialScoring,
      teacherInstructions = {}
    } = configuration;

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              configuration={configuration}
              onChangeModel={model => this.onModelChange(model)}
              onChangeConfiguration={configuration => onConfigurationChanged(configuration, true)}
              groups={{
                'Settings': {
                  partialScoring: partialScoring.settings &&
                  toggle(partialScoring.label)
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true),
                }
              }}
            />
          }
        >
          <div>
            {teacherInstructions.enabled && (
              <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
                <EditableHtml
                  className={classes.prompt}
                  markup={model.teacherInstructions || ''}
                  onChange={this.onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}
            {prompt.settings && (
              <InputContainer
                label={prompt.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.prompt}
                  onChange={this.onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={!prompt.settings}
                  disableUnderline
                />
              </InputContainer>
            )}
            <Typography className={classes.text}>
              Define Template, Choices, and Correct Responses
            </Typography>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              toolbarOpts={{
                position: 'top',
                alwaysVisible: true
              }}
              responseAreaProps={{
                type: 'explicit-constructed-response',
                options: {
                  duplicates: true,
                },
                respAreaToolbar: (node, value, onToolbarDone) => {
                  const correctChoice = (model.choices[node.data.get('index')] || [])[0];

                  return () => (
                    <ECRToolbar
                      onChangeResponse={newVal => this.onChangeResponse(node.data.get('index'), newVal)}
                      node={node}
                      value={value}
                      onToolbarDone={onToolbarDone}
                      correctChoice={correctChoice}
                    />
                  );
                }
              }}
              markup={model.slateMarkup}
              onChange={this.onChange}
              imageSupport={imageSupport}
              onBlur={this.onBlur}
              disabled={false}
              highlightShape={false}
            />
            <Typography className={classes.text}>
              Define Alternates
            </Typography>
            <AlternateResponses
              model={model}
              onChange={this.onResponsesChanged}
            />
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;