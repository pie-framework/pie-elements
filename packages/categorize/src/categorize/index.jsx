import React from 'react';
import PropTypes from 'prop-types';
import Choices from './choices';
import Categories from './categories';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { withStyles } from '@material-ui/core/styles';
import { buildState, removeChoiceFromCategory, moveChoiceToCategory } from '@pie-lib/pie-toolbox/categorize';
import { withDragContext, uid } from '@pie-lib/pie-toolbox/drag';
import { color, Feedback, Collapsible, hasText, PreviewPrompt, UiLayout } from '@pie-lib/pie-toolbox/render-ui';
import debug from 'debug';
import Translator from '@pie-lib/pie-toolbox/translator';
import { AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
const { translator } = Translator;

const log = debug('@pie-ui:categorize');

export class Categorize extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object,
    session: PropTypes.shape({
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          choice: PropTypes.string,
          category: PropTypes.string,
        }),
      ),
    }),
    onAnswersChange: PropTypes.func.isRequired,
    onShowCorrectToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      showCorrect: false,
      showMaxChoiceAlert: false,
    };
  }

  removeChoice = (c) => {
    log('[removeChoice]: ', c);
    const { onAnswersChange, session } = this.props;
    const answers = removeChoiceFromCategory(c.id, c.categoryId, c.choiceIndex, session.answers);
    onAnswersChange(answers);
  };

  dropChoice = (categoryId, draggedChoice) => {
    const { session, onAnswersChange, model } = this.props;
    const { maxChoicesPerCategory = 0 } = model || {};
    const { answers = [] } = session || {};
    let newAnswers;
    if (draggedChoice) {
      log('[dropChoice] category: ', draggedChoice.categoryId, 'choice: ', draggedChoice);
    } else {
      log('[dropChoice] category: ', undefined, 'choice: ', undefined);
    }

    const answer = answers.find((answer) => answer.category === categoryId);

    // treat special case to replace the existing choice with the new one when maxChoicesPerCategory = 1
    if (draggedChoice && maxChoicesPerCategory === 1 && answer && answer.choices && answer.choices.length === 1) {
      newAnswers = moveChoiceToCategory(
        draggedChoice.id,
        draggedChoice.categoryId,
        categoryId,
        draggedChoice.choiceIndex,
        answers,
      );
      newAnswers = removeChoiceFromCategory(answer.choices[0], categoryId, 0, answers);
    }

    // treat special case when there are as many choices as maxChoicesPerCategory is
    else if (
      draggedChoice &&
      maxChoicesPerCategory > 1 &&
      answer &&
      answer.choices &&
      answer.choices.length === maxChoicesPerCategory
    ) {
      newAnswers = draggedChoice.categoryId
        ? moveChoiceToCategory(
            draggedChoice.id,
            draggedChoice.categoryId,
            draggedChoice.categoryId,
            draggedChoice.choiceIndex,
            answers,
          )
        : removeChoiceFromCategory(draggedChoice.id, draggedChoice.categoryId, draggedChoice.choiceIndex, answers);
      this.setState({ showMaxChoiceAlert: true });
    }

    // treat special case when there are more choices that maxChoicesPerCategory is (testing purpose in pits)
    else if (maxChoicesPerCategory !== 0 && answer && answer.choices && answer.choices.length > maxChoicesPerCategory) {
      newAnswers = answers;
      this.setState({ showMaxChoiceAlert: true });
    } else {
      newAnswers = draggedChoice
        ? moveChoiceToCategory(
            draggedChoice.id,
            draggedChoice.categoryId,
            categoryId,
            draggedChoice.choiceIndex,
            answers,
          )
        : this.removeChoice(categoryId);
    }

    if (draggedChoice) {
      onAnswersChange(newAnswers);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel } = nextProps;

    // check if the note is the default one for prev language and change to the default one for new language
    // this check is necessary in order to diferanciate between default and authour defined note
    // and only change between languages for default ones
    if (
      model.note &&
      model.language &&
      model.language !== nextModel.language &&
      model.note === translator.t('common:commonCorrectAnswerWithAlternates', { lng: model.language })
    ) {
      model.note = translator.t('common:commonCorrectAnswerWithAlternates', { lng: nextModel.language });
    }

    this.setState({ showCorrect: false });
  }

  toggleShowCorrect = () =>
    this.setState({ showCorrect: !this.state.showCorrect }, () => {
      this.props.onShowCorrectToggle();
    });

  getPositionDirection = (choicePosition) => {
    let flexDirection;

    switch (choicePosition) {
      case 'left':
        flexDirection = 'row-reverse';
        break;
      case 'right':
        flexDirection = 'row';
        break;
      case 'below':
        flexDirection = 'column';
        break;
      default:
        // above
        flexDirection = 'column-reverse';
        break;
    }

    return flexDirection;
  };

  existAlternateResponse = (correctResponse) =>
    correctResponse?.some((correctRes) => correctRes.alternateResponses?.length > 0);

  render() {
    const { classes, model, session } = this.props;
    const { showCorrect, showMaxChoiceAlert } = this.state;
    const { choicesPosition, extraCSSRules, note, showNote, env, language, maxChoicesPerCategory, autoplayAudioEnabled } = model;
    const { mode, role } = env || {};
    const choicePosition = choicesPosition || 'above';

    const style = {
      flexDirection: this.getPositionDirection(choicePosition),
      gap: '8px',
    };

    const { categories, choices, correct } = buildState(
      model.categories,
      model.choices,
      showCorrect ? model.correctResponse : session.answers,
      model.correctResponse,
    );

    log('[render] disabled: ', model.disabled);

    const { rowLabels, categoriesPerRow, correctResponse, fontSizeFactor } = model;
    const nbOfRows = (categories && Math.ceil(categories.length / categoriesPerRow)) || 0;
    const existAlternate = this.existAlternateResponse(correctResponse) || false;
    const displayNote =
      (showCorrect || (mode === 'view' && role === 'instructor')) && showNote && note && existAlternate;
    const alertMessage = translator.t('translation:categorize:limitMaxChoicesPerCategory', {
      lng: model.language,
      maxChoicesPerCategory,
    });

    // Safari, Firefox, and Edge do not support autoplay audio smoothly in our use case
    const addAutoplayAudio = autoplayAudioEnabled && !(/Safari|Firefox|Edg/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

    const alertTitle = translator.t('common:warning', {
      lng: model.language,
    });

    const onCloseText = translator.t('common:cancel', {
      lng: model.language,
    });

    return (
      <UiLayout extraCSSRules={extraCSSRules} id={'main-container'} className={classes.mainContainer} fontSizeFactor={fontSizeFactor}>
        {model.teacherInstructions && hasText(model.teacherInstructions) && (
          <React.Fragment>
            <Collapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions',
              }}
              className={classes.collapsible}
            >
              <PreviewPrompt prompt={model.teacherInstructions} />
            </Collapsible>
          </React.Fragment>
        )}

        {model.prompt && <PreviewPrompt prompt={model.prompt} autoplayAudioEnabled={addAutoplayAudio} />}

        <CorrectAnswerToggle
          show={showCorrect || correct === false}
          toggled={showCorrect}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <div className={classes.categorize} style={style}>
          <div style={{ display: 'flex', flex: 1 }}>
            <Categories
              model={model}
              disabled={model.disabled}
              categories={categories}
              onDropChoice={this.dropChoice}
              onRemoveChoice={this.removeChoice}
              rowLabels={(rowLabels || []).slice(0, nbOfRows)}
            />
          </div>
          <Choices
            disabled={model.disabled}
            model={model}
            choices={choices}
            choicePosition={choicePosition}
            onDropChoice={this.dropChoice}
            onRemoveChoice={this.removeChoice}
          />
        </div>

        {displayNote && (
          <div
            className={classes.note}
            dangerouslySetInnerHTML={{
              __html: note,
            }}
          />
        )}

        {model.rationale && hasText(model.rationale) && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }} className={classes.collapsible}>
            <PreviewPrompt prompt={model.rationale} />
          </Collapsible>
        )}

        {model.correctness && model.feedback && !showCorrect && (
          <Feedback correctness={model.correctness} feedback={model.feedback} />
        )}
        <AlertDialog
          title={alertTitle}
          text={alertMessage}
          open={showMaxChoiceAlert}
          onCloseText={onCloseText}
          onClose={() => this.setState({ showMaxChoiceAlert: false })}
        ></AlertDialog>
      </UiLayout>
    );
  }
}

class CategorizeProvider extends React.Component {
  constructor(props) {
    super(props);
    this.uid = uid.generateId();
  }

  render() {
    return (
      <uid.Provider value={this.uid}>
        <Categorize {...this.props} />
      </uid.Provider>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
    position: 'relative'
  },
  note: {
    marginBottom: theme.spacing.unit * 2,
  },
  categorize: {
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  collapsible: {
    paddingBottom: theme.spacing.unit * 2,
  },
});

export default withDragContext(withStyles(styles)(CategorizeProvider));
