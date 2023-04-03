import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { InputContainer, settings, layout, NumberTextField } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import merge from 'lodash/merge';
import { LIKERT_TYPE, LIKERT_SCALE, LIKERT_ORIENTATION } from './likertEntities';
import generateChoices from './choiceGenerator';

const { Panel, toggle, radio } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  radioButtonsWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioButtonsColumnHeader: {
    color: theme.palette.grey[400],
    fontSize: theme.typography.fontSize - 2,
  },
  likertLabelHolder: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.unit * 2,
  },
  likertOptionsHolder: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.unit * 2.5,
  },
  likertLabelInput: {
    width: 'calc(100% - 200px)',
    marginRight: 0,
  },
  errorMessage: {
    color: theme.palette.error.main,
    fontSize: theme.typography.fontSize - 2,
  },
  width100: {
    width: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  likertValueHolder: {
    paddingLeft: theme.spacing.unit * 2.5,
    width: '150px',
  },
  likertLabelEditableHtml: {
    paddingTop: theme.spacing.unit * 2,
  },
  inputFormGroupIndex: {
    width: '30px',
    paddingTop: theme.spacing.unit * 4,
  },
});

const LikertOrientation = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;

  const onChangeLikertOrientation = (e) => {
    const likertOrientation = e.target.value;

    onChangeModel({ ...model, likertOrientation });
  };

  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>Likert Orientation</p>
      <RadioGroup
        aria-label="likertOrientation"
        name="likertOrientation"
        value={model.likertOrientation}
        onChange={onChangeLikertOrientation}
      >
        <FormControlLabel value={LIKERT_ORIENTATION.horizontal} control={<Radio />} label="Horizontal" />
        <FormControlLabel value={LIKERT_ORIENTATION.vertical} control={<Radio />} label="Vertical" />
      </RadioGroup>
    </div>
  );
});

const LikertScale = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;
  const onChangeLikertScale = (e) => {
    const likertScale = e.target.value;

    onChangeModel({
      ...model,
      likertScale,
      choices: generateChoices(likertScale, model.likertType),
    });
  };

  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>Likert Scale</p>
      <RadioGroup aria-label="likertScale" name="likertScale" value={model.likertScale} onChange={onChangeLikertScale}>
        <FormControlLabel value={LIKERT_SCALE.likert3} control={<Radio />} label="Likert 3" />
        <FormControlLabel value={LIKERT_SCALE.likert5} control={<Radio />} label="Likert 5" />
        <FormControlLabel value={LIKERT_SCALE.likert7} control={<Radio />} label="Likert 7" />
      </RadioGroup>
    </div>
  );
});

const LikertType = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;
  const onChangeLikertType = (e) => {
    const likertType = e.target.value;

    onChangeModel({
      ...model,
      likertType,
      choices: generateChoices(model.likertScale, likertType),
    });
  };

  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>Label Type</p>

      <div className={classes.flexRow}>
        <RadioGroup
          aria-label="likertLabelType"
          name="likertLabelType"
          value={model.likertType}
          onChange={onChangeLikertType}
        >
          <FormControlLabel value={LIKERT_TYPE.agreement} control={<Radio />} label="Agreement" />
          <FormControlLabel value={LIKERT_TYPE.frequency} control={<Radio />} label="Frequency" />
          <FormControlLabel value={LIKERT_TYPE.yesNo} control={<Radio />} label="Yes/No" />
        </RadioGroup>

        <RadioGroup
          aria-label="likertLabelType"
          name="likertLabelType"
          value={model.likertType}
          onChange={onChangeLikertType}
        >
          <FormControlLabel value={LIKERT_TYPE.importance} control={<Radio />} label="Importance" />
          <FormControlLabel value={LIKERT_TYPE.likelihood} control={<Radio />} label="Likelihood" />
          <FormControlLabel value={LIKERT_TYPE.like} control={<Radio />} label="Like" />
        </RadioGroup>
      </div>
    </div>
  );
});

