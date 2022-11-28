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

const { dropdown, Panel, toggle, radio, numberField } = settings;
const { Provider: IdProvider } = uid;
import isEmpty from 'lodash/isEmpty';

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

  isCorrectResponseDuplicated = (choices,alternate) => {
     const stringChoices =  JSON.stringify(choices.sort());
     const stringAlternate = alternate.map((alternate) => JSON.stringify(alternate.sort()));
     const foundIndexDuplicate = stringAlternate.findIndex(alternate => alternate === stringChoices);
     return foundIndexDuplicate;
  };

  isAlternateDuplicated = (alternate) => {
    const elementSet = new Set();
    const stringAlternate = alternate.map((alternate) => JSON.stringify(alternate.sort()));
    for (let i = 0; i < stringAlternate.length; i++) {
      if (elementSet.has(stringAlternate[i])) {
        return i;
      }
      elementSet.add(stringAlternate[i]);
    }

    return-1;
  };


  validate = (model = {}, config = {}) => {
    const { categories, choices, correctResponse } = model;
    const { minChoices = 1, maxChoices=15, minCategories=1, maxCategories=12, maxLengthPerChoice=300, maxLengthPerCategory=150 } = config;
    const reversedChoices = [ ...choices || []].reverse();
    const errors = {};
    const choicesErrors = {};
    const categoriesErrors = {};
    const duplicateResponsesError = {};

    categories.forEach((category, index) => {
      const {id, label} = category;
      const parsedLabel = label.replace(/<(?:.|\n)*?>/gm, '');
      if (parsedLabel.length > maxLengthPerCategory){
        categoriesErrors[id] = `Category labels should be no more than ${maxLengthPerCategory} characters long.`;
      }
    });

    reversedChoices.forEach((choice, index) => {
      const { id, content } = choice;
      const parsedContent = content.replace(/<(?:.|\n)*?>/gm, '');
      if (parsedContent.length > maxLengthPerChoice){
        choicesErrors[id] = `Tokens should be no more than ${maxLengthPerChoice} characters long.`;
      }
      if (content === '' || content === '<div></div>') {
        choicesErrors[id] = 'Tokens should not be empty.';
      } else {
        const identicalAnswer = reversedChoices.slice(index + 1).some(c => c.content === content);

        if (identicalAnswer) {
          choicesErrors[id] = 'Tokens content should be unique.';
        }
      }
    });

    const nbOfCategories = (categories || []).length;
    const nbOfChoices = (choices || []).length;

    if (nbOfCategories > maxCategories) {
      errors.maxCategoriesError = `No more than ${maxCategories} categories should be defined.`;
    } else if (nbOfCategories < minCategories) {
      errors.maxCategoriesError = `There should be at least ${minCategories} category defined.`;
    }

    if (nbOfChoices < minChoices) {
      errors.maxChoicesError = `There should be at least ${minChoices} choices defined.`;
    } else if (nbOfChoices > maxChoices) {
      errors.maxChoicesError = `No more than ${maxChoices} choices should be defined.`;
    }

    if (nbOfChoices && nbOfCategories) {
      let hasAssociations = false;

      (correctResponse || []).forEach(response => {
        const { choices = [], alternateResponses = [] } = response;

        if (choices.length) {
          hasAssociations = true;
        } else {
          alternateResponses.forEach(alternate => {
            if ((alternate || []).length) {
              hasAssociations = true;
            }
          });
        }
      });

      let duplicateAlternateIndex = -1;
      let duplicateCategory = '';
      (correctResponse || []).forEach(response => {
        const { choices = [], alternateResponses = [], category } = response;
        if(duplicateAlternateIndex === -1){
          duplicateAlternateIndex = this.isCorrectResponseDuplicated(choices,alternateResponses);
          if(duplicateAlternateIndex === -1){
            duplicateAlternateIndex = this.isAlternateDuplicated(alternateResponses);
          }
          duplicateCategory = category;
        }
      });

      if(duplicateAlternateIndex > -1){
        // duplicateResponsesError[duplicateCategory + "-" + duplicateAlternateIndex] = 'Each Answer should be distinct';
        duplicateResponsesError.duplicateAlternate = {index:duplicateAlternateIndex, category:duplicateCategory};
      }

      if (!hasAssociations) {
        errors.associationError = 'At least one token should be assigned to at least one category.';
      }
    }


    if (!isEmpty(choicesErrors)) {
      errors.choicesErrors = choicesErrors;
    }

    if (!isEmpty(categoriesErrors)) {
      errors.categoriesErrors = categoriesErrors;
    }

    if (!isEmpty(duplicateResponsesError)) {
      errors.duplicateResponsesErrors = duplicateResponsesError;
    }

    return errors;
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
      categoriesPerRow = {},
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
      //errors,
      rubricEnabled
    } = model || {};

    const errors = this.validate(model,configuration);
    console.log(errors.duplicateResponsesErrors);
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
                  categoriesPerRow: categoriesPerRow.settings && numberField(categoriesPerRow.label,
                    {
                          label: categoriesPerRow.label,
                          min: 1,
                          max: 4,
                      }),
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
                  rubricEnabled: withRubric?.settings && toggle(withRubric?.label)
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
                    error={errors.duplicateResponsesErrors}
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
