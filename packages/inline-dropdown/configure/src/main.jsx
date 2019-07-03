import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import {
  InputContainer,
  layout,
  settings
} from '@pie-lib/config-ui';
import { renderMath } from '@pie-lib/math-rendering';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import InlineDropdownToolbar from './inline-dropdown-toolbar';

const { toggle, Panel } = settings;

const InfoDialog = ({ open, onCancel, onOk, title }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onOk} color="primary">
        OK
      </Button>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

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

  state = {
    dialog: {
      open: false
    }
  };

  componentDidMount() {
    const { model: { choices, slateMarkup } } = this.props;

    this.setState({
      markup: slateMarkup,
      respAreaChoices: cloneDeep(choices)
    })
  }

  componentWillReceiveProps(nProps) {
    if (!isEqual(nProps.model.choices, this.props.model.choices)) {
      this.setState({
        respAreaChoices: cloneDeep(nProps.model.choices)
      });
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onModelChange = newVal => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal
    });
  };

  onPromptChanged = prompt => {
    this.onModelChange({ prompt });
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    this.onModelChange({ teacherInstructions });
  };

  onMarkupChanged = slateMarkup => {
    this.onModelChange({ slateMarkup });
  };

  onChange = markup => {
    const { respAreaChoices } = this.state;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="inline_dropdown"]');

    const allChoices = {};

    allRespAreas.forEach(el => {
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
      {}
    );

    const newRespAreaChoices = {};
    let shouldWarn = false;

    allRespAreas.forEach((el, index) => {
      const newChoices = existingRespAreaChoices[el.dataset.index] || [];

      if (newChoices.length < 2 || !newChoices.find(c => c.correct)) {
        el.remove();
        shouldWarn = true;
      } else {
        newRespAreaChoices[index] = existingRespAreaChoices[el.dataset.index] || [];
        el.dataset.index = index;
      }
    });

    if (shouldWarn) {
      this.setState({
        dialog: {
          open: true,
          message: 'Response areas with under 2 options or with no correct answers will be discarded',
          onOk: () => {
            this.setState({
              dialog: {
                open: false
              }
            }, () => {
              this.onModelChange({ choices: newRespAreaChoices, slateMarkup: domMarkup.innerHTML });
            });
          },
          onCancel: () => {
            this.setState({
              dialog: {
                open: false
              }
            });
          }
        }
      });
    } else {
      this.onModelChange({ choices: newRespAreaChoices, slateMarkup: domMarkup.innerHTML });
    }
  };

  onTemporaryChange = tempValue => {
    this.setState({ tempValue });
  };

  onAddChoice = (index, label) => {
    const { respAreaChoices } = this.state;

    if (!respAreaChoices[index]) {
      respAreaChoices[index] = [];
    }

    respAreaChoices[index].push({
      label,
      value: `${respAreaChoices[index].length}`,
      correct: false
    });

    this.setState({ respAreaChoices });
  };

  onRemoveChoice = (respIndex, index) => {
    const { respAreaChoices } = this.state;

    respAreaChoices[respIndex].splice(index, 1);

    this.setState({ respAreaChoices });
  };

  onSelectChoice = (respIndex, selectedIndex) => {
    const { respAreaChoices } = this.state;

    respAreaChoices[respIndex] = respAreaChoices[respIndex].map((ch, index) => ({ ...ch, correct: index === selectedIndex }));

    this.setState({
      respAreaChoices
    });
  };

  render() {
    const { dialog } = this.state;
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
      lockChoiceOrder,
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
                  toggle(partialScoring.label),
                  lockChoiceOrder: lockChoiceOrder.settings &&
                  toggle(lockChoiceOrder.label)
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true)
                },
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
            <InfoDialog
              open={dialog.open}
              title={dialog.message}
              onCancel={dialog.onCancel}
              onOk={dialog.onOk}
            />
            <EditableHtml
              autoFocus={true}
              activePlugins={ALL_PLUGINS}
              toolbarOpts={{
                position: 'top',
                alwaysVisible: true
              }}
              responseAreaProps={{
                type: 'inline-dropdown',
                options: {
                  duplicates: true,
                },
                respAreaToolbar: (node, value, onToolbarDone) => {
                  const { respAreaChoices } = this.state;

                  return () => (
                    <InlineDropdownToolbar
                      onAddChoice={this.onAddChoice}
                      onRemoveChoice={index => this.onRemoveChoice(node.data.get('index'), index)}
                      onSelectChoice={index => this.onSelectChoice(node.data.get('index'), index)}
                      node={node}
                      value={value}
                      onToolbarDone={onToolbarDone}
                      choices={respAreaChoices[node.data.get('index')]}
                    />
                  );
                }
              }}
              markup={model.slateMarkup}
              onChange={this.onChange}
              onTemporaryChange={this.onTemporaryChange}
              imageSupport={imageSupport}
              onBlur={this.onBlur}
              disabled={false}
              highlightShape={false}
            />
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;