const buildValuesMap = (model) =>
  model.choices.reduce((acc, choice) => {
    const accClone = { ...acc };
    const choiceValue = parseInt(choice.value);

    if (!accClone[choiceValue]) {
      accClone[choiceValue] = 0;
    }

    return { ...accClone, [choiceValue]: accClone[choiceValue] + 1 };
  }, {});

const Design = withStyles(styles)((props) => {
  const {
    classes,
    configuration,
    imageSupport,
    model,
    onChangeModel,
    onChoiceChanged,
    onConfigurationChanged,
    onPromptChanged,
    onTeacherInstructionsChanged,
    uploadSoundSupport,
  } = props;
  const {
    contentDimensions = {},
    prompt = {},
    scoringType = {},
    settingsPanelDisabled,
    spellCheck = {},
    teacherInstructions = {},
  } = configuration || {};
  const { spellCheckEnabled, teacherInstructionsEnabled } = model || {};

  const valuesMap = buildValuesMap(model);
  const panelProperties = {
    teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
    spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
    scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
  };

  return (
    <layout.ConfigLayout
      dimensions={contentDimensions}
      hideSettings={settingsPanelDisabled}
      settings={
        <Panel
          model={model}
          onChangeModel={onChangeModel}
          configuration={configuration}
          onChangeConfiguration={onConfigurationChanged}
          groups={{
            Properties: panelProperties,
          }}
        />
      }
    >
      {teacherInstructionsEnabled && (
        <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.teacherInstructions || ''}
            onChange={onTeacherInstructionsChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
          />
        </InputContainer>
      )}

      <InputContainer label={prompt.label} className={classes.promptHolder}>
        <EditableHtml
          className={classes.prompt}
          markup={model.prompt}
          onChange={onPromptChanged}
          imageSupport={imageSupport}
          nonEmpty={false}
          spellCheck={spellCheckEnabled}
          disableUnderline
          uploadSoundSupport={uploadSoundSupport}
        />
      </InputContainer>

      <div className={classes.likertOptionsHolder}>
        <LikertScale model={model} onChangeModel={onChangeModel} />
        <LikertType model={model} onChangeModel={onChangeModel} />
        <LikertOrientation model={model} onChangeModel={onChangeModel} />
      </div>

      {model.choices.map((choice, index) => (
        <div key={`choice-${index}`} className={classes.likertLabelHolder}>
          <span className={classes.inputFormGroupIndex}>{index + 1}.</span>
          <InputContainer key={`likert-label-${index}`} label={'Likert Label'} className={classes.likertLabelInput}>
            <EditableHtml
              className={classes.likertLabelEditableHtml}
              markup={choice.label || ''}
              onChange={(c) => onChoiceChanged(index, { ...choice, label: c })}
              imageSupport={imageSupport}
              spellCheck={spellCheckEnabled}
              uploadSoundSupport={uploadSoundSupport}
            />
          </InputContainer>

          <div className={classes.likertValueHolder}>
            <NumberTextField
              label={'Likert Value'}
              value={choice.value}
              className={classes.width100}
              max={100}
              min={-100}
              onChange={(e, t) => {
                onChoiceChanged(index, { ...choice, value: t });
              }}
              imageSupport={imageSupport}
            />
            {valuesMap[choice.value] && valuesMap[choice.value] > 1 && (
              <p className={classes.errorMessage}>Value should be unique</p>
            )}
          </div>
        </div>
      ))}
    </layout.ConfigLayout>
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
      delete: PropTypes.func.isRequired,
    }),
  };

  onChoiceChanged = (index, choice) => {
    const { model, onModelChanged } = this.props;

    model.choices = model.choices.map((choice) => merge({}, choice));
    model.choices.splice(index, 1, choice);

    onModelChanged(model);
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({ ...this.props.model, prompt });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });
  };

  render() {
    return (
      <Design
        {...this.props}
        onChangeModel={this.props.onModelChanged}
        onChoiceChanged={this.onChoiceChanged}
        onPromptChanged={this.onPromptChanged}
        onTeacherInstructionsChanged={this.onTeacherInstructionsChanged}
      />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
