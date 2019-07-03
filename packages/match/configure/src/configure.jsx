import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  FeedbackConfig,
  settings,
  layout,
  InputContainer
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';
import AnswerConfigBlock from './answer-config-block';

const log = debug('@pie-element:match:configure');
const { Panel, toggle, radio } = settings;

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
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

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {
    classes: {}
  };

  constructor(props) {
    super(props);

    this.rowIdCounter = props.model.rows[props.model.rows.length - 1].id + 1;

    this.state = {
      activeTab: 0
    };
  }

  onTabChange = (event, value) => {
    this.setState({ activeTab: value });
  };

  onChangeTabIndex = index => {
    this.setState({ activeTab: index });
  };

  onChange = model => {
    this.props.onModelChanged(model);
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  onDeleteRow = (rowIndex) => {
    const { model } = this.props;

    const newModel = { ...model };

    newModel.rows.splice(rowIndex, 1);

    this.onChange(newModel);
  };

  onAddRow = () => {
    const { model } = this.props;
    const newModel = { ...model };

    newModel.rows = newModel.rows.concat({
      id: this.rowIdCounter + 1,
      title: `Question Text ${newModel.rows.length + 1}`,
      values: new Array(model.layout - 1).fill(false)
    });

    this.rowIdCounter += 1;

    this.onChange(newModel);
  };

  onLayoutChange = (newLayout) => {
    const { model } = this.props;
    const oldLayout = model.layout;
    const newModel = { ...model };

    if (newLayout > oldLayout) {
      for (let i = 0; i < (newLayout - oldLayout); i++) {
        newModel.headers.push(`Column ${newModel.headers.length + 1}`);
      }

      newModel.rows.forEach(row => {
        for (let i = 0; i < (newLayout - oldLayout); i++) {
          row.values.push(false);
        }
      });
    } else if (newLayout < oldLayout) {
      newModel.headers.splice(newLayout);

      newModel.rows.forEach(row => {
        row.values.splice(newLayout - 1);
      });

    }

    newModel.layout = newLayout;

    this.onChange(newModel);
  };

  onResponseTypeChange = newChoiceMode => {
    const { model } = this.props;
    const newModel = { ...model };

    // if we're switching to radio and we have more than one true, reset
    if (newChoiceMode === 'radio') {
      newModel.rows.forEach(row => {
        const trueCount = row.values.reduce((total, current) => current === true ? total + 1 : total);

        if (trueCount > 1) {
          row.values = new Array(model.layout - 1).fill(false)
        }
      })
    }

    newModel.choiceMode = newChoiceMode;

    this.onChange(newModel);
  };

  onPartialScoringChange = partialScoring => {
    this.props.model.partialScoring = partialScoring;
    this.props.onModelChanged(this.props.model);
  };

  onPromptChanged = prompt => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt
    });
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions
    });
  };

  onRationaleChanged = rationale => {
    this.props.onModelChanged({
      ...this.props.model,
      rationale
    });
  };

  render() {
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged } = this.props;
    const {
      enableImages,
      partialScoring,
      teacherInstructions = {},
      studentInstructions,
      rationale = {},
      lockChoiceOrder,
      scoringType,
      prompt,
    } = configuration;

    log('[render] model', model);


    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={model => onModelChanged(model)}
            onChangeConfiguration={config => onConfigurationChanged(config)}
            groups={{
              'Settings': {
                enableImages: enableImages.settings &&
                toggle(enableImages.label),
                partialScoring: partialScoring.settings &&
                toggle(partialScoring.label),
                lockChoiceOrder: lockChoiceOrder.settings &&
                toggle(lockChoiceOrder.label)
              },
              'Properties': {
                'teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label, true),
                'studentInstructions.enabled': studentInstructions.settings &&
                toggle(studentInstructions.label, true),
                'rationale.enabled': rationale.settings &&
                toggle(rationale.label, true),
                scoringType: scoringType.settings &&
                radio(scoringType.label, ['auto', 'rubric']),
              },
            }}
          />
        }
      >
        <div className={classes.content}>
          <Typography component="div" type="body1">
            <span>
              In Choice Matrix, students associate choices in the first column with options in the adjacent rows.
              This interaction allows for either one or more correct answers. Setting more than one answer as correct allows for partial credit <i>(see the Scoring tab)</i>.
            </span>
          </Typography>

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
            <InputContainer label={rationale.label}
                            className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.rationale || ''}
                onChange={this.onRationaleChanged}
                imageSupport={imageSupport}
              />
            </InputContainer>
          )}
          <GeneralConfigBlock
            model={model}
            configuration={configuration}
            onResponseTypeChange={this.onResponseTypeChange}
            onLayoutChange={this.onLayoutChange}
          />
          <AnswerConfigBlock
            model={model}
            configuration={configuration}
            imageSupport={imageSupport}
            onChange={this.onChange}
            onAddRow={this.onAddRow}
            onDeleteRow={this.onDeleteRow}
          />
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
          />
        </div>

      </layout.ConfigLayout>
    );
  }
}

export const Config = Configure;

export default withStyles(styles)(Configure);
