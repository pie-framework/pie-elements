import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import { DragOverlay } from '@dnd-kit/core';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { buildState, removeChoiceFromCategory, moveChoiceToCategory } from '@pie-lib/categorize';
import { DragProvider, uid } from '@pie-lib/drag';
import { color, Feedback, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import Translator from '@pie-lib/translator';
import { AlertDialog } from '@pie-lib/config-ui';
import Choices from './choices';
import Choice from './choice';
import Categories from './categories';

const { translator } = Translator;
const log = debug('@pie-ui:categorize');

class DragPreviewWrapper extends React.Component {
  containerRef = React.createRef();

  componentDidMount() {
    if (this.containerRef.current) {
      renderMath(this.containerRef.current);
    }
  }

  render() {
    return <div ref={this.containerRef}>{this.props.children}</div>;
  }
}

export class Categorize extends React.Component {
  static propTypes = {
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
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func
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
    const { model, session } = this.props;
    const { showCorrect, showMaxChoiceAlert } = this.state;
    const {
      choicesPosition,
      extraCSSRules,
      note,
      showNote,
      env,
      language,
      maxChoicesPerCategory,
      autoplayAudioEnabled,
      customAudioButton,
    } = model;
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

    const alertTitle = translator.t('common:warning', {
      lng: model.language,
    });

    const onCloseText = translator.t('common:cancel', {
      lng: model.language,
    });

    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions =
      model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));

    return (
      <StyledUiLayout
        extraCSSRules={extraCSSRules}
        id={'main-container'}
        fontSizeFactor={fontSizeFactor}
      >
        {showTeacherInstructions && (
          <React.Fragment>
            <StyledCollapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions',
              }}
            >
              <PreviewPrompt prompt={model.teacherInstructions} />
            </StyledCollapsible>
          </React.Fragment>
        )}

        {model.prompt && (
          <PreviewPrompt
            prompt={model.prompt}
            autoplayAudioEnabled={autoplayAudioEnabled}
            customAudioButton={customAudioButton}
          />
        )}

        <CorrectAnswerToggle
          show={showCorrect || correct === false}
          toggled={showCorrect}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <StyledCategorize style={style}>
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
        </StyledCategorize>
        {displayNote && (
          <StyledNote
            dangerouslySetInnerHTML={{
              __html: note,
            }}
          />
        )}

        {showRationale && (
          <StyledCollapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={model.rationale} />
          </StyledCollapsible>
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
      </StyledUiLayout>
    );
  }
}

class CategorizeProvider extends React.Component {
  constructor(props) {
    super(props);
    this.uid = uid.generateId();
    this.state = {
      activeDragItem: null,
    };
  }

  onDragStart = (event) => {
    const { active } = event;
    const { onDragStart } = this.props;

    if (onDragStart) {
      onDragStart();
    }

    if (active?.data?.current) {
      this.setState({
        activeDragItem: active.data.current,
      });
    }
  };

  onDragEnd = (event) => {
    const { active, over } = event;
    const { onDragEnd } = this.props;

    this.setState({ activeDragItem: null });

    if (onDragEnd) {
      onDragEnd();
    }

    if (!over || !active) {
      return;
    }

    const draggedItem = active.data.current;

    if (draggedItem && draggedItem.type === 'choice') {

      const choiceData = {
        id: draggedItem.id,
        categoryId: draggedItem.categoryId,
        choiceIndex: draggedItem.choiceIndex,
        value: draggedItem.value,
        itemType: draggedItem.itemType,
      };

      if (over.id === 'choices-board') {
        if (this.categorizeRef && this.categorizeRef.removeChoice && draggedItem.categoryId) {
          this.categorizeRef.removeChoice(choiceData);
        }
      } else {
        const categoryId = over.id;

        if (this.categorizeRef && this.categorizeRef.dropChoice) {
          this.categorizeRef.dropChoice(categoryId, choiceData);
        }
      }
    }
  };

  renderDragOverlay = () => {
    const { activeDragItem } = this.state;
    const { model } = this.props;
    
    if (!activeDragItem) return null;

    if (activeDragItem.type === 'choice') {
      const choice = model.choices?.find(c => c.id === activeDragItem.id);
      if (choice) {
        return (
          <Choice
            key={choice.id}
            id={choice.id}
            {...choice}
          />
        );
      }
    }

    return null;
  };

  render() {
    return (
      <DragProvider
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <uid.Provider value={this.uid}>
          <Categorize ref={(ref) => this.categorizeRef = ref} {...this.props} />
          <DragOverlay>
            <DragPreviewWrapper>
              {this.renderDragOverlay()}
            </DragPreviewWrapper>
          </DragOverlay>
        </uid.Provider>
      </DragProvider>
    );
  }
}

const StyledUiLayout = styled(UiLayout)(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.background(),
  position: 'relative',
}));

const StyledNote = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledCategorize = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

export default CategorizeProvider;
