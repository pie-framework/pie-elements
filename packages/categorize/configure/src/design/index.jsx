import { getPluginProps } from './utils';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DragOverlay } from '@dnd-kit/core';
import { FeedbackConfig, InputContainer, layout, settings } from '@pie-lib/config-ui';
import {
  countInAnswer,
  ensureNoExtraChoicesInAnswer,
  ensureNoExtraChoicesInAlternate,
  moveChoiceToCategory,
  moveChoiceToAlternate,
  removeChoiceFromCategory,
  removeChoiceFromAlternate,
  verifyAllowMultiplePlacements,
} from '@pie-lib/categorize';
import EditableHtml from '@pie-lib/editable-html';
import { DragProvider, uid } from '@pie-lib/drag';

import Categories from './categories';
import AlternateResponses from './categories/alternateResponses';
import Choices from './choices';
import Choice from './choices/choice';
import ChoicePreview from './categories/choice-preview';
import { buildAlternateResponses, buildCategories } from './builder';
import Header from './header';
import { getMaxCategoryChoices, multiplePlacements } from '../utils';
import { AlertDialog } from '@pie-lib/config-ui';
import Translator from '@pie-lib/translator';

const { translator } = Translator;
const { dropdown, Panel, toggle, radio, numberField } = settings;
const { Provider: IdProvider } = uid;

const StyledHeader = styled(Header)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

export class Design extends React.Component {
  static propTypes = {
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
    this.state = {
      activeDragItem: null,
    };
  }

  updateModel = (props) => {
    const { model, onChange } = this.props;

    const updatedModel = {
      ...model,
      ...props,
    };

    updatedModel.choices = updatedModel.choices.map((c) => ({
      ...c,
      categoryCount: this.checkAllowMultiplePlacements(updatedModel.allowMultiplePlacementsEnabled, c),
    }));

    //Ensure that there are no extra choices in correctResponse, if the user has decided that only one choice may be used.
    updatedModel.correctResponse = ensureNoExtraChoicesInAnswer(
      updatedModel.correctResponse || [],
      updatedModel.choices,
    );

    //Ensure that there are no extra choices in alternate responses, if the user has decided that only one choice may be used.
    updatedModel.correctResponse = ensureNoExtraChoicesInAlternate(
      updatedModel.correctResponse || [],
      updatedModel.choices,
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

    // ensure that maxChoicesPerCategory is reset if author switch back the corresponding switch (allowMaxChoicesPerCategory)
    updatedModel.maxChoicesPerCategory = updatedModel.allowMaxChoicesPerCategory
      ? updatedModel.maxChoicesPerCategory
      : 0;

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
        alternateResponses: (cr.alternateResponses || []).filter((alt, altIndex) => altIndex !== index),
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

  isAlertModalOpened = () => {
    const { model } = this.props;
    const { maxChoicesPerCategory = 0 } = model || {};
    const maxChoices = getMaxCategoryChoices(model);
    // when maxChoicesPerCategory is set to 0, there is no limit so modal should not be opened
    return maxChoicesPerCategory !== 0 ? maxChoices > maxChoicesPerCategory : false;
  };

  onAlertModalCancel = () => {
    const { model } = this.props;
    const maxChoices = getMaxCategoryChoices(model);
    this.updateModel({ maxChoicesPerCategory: maxChoices });
  };

  onDragStart = (event) => {
    const { active } = event;
    const draggedItem = active.data.current;

    this.setState({
      activeDragItem: draggedItem,
    });
  };

  onDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !active) {
      console.log('Missing over or active:', { over, active });
      return;
    }

    const { model } = this.props;
    const { allowAlternateEnabled } = model;
    const activeData = active.data.current;
    const overData = over.data.current;

    // moving a choice between categories (correct response)
    if (activeData.type === 'choice-preview' && overData.type === 'category') {
      this.moveChoice(activeData.id, activeData.categoryId, overData.id, 0);
    }

    // placing a choice into a category (correct response)
    if (activeData.type === 'choice' && overData.type === 'category') {
      this.addChoiceToCategory({ id: activeData.id }, overData.id);
    }

    // moving a choice between categories (alternate response)
    if (activeData.type === 'choice-preview' && overData.type === 'category-alternate') {
      const fromAlternateIndex = activeData.alternateResponseIndex;
      const toAlternateIndex = overData.alternateResponseIndex;
      this.moveChoiceInAlternate(activeData.id, activeData.categoryId, overData.id, 0, toAlternateIndex);
    }

    // placing a choice into a category (alternate response)
    if (allowAlternateEnabled && activeData.type === 'choice' && overData.type === 'category-alternate') {
      console.log('Placing choice into alternate category');
      const choiceId = activeData.id;
      const categoryId = overData.id;
      const toAlternateResponseIndex = overData.alternateResponseIndex;
      console.log('Placing choice into alternate category:', { choiceId, categoryId, toAlternateResponseIndex });
      this.addChoiceToAlternateCategory({ id: choiceId }, categoryId, toAlternateResponseIndex);
    }
  };

