import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import {
  InputContainer,
  layout,
  settings
} from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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

  onModelChange = newVal => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal
    });
  };

  onPromptChanged = prompt => {
    this.onModelChange({ prompt });
  };

  onMarkupChanged = slateMarkup => {
    this.onModelChange({ slateMarkup });
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
      lockChoiceOrder,
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
                'Properties': {},
              }}
            />
          }
        >
          <div>
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
                type: 'inline-dropdown'
              }}
              className={classes.markup}
              markup={model.slateMarkup}
              onChange={this.onMarkupChanged}
              imageSupport={imageSupport}
              nonEmpty={!prompt.settings}
              disableUnderline
            />
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;