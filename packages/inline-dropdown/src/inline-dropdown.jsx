import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { InlineDropdown as DropDown } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

export class InlineDropdown extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    prompt: PropTypes.string,
    disabled: PropTypes.bool,
    markup: PropTypes.string,
    mode: PropTypes.string,
    displayType: PropTypes.string,
    rationale: PropTypes.string,
    teacherInstructions: PropTypes.string,
    model: PropTypes.object.isRequired,
    choices: PropTypes.object,
    value: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func,
    language: PropTypes.string,
  };

  static defaultProps = {
    value: {},
  };

  state = {
    showCorrectAnswer: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.feedback)) {
      this.setState({ showCorrectAnswer: false });
    }
  }

  componentDidUpdate() {
    // eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { classes, prompt, mode, model, rationale, teacherInstructions, choices, displayType, language } = this.props;
    const { extraCSSRules } = model || {};
    const showCorrectAnswerToggle = mode === 'evaluate';
    let choiceRationalesHaveText = false;
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    const choiceRationales = (Object.keys(choices) || []).map((key) =>
      (choices[key] || []).reduce((acc, currentValue) => {
        if (currentValue.rationale && hasText(currentValue.rationale)) {
          choiceRationalesHaveText = true;

          acc.push(currentValue);
        }

        return acc;
      }, []),
    );

    return (
      <UiLayout extraCSSRules={{
        names: ['red', 'blue'],
        rules: `
      .red {
        color: red !important;
      }

      .blue {
        color: blue !important;
      }
    `,
      }} className={classes.mainContainer} style={{ display: `${displayType}` }}>
        {mode === 'gather' && <h2 className={classes.srOnly}>Inline Dropdown Question</h2>}

        {showTeacherInstructions && (
          <Collapsible
            className={classes.collapsible}
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </Collapsible>
        )}

        {prompt && <PreviewPrompt prompt={prompt} />}

        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
          language={language}
        />

        <DropDown {...this.props} showCorrectAnswer={showCorrectAnswer} />

        {choiceRationalesHaveText && (
          <Collapsible
            className={classes.collapsible}
            labels={{ hidden: 'Show Rationale for choices', visible: 'Hide Rationale for choices' }}
          >
            {choiceRationales.map((choices, index) => (
              <div key={index} className={classes.choiceRationaleWrapper}>
                {choices?.length > 0 &&
                  choices.map((choice) => (
                    <div className={classes.choiceRationale} key={choice.label}>
                      <div
                        className={classNames(classes.choiceRationaleLabel, choice.correct ? 'correct' : 'incorrect')}
                        dangerouslySetInnerHTML={{ __html: `${choice.label}: ` }}
                      />
                      <PreviewPrompt prompt={choice.rationale} />
                    </div>
                  ))}
              </div>
            ))}
          </Collapsible>
        )}

        {showRationale && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
      </UiLayout>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  choiceRationaleWrapper: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing.unit * 2,
    },
  },
  choiceRationale: {
    display: 'flex',
    whiteSpace: 'break-spaces',
  },
  choiceRationaleLabel: {
    display: 'flex',
    '&.correct': {
      color: color.correct(),
    },
    '&.incorrect': {
      color: color.incorrectWithIcon(),
    },
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
});

export default withStyles(styles)(InlineDropdown);
