import React from 'react';
import PropTypes from 'prop-types';
import Choices from './choices';
import Categories from './categories';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { withStyles } from '@material-ui/core/styles';
import { buildState, removeChoiceFromCategory, moveChoiceToCategory } from '@pie-lib/categorize';
import { withDragContext, uid } from '@pie-lib/drag';
import { color, Feedback, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
import debug from 'debug';

const log = debug('@pie-ui:categorize');

const removeHTMLTags = (html) => {
  const tmp = document.createElement('DIV');

  tmp.innerHTML = html;

  const value = tmp.textContent || tmp.innerText || '';

  return value.trim();
};

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
    };
  }

  removeChoice = (c) => {
    log('[removeChoice]: ', c);
    const { onAnswersChange, session } = this.props;
    const answers = removeChoiceFromCategory(c.id, c.categoryId, c.choiceIndex, session.answers);
    onAnswersChange(answers);
  };

  dropChoice = (categoryId, draggedChoice) => {
    const { session, onAnswersChange } = this.props;
    if (draggedChoice) {
      log('[dropChoice] category: ', draggedChoice.categoryId, 'choice: ', draggedChoice);
    } else {
      log('[dropChoice] category: ', undefined, 'choice: ', undefined);
    }

    const answers = draggedChoice
      ? moveChoiceToCategory(
          draggedChoice.id,
          draggedChoice.categoryId,
          categoryId,
          draggedChoice.choiceIndex,
          session.answers,
        )
      : this.removeChoice(categoryId);

    if (draggedChoice) {
      onAnswersChange(answers);
    }
  };

  UNSAFE_componentWillReceiveProps() {
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
    const { showCorrect } = this.state;
    const { choicesPosition, note, showNote, env } = model;
    const { mode, role } = env || {};
    const choicePosition = choicesPosition || 'above';

    const style = {
      flexDirection: this.getPositionDirection(choicePosition),
    };

    const { categories, choices, correct } = buildState(
      model.categories,
      model.choices,
      showCorrect ? model.correctResponse : session.answers,
      model.correctResponse,
    );

    log('[render] disabled: ', model.disabled);

    const { rowLabels, categoriesPerRow, correctResponse } = model;
    const nbOfRows = (categories && Math.ceil(categories.length / categoriesPerRow)) || 0;
    const existAlternate = this.existAlternateResponse(correctResponse) || false;
    const displayNote =
      (showCorrect || (mode === 'view' && role === 'instructor')) && showNote && note && existAlternate;

    return (
      <div className={classes.mainContainer}>
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
            <br />
          </React.Fragment>
        )}
        {model.prompt && removeHTMLTags(model.prompt) && (
          <div className={classes.prompt}>
            <PreviewPrompt prompt={model.prompt} />
          </div>
        )}
        <CorrectAnswerToggle
          className={classes.toggle}
          show={showCorrect || correct === false}
          toggled={showCorrect}
          onToggle={this.toggleShowCorrect}
        />
        <div className={classes.categorize} style={style}>
          <div style={{ display: 'flex', flex: 1 }}>
            {!!(rowLabels && nbOfRows) && (
              <div style={{ display: 'grid' }}>
                {rowLabels.slice(0, nbOfRows).map((label, index) => (
                  <div
                    key={index}
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: label,
                    }}
                  />
                ))}
              </div>
            )}
            <Categories
              model={model}
              disabled={model.disabled}
              categories={categories}
              onDropChoice={this.dropChoice}
              onRemoveChoice={this.removeChoice}
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
              __html: `<strong>Note:</strong> ${note}`,
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
      </div>
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
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background(),
  },
  prompt: {
    marginBottom: '35px',
    verticalAlign: 'middle',
  },
  note: {
    padding: '5px 0',
  },
  categorize: {
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  collapsible: {
    paddingBottom: theme.spacing.unit * 2,
  },
  toggle: {
    paddingBottom: theme.spacing.unit * 3,
  },
});

export default withDragContext(withStyles(styles)(CategorizeProvider));
