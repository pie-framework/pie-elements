import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  InputContainer,
  settings,
  layout,
  NumberTextField,
} from '@pie-lib/config-ui';
import {withStyles} from '@material-ui/core/styles';
import merge from 'lodash/merge';
import {LIKERT_TYPE, LIKERT_SCALE, LIKERT_ORIENTATION} from './likertEntities'
import generateChoices from './choiceGenerator';

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
  radioButtonsWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioButtonsColumnHeader: {
    color: '#c3c3c3',
    fontSize: '12px'
  },
  likertLabelHolder: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start'
  },
  likertOptionsHolder: {
    display: 'flex',
    width: '100%',
    padding: '20px 0',
    justifyContent: 'space-around'
  },
  likertLabelInput: {
    width: 'calc(100% - 200px)',
    marginRight: 0
  },
  errorMessage: {
    color: '#b5000e',
    fontSize: '10px'
  },
  width100: {
    width: '100%'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  likertValueHolder: {
    paddingLeft: '20px',
    width: '150px'
  },
  likertLabelEditableHtml: {
    paddingTop: theme.spacing.unit * 2
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfigurationHolder: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  },
  inputFormGroupIndex: {
    width: '30px',
    paddingTop: '30px'
  }
});


const LikertOrientation = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;
  const onChangeLikertOrientation = (e) => {
    const likertOrientation = e.target.value;
    onChangeModel({
      ...model,
      likertOrientation,
    });
  };
  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>
        Likert Orientation
      </p>
      <RadioGroup
        aria-label='likertOrientation'
        name='likertOrientation'
        value={model.likertOrientation}
        onChange={onChangeLikertOrientation}
      >
        <FormControlLabel value={LIKERT_ORIENTATION.horizontal} control={<Radio/>} label='Horizontal'/>
        <FormControlLabel value={LIKERT_ORIENTATION.vertical} control={<Radio/>} label='Vertical'/>
      </RadioGroup>
    </div>
  )
});

const LikertScale = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;
  const onChangeLikertScale = (e) => {
    const likertScale = e.target.value;
    onChangeModel({
      ...model,
      likertScale,
      choices: generateChoices(likertScale, model.likertType)
    });
  };
  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>
        Likert Scale
      </p>
      <RadioGroup
        aria-label='likertScale'
        name='likertScale'
        value={model.likertScale}
        onChange={onChangeLikertScale}
      >
        <FormControlLabel value={LIKERT_SCALE.likert3} control={<Radio/>} label='Likert 3'/>
        <FormControlLabel value={LIKERT_SCALE.likert5} control={<Radio/>} label='Likert 5'/>
        <FormControlLabel value={LIKERT_SCALE.likert7} control={<Radio/>} label='Likert 7'/>
      </RadioGroup>
    </div>
  )
});

const LikertType = withStyles(styles)((props) => {
  const { classes, model, onChangeModel } = props;
  const onChangeLikertType = (e) => {
    const likertType = e.target.value;
    onChangeModel({
      ...model,
      likertType,
      choices: generateChoices(model.likertScale, likertType)
    });
  };
  return (
    <div className={classes.radioButtonsWrapper}>
      <p className={classes.radioButtonsColumnHeader}>
        Label Type
      </p>

      <div className={classes.flexRow}>
        <RadioGroup
          aria-label='likertLabelType'
          name='likertLabelType'
          value={model.likertType}
          onChange={onChangeLikertType}>
          <FormControlLabel value={LIKERT_TYPE.agreement} control={<Radio/>} label='Agreement'/>
          <FormControlLabel value={LIKERT_TYPE.frequency} control={<Radio/>} label='Frequency'/>
          <FormControlLabel value={LIKERT_TYPE.yesNo} control={<Radio/>} label='Yes/No'/>
        </RadioGroup>

        <RadioGroup
          aria-label='likertLabelType'
          name='likertLabelType'
          value={model.likertType}
          onChange={onChangeLikertType}>
          <FormControlLabel value={LIKERT_TYPE.importance} control={<Radio/>} label='Importance'/>
          <FormControlLabel value={LIKERT_TYPE.likelihood} control={<Radio/>} label='Likelihood'/>
          <FormControlLabel value={LIKERT_TYPE.like} control={<Radio/>} label='Like'/>
        </RadioGroup>
      </div>
    </div>
  )
});

const buildValuesMap = model => model.choices.reduce((acc, choice) => {
  const accClone = { ...acc };
  const choiceValue = parseInt(choice.value);
  if (!accClone[choiceValue]) {
    accClone[choiceValue] = 0;
  }
  return {
    ...accClone,
    [choiceValue]: accClone[choiceValue] + 1
  }
}, {});

const Design = withStyles(styles)(props => {
  const {
    classes,
    model,
    configuration,
    onPromptChanged,
    onChoiceChanged,
    imageSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged
  } = props;
  const {
    prompt = {},
    teacherInstructions = {},
    scoringType = {},
    spellCheck = {}
  } = configuration || {};
  const {
    teacherInstructionsEnabled,
    spellCheckEnabled,
  } = model || {};

  const valuesMap = buildValuesMap(model);

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
                spellCheckEnabled:
                spellCheck.settings && toggle(spellCheck.label),
                scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric'])
              }
            }}
          />
        }
      >
        <div>
          <div className={classes.likertOptionsHolder}>
            <LikertScale model={model} onChangeModel={onChangeModel}/>
            <LikertType model={model} onChangeModel={onChangeModel}/>
            <LikertOrientation model={model} onChangeModel={onChangeModel}/>
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
                spellCheck={spellCheckEnabled}
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
            />
          </InputContainer>


          {model.choices.map((choice, index) => (
            <div
              key={`choice-${index}`}
              className={classes.choiceConfigurationHolder}
            >
              <div className={classes.likertLabelHolder}>
                <span className={classes.inputFormGroupIndex}>{index + 1}.</span>
                <InputContainer
                  key={`likert-label-${index}`}
                  label={'Likert Label'}
                  className={classes.likertLabelInput}
                >
                  <EditableHtml
                    className={classes.likertLabelEditableHtml}
                    markup={choice.label || ''}
                    onChange={c =>
                      onChoiceChanged(index, {
                        ...choice,
                        label: c
                      })
                    }
                    imageSupport={imageSupport}
                    spellCheck={spellCheckEnabled}
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
                      onChoiceChanged(index, {
                        ...choice,
                        value: t,
                      })
                    }}
                    imageSupport={imageSupport}
                  />
                  {valuesMap[choice.value] && valuesMap[choice.value] > 1 && (
                    <p className={classes.errorMessage}>Value should be unique</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <br/>
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

  onChoiceChanged = (index, choice) => {
    const { model } = this.props;

    model.choices = model.choices.map(choice => {
      return merge({}, choice);
    });

    model.choices.splice(index, 1, choice);
    this.props.onModelChanged(model);
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