  addChoiceToCategory = (addedChoice, categoryId) => {
    const { model } = this.props;
    let { choices = [], correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === addedChoice.id);

    let newCorrectResponse = moveChoiceToCategory(addedChoice.id, undefined, categoryId, 0, correctResponse);

    if (choice.categoryCount !== 0) {
      newCorrectResponse = verifyAllowMultiplePlacements(addedChoice, categoryId, newCorrectResponse);
    }
    const maxCategoryChoices = getMaxCategoryChoices(model);

    this.updateModel({
      correctResponse: newCorrectResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  deleteChoiceFromCategory = (category, choice, choiceIndex) => {
    const { model } = this.props;
    const correctResponse = removeChoiceFromCategory(choice.id, category.id, choiceIndex, model.correctResponse);

    this.updateModel({ correctResponse });
  };

  moveChoice = (choiceId, from, to, choiceIndex) => {
    const { model } = this.props;
    let { choices, correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === choiceId);
    if (to === from || !choice) {
      return;
    }
    if (choice.categoryCount !== 0) {
      correctResponse = moveChoiceToCategory(choice.id, from, to, choiceIndex, correctResponse);
      correctResponse = verifyAllowMultiplePlacements(choice, to, correctResponse);
    } else if (choice.categoryCount === 0) {
      correctResponse = moveChoiceToCategory(choice.id, undefined, to, 0, correctResponse);
    }
    const maxCategoryChoices = getMaxCategoryChoices(model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    this.updateModel({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  // Choice manipulation methods for alternate responses
  addChoiceToAlternateCategory = (addedChoice, categoryId, altIndex) => {
    const { model } = this.props;
    const { correctResponse, choices, maxChoicesPerCategory = 0 } = model;

    const choice = choices.find((c) => c.id === addedChoice.id);

    correctResponse.forEach((a) => {
      if (a.category === categoryId) {
        a.alternateResponses = a.alternateResponses || [];

        if (a.alternateResponses[altIndex] === undefined) {
          a.alternateResponses[altIndex] = [];
        }

        a.alternateResponses[altIndex].push(addedChoice.id);
        if (choice.categoryCount && choice.categoryCount !== 0) {
          a.alternateResponses[altIndex] = a.alternateResponses[altIndex].reduce((acc, currentValue) => {
            if (currentValue === choice.id) {
              const foundIndex = acc.findIndex((c) => c === choice.id);
              if (foundIndex === -1) {
                acc.push(currentValue);
              }
            } else {
              acc.push(currentValue);
            }

            return acc;
          }, []);
        }

        return a;
      } else {
        if (a.alternateResponses[altIndex] && choice.categoryCount !== 0) {
          a.alternateResponses[altIndex] = a.alternateResponses[altIndex].filter((c) => c !== addedChoice.id);
          return a;
        }
      }

      return a;
    });

    const maxCategoryChoices = getMaxCategoryChoices(model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    this.updateModel({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  moveChoiceInAlternate = (choiceId, from, to, choiceIndex, alternateIndex) => {
    const { model } = this.props;
    let { choices, correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === choiceId);
    correctResponse = moveChoiceToAlternate(
      choiceId,
      from,
      to,
      choiceIndex,
      correctResponse,
      alternateIndex,
      choice?.categoryCount,
    );

    const maxCategoryChoices = getMaxCategoryChoices(model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    this.updateModel({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  deleteChoiceFromAlternateCategory = (category, choice, choiceIndex, altIndex) => {
    const { model } = this.props;

    const correctResponse = removeChoiceFromAlternate(
      choice.id,
      category.id,
      choiceIndex,
      altIndex,
      model.correctResponse,
    );

    this.updateModel({ correctResponse });
  };

  renderDragOverlay = () => {
    const { activeDragItem } = this.state;
    const { model, configuration } = this.props;

    if (!activeDragItem) return null;

    if (activeDragItem.type === 'choice') {
      const choice = model.choices?.find(c => c.id === activeDragItem.id);
      if (!choice) return null;

      return (
        <Choice
          choice={choice}
          configuration={configuration}
        />
      );
    } else if (activeDragItem.type === 'choice-preview' && activeDragItem.alternateResponseIndex === undefined) {
      const choice = model.choices?.find(c => c.id === activeDragItem.id);
      if (!choice) return null;
      return (
        <ChoicePreview
          choice={choice}
        />
      );
    } else if (activeDragItem.type === 'choice-preview' && activeDragItem.alternateResponseIndex !== undefined) {
      const choice = model.choices?.find(c => c.id === activeDragItem.id);
      if (!choice) return null;
      return (
        <ChoicePreview
          choice={choice}
          alternateResponseIndex={activeDragItem.alternateResponseIndex}
        />
      );
    }

    return null;
  };

  render() {
    const { configuration, imageSupport, model, uploadSoundSupport, onConfigurationChanged } = this.props;
    const {
      allowAlternate = {},
      allowMultiplePlacements = {},
      baseInputConfiguration = {},
      categoriesPerRow = {},
      choicesPosition = {},
      contentDimensions = {},
      feedback = {},
      lockChoiceOrder = {},
      maxImageHeight = {},
      maxImageWidth = {},
      maxPlacements = {},
      minCategoriesPerRow = 1,
      partialScoring = {},
      prompt = {},
      rationale = {},
      scoringType = {},
      settingsPanelDisabled,
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
      allowMaxAnswerChoices = {},
    } = configuration || {};
    const {
      allowAlternateEnabled,
      allowMaxChoicesPerCategory,
      errors,
      feedbackEnabled,
      maxChoicesPerCategory,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
      extraCSSRules,
    } = model || {};
    const {
      prompt: promptError,
      rationale: rationaleError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const config = model.config || {};
    config.choices = config.choices || { label: '', columns: 2 };

    const categories = buildCategories(model.categories || [], model.choices || [], model.correctResponse || []);

    const alternateResponses = buildAlternateResponses(
      model.categories || [],
      model.choices || [],
      model.correctResponse || [],
    );

    const choices = model.choices.map((c) => {
      c.correctResponseCount = this.countChoiceInCorrectResponse(c);
      // ensure categoryCount is set even though updatedModel hasn't been called
      c.categoryCount = this.checkAllowMultiplePlacements(model.allowMultiplePlacementsEnabled, c);
      return c;
    });

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelSettings = {
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
      categoriesPerRow:
        categoriesPerRow.settings &&
        numberField(categoriesPerRow.label, {
          label: categoriesPerRow.label,
          min: minCategoriesPerRow,
          max: 6,
        }),
      choicesPosition: choicesPosition.settings && radio(choicesPosition.label, ['below', 'above', 'left', 'right']),
      allowMultiplePlacementsEnabled:
        allowMultiplePlacements.settings &&
        dropdown(allowMultiplePlacements.label, [
          multiplePlacements.enabled,
          multiplePlacements.disabled,
          multiplePlacements.perChoice,
        ]),
      maxAnswerChoices:
        allowMaxAnswerChoices.settings &&
        numberField(allowMaxAnswerChoices.label, {
          label: '',
          min: choices?.length || 0,
          max: 30,
        }),
      allowMaxChoicesPerCategory: maxPlacements.settings && toggle(maxPlacements.label),
      maxChoicesPerCategory:
        allowMaxChoicesPerCategory === true &&
        numberField(maxPlacements.label, {
          label: '',
          min: 0,
          max: 30,
        }),
      promptEnabled: prompt.settings && toggle(prompt.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      allowAlternateEnabled: allowAlternate.settings && toggle(allowAlternate.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const isOpened = this.isAlertModalOpened();
    const alertMaxChoicesMsg = translator.t('translation:categorize:maxChoicesPerCategoryRestriction', {
      lng: model.language,
      maxChoicesPerCategory,
    });

    return (
      <DragProvider onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <IdProvider value={this.uid}>
          <layout.ConfigLayout
            extraCSSRules={extraCSSRules}
            dimensions={contentDimensions}
            hideSettings={settingsPanelDisabled}
            settings={
              <Panel
                model={model}
                onChangeModel={this.updateModel}
                configuration={configuration}
                onChangeConfiguration={onConfigurationChanged}
                groups={{
                  Settings: panelSettings,
                  Properties: panelProperties,
                }}
                modal={
                  <AlertDialog
                    title={'Warning'}
                    text={alertMaxChoicesMsg}
                    open={isOpened}
                    onClose={this.onAlertModalCancel}
                  />
                }
              />
            }
          >
            {teacherInstructionsEnabled && (
              <StyledInputContainer label={teacherInstructions.label}>
                <EditableHtml
                  markup={model.teacherInstructions || ''}
                  onChange={this.changeTeacherInstructions}
                  imageSupport={imageSupport}
                  error={teacherInstructionsError}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  pluginProps={getPluginProps(teacherInstructions?.inputConfiguration, baseInputConfiguration)}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
                {teacherInstructionsError && <ErrorText>{teacherInstructionsError}</ErrorText>}
              </StyledInputContainer>
            )}

            {promptEnabled && (
              <StyledInputContainer label={prompt.label}>
                <EditableHtml
                  markup={model.prompt || ''}
                  onChange={this.onPromptChanged}
                  imageSupport={imageSupport}
                  error={promptError}
                  nonEmpty={false}
                  disableUnderline
                  toolbarOpts={toolbarOpts}
                  pluginProps={getPluginProps(prompt?.inputConfiguration, baseInputConfiguration)}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.prompt}
                  maxImageHeight={maxImageHeight && maxImageHeight.prompt}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
                {promptError && <ErrorText>{promptError}</ErrorText>}
              </StyledInputContainer>
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
              mathMlOptions={mathMlOptions}
            />

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

            {allowAlternateEnabled && (
              <StyledHeader
                label="Alternate Responses"
                buttonLabel="ADD AN ALTERNATE RESPONSE"
                onAdd={this.onAddAlternateResponse}
              />
            )}
            {allowAlternateEnabled &&
              alternateResponses.map((categoriesList, index) => {
                return (
                  <React.Fragment key={index}>
                    <StyledHeader
                      variant={'subtitle1'}
                      label="Alternate Response"
                      buttonLabel="REMOVE ALTERNATE RESPONSE"
                      onAdd={() => this.onRemoveAlternateResponse(index)}
                    />
                    <AlternateResponses
                      altIndex={index}
                      imageSupport={imageSupport}
                      model={model}
                      configuration={configuration}
                      categories={categoriesList}
                      onModelChanged={this.updateModel}
                      uploadSoundSupport={uploadSoundSupport}
                      mathMlOptions={mathMlOptions}
                    />
                  </React.Fragment>
                );
              })}

            {rationaleEnabled && (
              <StyledInputContainer label={rationale.label}>
                <EditableHtml
                  markup={model.rationale || ''}
                  onChange={this.changeRationale}
                  imageSupport={imageSupport}
                  error={rationaleError}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  pluginProps={getPluginProps(prompt?.inputConfiguration, baseInputConfiguration)}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
                {rationaleError && <ErrorText>{rationaleError}</ErrorText>}
              </StyledInputContainer>
            )}

            {feedbackEnabled && (
              <FeedbackConfig feedback={model.feedback} onChange={this.changeFeedback} toolbarOpts={toolbarOpts} />
            )}
          </layout.ConfigLayout>
          <DragOverlay>
            {this.renderDragOverlay()}
          </DragOverlay>
        </IdProvider>
      </DragProvider>
    );
  }
}

export default Design;
