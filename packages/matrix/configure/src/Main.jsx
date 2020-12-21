import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import {
  InputContainer,
  settings,
  layout
} from '@pie-lib/config-ui';
import {withStyles} from '@material-ui/core/styles';
import MatrixColumnsSizeHeaderInput from './MatrixColumnsSizeHeaderInput';
import MatrixRowsSizeHeaderInput from './MatrixRowsSizeHeaderInput';
import MatrixLabelTypeHeaderInput from './MatrixLabelTypeHeaderInput';
import MatrixValues from './MatrixValues';

const { Panel, toggle, radio } = settings;

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
  matrixHeaderOptionsHolder: {
    display: 'flex',
    width: '100%',
    padding: '20px 0',
    justifyContent: 'space-around'
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  }
});


const Design = withStyles(styles)(props => {
  const {
    classes,
    model,
    configuration,
    onPromptChanged,
    imageSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged
  } = props;
  const {
    prompt = {},
    teacherInstructions = {},
    scoringType = {},
  } = configuration || {};
  const {
    teacherInstructionsEnabled
  } = model || {};

  return (
    <div className={classes.design}>
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            onChangeModel={onChangeModel}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Properties: {
                teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
                scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric'])
              }
            }}
          />
        }
      >
        <div>
          <div className={classes.matrixHeaderOptionsHolder}>
            <MatrixRowsSizeHeaderInput model={model} onChangeModel={onChangeModel}/>
            <MatrixColumnsSizeHeaderInput model={model} onChangeModel={onChangeModel}/>
            <MatrixLabelTypeHeaderInput model={model} onChangeModel={onChangeModel}/>
          </div>

          {teacherInstructionsEnabled && (
            <InputContainer
              label={teacherInstructions.label}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={onTeacherInstructionsChanged}
                imageSupport={imageSupport}
                nonEmpty={false}
              />
            </InputContainer>
          )}

          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={!prompt.settings}
              disableUnderline
            />
          </InputContainer>

          <MatrixValues model={model} onChangeModel={onChangeModel}/>
        </div>
      </layout.ConfigLayout>
    </div>
  );
});

export class Main extends React.Component {
  static propTypes = {
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

  onPromptChanged = prompt => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt
    });
  };

  onChangeModel = data => {
    this.props.onModelChanged({
      ...this.props.model,
      ...data
    });
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions
    });
  };

  render() {
    return (
      <Design
        {...this.props}
        onChangeModel={this.props.onModelChanged}
        onPromptChanged={this.onPromptChanged}
        onTeacherInstructionsChanged={this.onTeacherInstructionsChanged}
      />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
