import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { InlineDropdown as DropDown } from '@pie-lib/mask-markup';
import {color, Collapsible, hasText, PreviewPrompt} from '@pie-lib/render-ui';
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
    rationale: PropTypes.string,
    teacherInstructions: PropTypes.string,
    choices: PropTypes.object,
    value: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: {}
  };

  state = {
    showCorrectAnswer: false
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
    const { classes, prompt, mode, rationale, teacherInstructions, choices } = this.props;
    const showCorrectAnswerToggle = mode === 'evaluate';
    let choiceRationalesHaveText = false;

    const choiceRationales = (Object.keys(choices) || []).map(key => (choices[key] || [])
      .reduce((acc, currentValue) => {
        if (currentValue.rationale && hasText(currentValue.rationale)) {
          choiceRationalesHaveText = true;

          acc.push(currentValue);
        }
        return acc;
      }, []));

    return (
      <div className={classes.mainContainer}>
        {
          teacherInstructions && hasText(teacherInstructions) && (
            <React.Fragment>
              <Collapsible
                labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              >
                <PreviewPrompt prompt={teacherInstructions} />
              </Collapsible>
              <br />
            </React.Fragment>
          )
        }

        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        {showCorrectAnswerToggle && <br />}

        {prompt && (
          <React.Fragment>
            <PreviewPrompt prompt={prompt} />
            <br />
          </React.Fragment>
        )}
        <DropDown
          {...this.props}
          showCorrectAnswer={showCorrectAnswer}
        />
        {rationale && hasText(rationale) && (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
            >
              <PreviewPrompt prompt={rationale} />
            </Collapsible>
        )}
        {choiceRationalesHaveText && (
          <React.Fragment>
            <br />
            <Collapsible labels={{hidden: 'Show Rationale for choices', visible: 'Hide Rationale for choices'}}>
              <div>
                {choiceRationales.map((choices, index) =>
                  <div key={index}>
                    {choices && choices.length > 0 && choices.map( choice =>
                      <div className={classes.choiceRationale} key={choice.label}>
                        <div
                          className={classNames(classes.choiceRationaleLabel, choice.correct ? 'correct' : 'incorrect')}
                          dangerouslySetInnerHTML={{ __html: `${choice.label}: ` }}
                        />
                        <PreviewPrompt prompt={choice.rationale} />
                      </div>
                    )}
                    {choices && choices.length > 0 && <br />}
                  </div>
                )}
              </div>
            </Collapsible>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
    padding: theme.spacing.unit
  },
  choiceRationale: {
    display: 'flex',
    whiteSpace: 'break-spaces'
  },
  choiceRationaleLabel: {
    display: 'flex',
    '&.correct': {
      color: color.correct()
    },
    '&.incorrect': {
      color: color.incorrect()
    }
  }
});

export default withStyles(styles)(InlineDropdown);
