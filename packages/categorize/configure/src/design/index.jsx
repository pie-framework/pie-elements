import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  FeedbackConfig,
  InputContainer,
  layout,
  settings,
} from '@pie-lib/config-ui';
import {
  countInAnswer,
  ensureNoExtraChoicesInAnswer,
} from '@pie-lib/categorize';
import EditableHtml from '@pie-lib/editable-html';
import { uid, withDragContext } from '@pie-lib/drag';

import Categories from './categories';
import AlternateResponses from './categories/alternateResponses';
import Choices from './choices';
import { Divider } from './buttons';
import { buildAlternateResponses, buildCategories } from './builder';
import Header from './header';
import { multiplePlacements } from '../utils';

const { dropdown, Panel, toggle, radio } = settings;
const { Provider: IdProvider } = uid;

export class Design extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    configuration: PropTypes.object,
    className: PropTypes.string,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uid: PropTypes.string,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.uid = props.uid || uid.generateId();
  }

  updateModel = (props) => {
    const { model, onChange } = this.props;

    const updatedModel = {
      ...model,
      ...props,
    };

    //Ensure that there are no extra choices in correctResponse, if the user has decided that only one choice may be used.
    updatedModel.correctResponse = ensureNoExtraChoicesInAnswer(
      updatedModel.correctResponse || [],
      updatedModel.choices
    );

    //clean categories
    updatedModel.categories = updatedModel.categories.map((c) => ({
      id: c.id,
      label: c.label,
    }));

    updatedModel.choices = updatedModel.choices.map((h) => ({
      id: h.id,
      content: h.content,
      categoryCount: h.categoryCount,
    }));

    onChange(updatedModel);
  };

  changeRationale = (rationale) => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      rationale,
    });
  };

  changeTeacherInstructions = (teacherInstructions) => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      teacherInstructions,
    });
  };

  changeFeedback = (feedback) => {
    this.updateModel({ feedback });
  };

  onAddAlternateResponse = () => {
    const {
      model: { correctResponse },
    } = this.props;

    this.updateModel({
      correctResponse: (correctResponse || []).map((cr) => ({
        ...cr,
        alternateResponses: [...(cr.alternateResponses || []), []],
      })),
    });
  };

  onPromptChanged = (prompt) => this.updateModel({ prompt });

  onRemoveAlternateResponse = (index) => {
    const {
      model: { correctResponse },
    } = this.props;

    this.updateModel({
      correctResponse: (correctResponse || []).map((cr) => ({
        ...cr,
        alternateResponses: (cr.alternateResponses || []).filter(
          (alt, altIndex) => altIndex !== index
        ),
      })),
    });
  };

  countChoiceInCorrectResponse = (choice) => {
    const { model } = this.props;

    return countInAnswer(choice.id, model.correctResponse);
  };

  checkAllowMultiplePlacements = (allowMultiplePlacements, c) => {
    if (allowMultiplePlacements === multiplePlacements.enabled) {
      return 0;
    }
    if (allowMultiplePlacements === multiplePlacements.disabled) {
      return 1;
    }
    return c.categoryCount || 0;

  };

  render() {
    const {
      classes,
      className,
      model,
      imageSupport,
      uploadSoundSupport,
      configuration,
      onChange,
      onConfigurationChanged,
    } = this.props;
    const {
      allowMultiplePlacements = {},
      partialScoring = {},
      lockChoiceOrder = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      scoringType = {},
      feedback = {},
      prompt = {},
      spellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {}
    } = configuration || {};
    const {
      allowMultiplePlacementsEnabled,
      teacherInstructionsEnabled,
      promptEnabled,
      rationaleEnabled,
      feedbackEnabled,
      spellCheckEnabled,
      errors,
      rubricEnabled
    } = model || {};

    const toolbarOpts = {};

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }

    const config = model.config || {};
    config.choices = config.choices || { label: '', columns: 2 };

    const categories = buildCategories(
      model.categories || [],
      model.choices || [],
      model.correctResponse || []
    );

    const alternateResponses = buildAlternateResponses(
      model.categories || [],
      model.choices || [],
      model.correctResponse || []
    );

    const choices = model.choices.map((c) => {
      c.correctResponseCount = this.countChoiceInCorrectResponse(c);
      c.categoryCount = this.checkAllowMultiplePlacements(allowMultiplePlacementsEnabled, c);
      return c;
    });

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    return (
      <IdProvider value={this.uid}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onChange}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  lockChoiceOrder:
                    lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
                  allowMultiplePlacementsEnabled:
                      allowMultiplePlacements.settings &&
                      dropdown(allowMultiplePlacements.label, [
                        multiplePlacements.enabled,
                        multiplePlacements.disabled,
                        multiplePlacements.perChoice,
                      ], ),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  feedbackEnabled: feedback.settings && toggle(feedback.label),
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  studentInstructionsEnabled:
                    studentInstructions.settings &&
                    toggle(studentInstructions.label),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  spellCheckEnabled:
                    spellCheck.settings && toggle(spellCheck.label),
                  scoringType:
                    scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric']),
                  rubricEnabled: withRubric.settings && toggle(withRubric.label)
                },
              }}
            />
          }
        >
          <div className={classNames(classes.design, className)}>
            {promptEnabled && (
              <InputContainer
                label={prompt.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.prompt || ''}
                  onChange={this.onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  disableUnderline
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.prompt}
                  maxImageHeight={maxImageHeight && maxImageHeight.prompt}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
              </InputContainer>
            )}

            {teacherInstructionsEnabled && (
              <InputContainer
                label={teacherInstructions.label}
                className={classes.inputHolder}
              >
                <EditableHtml
                  className={classes.input}
                  markup={model.teacherInstructions || ''}
                  onChange={this.changeTeacherInstructions}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
              </InputContainer>
            )}

            {rationaleEnabled && (
              <InputContainer
                label={rationale.label}
                className={classes.inputHolder}
              >
                <EditableHtml
                  className={classes.input}
                  markup={model.rationale || ''}
                  onChange={this.changeRationale}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.rationale || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.rationale || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
              </InputContainer>
            )}

            <Categories
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              model={model}
              categories={categories || []}
              onModelChanged={this.updateModel}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              configuration={configuration}
              defaultImageMaxWidth={defaultImageMaxWidth}
              defaultImageMaxHeight={defaultImageMaxHeight}
            />

            <Header
              className={classes.alternatesHeader}
              label="Alternate Responses"
              buttonLabel="ADD AN ALTERNATE RESPONSE"
              onAdd={this.onAddAlternateResponse}
            />

            {alternateResponses.map((categoriesList, index) => {
              return (
                <React.Fragment key={index}>
                  <Header
                    className={classes.alternatesHeader}
                    label="Alternate Response"
                    buttonLabel="REMOVE ALTERNATE RESPONSE"
                    onAdd={() => this.onRemoveAlternateResponse(index)}
                  />

                  <AlternateResponses
                    altIndex={index}
                    imageSupport={imageSupport}
                    model={model}
                    categories={categoriesList}
                    onModelChanged={this.updateModel}
                    uploadSoundSupport={uploadSoundSupport}
                  />
                </React.Fragment>
              );
            })}

            <Divider />
            <Choices
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              choices={choices}
              model={model}
              onModelChanged={this.updateModel}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              configuration={configuration}
              defaultImageMaxWidth={defaultImageMaxWidth}
              defaultImageMaxHeight={defaultImageMaxHeight}
            />

            {feedbackEnabled && (
              <FeedbackConfig
                feedback={model.feedback}
                onChange={this.changeFeedback}
                toolbarOpts={toolbarOpts}
              />
            )}
          </div>
        </layout.ConfigLayout>
      </IdProvider>
    );
  }
}

const styles = (theme) => ({
  alternatesHeader: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  design: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  inputHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  input: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: '600px',
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: '30px',
  },
});

export default withDragContext(withStyles(styles)(Design));
