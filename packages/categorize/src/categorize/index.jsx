import React from 'react';
import PropTypes from 'prop-types';
import Choices from './choices';
import Categories from './categories';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { withStyles } from '@material-ui/core/styles';
import {
  buildState,
  removeChoiceFromCategory,
  moveChoiceToCategory
} from '@pie-lib/categorize';
import { withDragContext, uid } from '@pie-lib/drag';
import { color, Feedback, Collapsible, hasText } from '@pie-lib/render-ui';
import debug from 'debug';

const log = debug('@pie-ui:categorize');

const removeHTMLTags = html => {
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
          category: PropTypes.string
        })
      )
    }),
    onAnswersChange: PropTypes.func.isRequired,
    onShowCorrectToggle: PropTypes.func.isRequired
  };

  static defaultProps = {
    disabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showCorrect: false
    };
  }

  dropChoice = (categoryId, draggedChoice) => {
    const { session, onAnswersChange } = this.props;
    log(
      '[dropChoice] category: ',
      draggedChoice.categoryId,
      'choice: ',
      draggedChoice
    );

    const answers = moveChoiceToCategory(
      draggedChoice.id,
      draggedChoice.categoryId,
      categoryId,
      draggedChoice.choiceIndex,
      session.answers
    );

    onAnswersChange(answers);
  };

  removeChoice = c => {
    log('[removeChoice]: ', c);
    const { onAnswersChange, session } = this.props;
    const answers = removeChoiceFromCategory(
      c.id,
      c.categoryId,
      c.choiceIndex,
      session.answers
    );
    onAnswersChange(answers);
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

  render() {
    const { classes, model, session } = this.props;
    const { showCorrect } = this.state;
    const { choicesPosition, note, showNote, env } = model;
    const { mode, role } = env || {};
    const choicePosition = choicesPosition || 'above';

    const style = {
      flexDirection: this.getPositionDirection(choicePosition)
    };

    const { categories, choices, correct } = buildState(
      model.categories,
      model.choices,
      showCorrect ? model.correctResponse : session.answers,
      model.correctResponse
    );

    log('[render] disabled: ', model.disabled);

    const { rowLabels } = model;

    return (
      <div className={classes.mainContainer}>
        {
          model.teacherInstructions && hasText(model.teacherInstructions) && (
            <Collapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              className={classes.collapsible}
            >
              <div dangerouslySetInnerHTML={{ __html: model.teacherInstructions }}/>
            </Collapsible>
          )
        }
        <br />
        <CorrectAnswerToggle
          show={showCorrect || correct === false}
          toggled={showCorrect}
          onToggle={this.toggleShowCorrect}
        />
        {
          removeHTMLTags(model.prompt) &&
          <div
            className={classes.prompt}
            dangerouslySetInnerHTML={{ __html: model.prompt }}
          />
        }
        <div className={classes.categorize} style={style}>
          <div style={{ display: 'flex' }}>
            {
              rowLabels && (
                <div style={{ display: 'grid', marginRight: '20px' }}>
                  {rowLabels.map((label, index) => (
                    <div
                      key={index}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: label
                      }}
                    />
                  ))}
                </div>
              )
            }
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
          />
        </div>
        {(showCorrect || mode === 'view' && role === 'instructor') && showNote && note && (
          <div
            className={classes.note}
            dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }}
          />
        )}
        {
          model.rationale && hasText(model.rationale) && (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
              className={classes.collapsible}
            >
              <div dangerouslySetInnerHTML={{ __html: model.rationale }}/>
            </Collapsible>
          )
        }
        {
          model.correctness &&
          model.feedback &&
          !showCorrect && (
            <Feedback
              correctness={model.correctness}
              feedback={model.feedback}
            />
          )
        }
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
        <Categorize { ...this.props } />
      </uid.Provider>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background()
  },
  prompt: {
    marginBottom: '35px',
    verticalAlign: 'middle'
  },
  note: {
    padding: '5px 0'
  },
  categorize: {
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column'
  },
  collapsible: {
    paddingBottom: theme.spacing.unit * 2
  }
});
export default withDragContext(withStyles(styles)(CategorizeProvider));
