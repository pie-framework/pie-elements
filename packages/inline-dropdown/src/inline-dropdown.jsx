import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { InlineDropdown as DropDown } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';

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
    const { classes, prompt, mode, rationale, teacherInstructions } = this.props;

    return (
      <div className={classes.mainContainer}>
        {
          teacherInstructions && hasText(teacherInstructions) && (
            <Collapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
            </Collapsible>
          )
        }

        <CorrectAnswerToggle
          show={mode === 'evaluate'}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        <br />
        {prompt && <div dangerouslySetInnerHTML={{ __html: prompt }}/>}
        <br />
        {
          rationale && hasText(rationale) && (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
            >
              <div dangerouslySetInnerHTML={{ __html: rationale }}/>
            </Collapsible>
          )
        }
        <DropDown
          {...this.props}
          showCorrectAnswer={showCorrectAnswer}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
    padding: theme.spacing.unit
  }
});

export default withStyles(styles)(InlineDropdown);
