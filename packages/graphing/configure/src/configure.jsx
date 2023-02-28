import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/editable-html';
import GraphingConfig from './graphing-config';
import CorrectResponse from './correct-response';
import intersection from 'lodash/intersection';

const { Panel, toggle, radio, checkboxes, textField } = settings;
const log = debug('@pie-element:graphing:configure');

const styles = (theme) => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  description: {
    marginBottom: theme.spacing.unit * 2.5,
  },
});

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    imageSupport: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
  };

  static defaultProps = { classes: {} };

  componentDidMount() {
    const { configuration, onModelChanged, model } = this.props;
    const { availableTools } = configuration || {};
    let { arrows } = model || {};

    // This is used for offering support for old models which have the property arrows: boolean
    // Same thing is set in the controller: packages/graphing/controller/src/index.js - model
    if (typeof arrows === 'boolean') {
      if (arrows) {
        arrows = { left: true, right: true, up: true, down: true };
      } else {
        arrows = { left: false, right: false, up: false, down: false };
      }
    }

    const toolbarTools = intersection(availableTools || [], model.toolbarTools || []);

    onModelChanged && onModelChanged({ ...model, arrows, toolbarTools });
  }

  onRationaleChange = (rationale) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, rationale });
  };

  onPromptChange = (prompt) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, prompt });
  };

  onTeacherInstructionsChange = (teacherInstructions) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, teacherInstructions });
  };

  render() {
    const { classes, model, configuration, onConfigurationChanged, onModelChanged, imageSupport, uploadSoundSupport } =
      this.props;
    const {
      arrows = {},
      authoring = {},
      availableTools = [],
      coordinatesOnHover = {},
      gridConfigurations = [],
      graphDimensions = {},
      instruction= {},
      labels = {},
      padding = {},
      prompt = {},
      rationale = {},
      scoringType = {},
      settingsPanelDisabled,
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      title = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
    } = configuration || {};
    const {
      errors = {},
      labelsEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      titleEnabled,
    } = model || {};

    log('[render] model', model);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;
    const labelsPlaceholders = {
      top: labels.top,
      right: labels.right,
      bottom: labels.bottom,
      left: labels.left,
    };

    const panelItemType = {
      arrows:
        arrows.settings &&
        checkboxes(arrows.label, {
          left: arrows.left,
          right: arrows.right,
          up: arrows.up,
          down: arrows.down,
        }),
      titleEnabled: title.settings && toggle(title.label),
      padding: padding.settings && toggle(padding.label),
      labelsEnabled: labels.settings && toggle(labels.label),
      coordinatesOnHover: coordinatesOnHover.settings && toggle(coordinatesOnHover.label),
    };
    const panelProperties = {
      'authoring.enabled': authoring.settings && toggle(authoring.label, true),
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['dichotomous', 'partial scoring']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
      instruction: instruction.settings && textField(instruction.label),
    };

    return (
      <layout.ConfigLayout
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              'Item Type': panelItemType,
              Properties: panelProperties,
            }}
          />
        }
      >
        <Typography component="div" type="body1" className={classes.description}>
          This interaction asks a student to draw a line that meets specific criteria. The student will draw the line by
          clicking on two points on the graph.
        </Typography>

        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              spellCheck={spellCheckEnabled}
              disableUnderline
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}

        <GraphingConfig
          authoring={authoring}
          availableTools={availableTools}
          gridConfigurations={gridConfigurations}
          graphDimensions={graphDimensions}
          labelsPlaceholders={labelsPlaceholders}
          model={model}
          showLabels={labelsEnabled}
          showTitle={titleEnabled}
          titlePlaceholder={title.placeholder}
          onChange={this.props.onModelChanged}
        />

        <CorrectResponse
          availableTools={availableTools}
          errors={errors}
          model={model}
          onChange={this.props.onModelChanged}
        />

        {rationaleEnabled && (
          <InputContainer label={rationale.label || 'Rationale'} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChange}
              imageSupport={imageSupport}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);
