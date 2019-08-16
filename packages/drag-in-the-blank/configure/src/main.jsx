import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import {
  InputContainer,
  layout,
  settings
} from '@pie-lib/config-ui';
import { withDragContext } from '@pie-lib/drag';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import Choices from './choices';
import { processMarkup, createSlateMarkup } from './markupUtils';
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

const positionOptions = [
  {
    label: 'Above',
    value: 'above',
    secondaryText: 'Choices will be shown above categories'
  },
  {
    label: 'Below',
    value: 'below',
    secondaryText: 'Choices will be shown below categories'
  },
  {
    label: 'Left',
    value: 'left',
    secondaryText: 'Choices will be shown to the left of the categories'
  },
  {
    label: 'Right',
    value: 'right',
    secondaryText: 'Choices will be shown to the right of the categories'
  }
];

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

  componentDidUpdate() {
    // eslint-disable-next-line
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
    this.props.onModelChanged({
      ...this.props.model,
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
    const { model: { correctResponse, markup } } = this.props;
    const slateMarkup = createSlateMarkup(markup, choices, correctResponse);

    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup,
      choices
    });
  };

  changePosition = position => {
    this.props.onModelChanged({
      ...this.props.model,
      choicesPosition: position.value
    });

    this.setState({ anchorEl: null });
  };

  handleClickPosition = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      imageSupport
    } = this.props;
    const {
      duplicates = {},
      prompt = {},
      partialScoring = {},
      lockChoiceOrder = {},
      rationale = {},
      teacherInstructions = {}
    } = configuration || {};
    const positionOption = positionOptions.find(option => option.value === model.choicesPosition);

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
                  duplicates: duplicates.settings && toggle(duplicates.label),
                  lockChoiceOrder: lockChoiceOrder.settings &&
                  toggle(lockChoiceOrder.label)
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true),
                  'rationale.enabled': rationale.settings &&
                    toggle(rationale.label, true)
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
            {rationale.enabled && (
              <InputContainer
                label={rationale.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.rationale || ''}
                  onChange={this.onRationaleChanged}
                  imageSupport={imageSupport}
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
                type: 'drag-in-the-blank',
                options: {
                  duplicates: model.duplicates
                }
              }}
              className={classes.markup}
              markup={model.slateMarkup}
              onChange={this.onMarkupChanged}
              imageSupport={imageSupport}
              nonEmpty={!prompt.settings}
              disableUnderline
            />
            <Choices
              model={model}
              duplicates={model.duplicates}
              onChange={this.onResponsesChanged}
            />
            <List component="nav">
              <ListItem
                button
                aria-haspopup="true"
                onClick={this.handleClickPosition}
              >
                <ListItemText
                  primary="Choices Position"
                  secondary={positionOption.secondaryText}
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {positionOptions.map(option => (
                <MenuItem
                  key={option.value}
                  selected={option.value === model.choicesPosition}
                  onClick={() => this.changePosition(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default withDragContext(Styled);
