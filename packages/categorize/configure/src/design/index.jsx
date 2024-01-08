import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FeedbackConfig, InputContainer, layout, settings } from '@pie-lib/pie-toolbox/config-ui';
import { countInAnswer, ensureNoExtraChoicesInAnswer, ensureNoExtraChoicesInAlternate } from '@pie-lib/pie-toolbox/categorize';
import {EditableHtml} from '@pie-lib/pie-toolbox/editable-html';
import { uid, withDragContext } from '@pie-lib/pie-toolbox/drag';

import Categories from './categories';
import AlternateResponses from './categories/alternateResponses';
import Choices from './choices';
import { buildAlternateResponses, buildCategories } from './builder';
import Header from './header';
import { getMaxCategoryChoices, multiplePlacements } from '../utils';
import { AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
import Translator from '@pie-lib/pie-toolbox/translator';

const { translator } = Translator;
const { dropdown, Panel, toggle, radio, numberField } = settings;
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
    updatedModel.maxChoicesPerCategory = updatedModel.allowMaxChoicesPerCategory ? updatedModel.maxChoicesPerCategory : 0;

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


  render() {
    const { classes, configuration, imageSupport, model, uploadSoundSupport, onConfigurationChanged } = this.props;
    const {
      allowMultiplePlacements = {},
      allowAlternate = {},
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
    } = configuration || {};
    const {
      allowAlternateEnabled,
      allowMaxChoicesPerCategory,
      feedbackEnabled,
      maxChoicesPerCategory,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};

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
      // PD-2960: deleted temporary from settings panel
      // allowAlternateEnabled: allowAlternate.settings && toggle(allowAlternate.label),
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
    const alertMaxChoicesMsg = translator.t('translation:categorize:maxChoicesPerCategoryRestriction', {lng: model.language, maxChoicesPerCategory });

    return (
      <IdProvider value={this.uid}>
        <layout.ConfigLayout
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
              modal={<AlertDialog
                  title={'Warning'}
                  text={alertMaxChoicesMsg}
                  open={isOpened}
                  onClose={this.onAlertModalCancel}
              />}
            />
          }
        >
          {teacherInstructionsEnabled && (
            <InputContainer label={teacherInstructions.label} className={classes.inputContainer}>
              <EditableHtml
                className={classes.input}
                markup={model.teacherInstructions || ''}
                onChange={this.changeTeacherInstructions}
                imageSupport={imageSupport}
                nonEmpty={false}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
              />
            </InputContainer>
          )}

          {promptEnabled && (
            <InputContainer label={prompt.label} className={classes.inputContainer}>
              <EditableHtml
                className={classes.input}
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
                mathMlOptions={mathMlOptions}
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
            <Header
              className={classes.alternatesHeader}
              label="Alternate Responses"
              buttonLabel="ADD AN ALTERNATE RESPONSE"
              onAdd={this.onAddAlternateResponse}
            />
          )}
          {allowAlternateEnabled &&
            alternateResponses.map((categoriesList, index) => {
              return (
                <React.Fragment key={index}>
                  <Header
                    className={classes.alternatesHeader}
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
                    toolbarOpts={toolbarOpts}
                    defaultImageMaxWidth={defaultImageMaxWidth}
                    defaultImageMaxHeight={defaultImageMaxHeight}
                    mathMlOptions={mathMlOptions}
                  />
                </React.Fragment>
              );
            })}

          {rationaleEnabled && (
            <InputContainer label={rationale.label} className={classes.inputContainer}>
              <EditableHtml
                className={classes.input}
                markup={model.rationale || ''}
                onChange={this.changeRationale}
                imageSupport={imageSupport}
                nonEmpty={false}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
              />
            </InputContainer>
          )}

          {feedbackEnabled && (
            <FeedbackConfig feedback={model.feedback} onChange={this.changeFeedback} toolbarOpts={toolbarOpts} />
          )}
        </layout.ConfigLayout>
      </IdProvider>
    );
  }
}

const styles = (theme) => ({
  alternatesHeader: {
    marginBottom: theme.spacing.unit * 2,
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  inputContainer: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
});

export default withDragContext(withStyles(styles)(Design));
