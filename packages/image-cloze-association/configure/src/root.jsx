import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  settings,
  layout,
  InputContainer
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle } = settings;

export class Root extends React.Component {
  onTeacherInstructionsChanged = teacherInstructions => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions
    });
  };

  render() {
    const { classes, model, configuration, onModelChanged, onConfigurationChanged, imageSupport } = this.props;
    const { teacherInstructions } = configuration || {};

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={model => onModelChanged(model)}
            onChangeConfiguration={config => onConfigurationChanged(config)}
            groups={{
              'Properties': {
                'teacherInstructions.enabled': teacherInstructions.settings &&
                  toggle(teacherInstructions.label, true),
              },
            }}
          />
        }
      >
        <div className={classes.content}>
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

          Image cloze association
        </div>
      </layout.ConfigLayout>
    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 3
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
  model: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired
  })
};

export default withStyles(styles)(Root);
