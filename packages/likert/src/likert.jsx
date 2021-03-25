import React from 'react';
import PropTypes from 'prop-types';
import ChoiceInput from './choice-input';
import { withStyles } from '@material-ui/core/styles';
import { Collapsible } from '@pie-lib/render-ui';
import { LIKERT_ORIENTATION } from './likertEntities';

const styles = {
  corespringChoice: {
    '& *': {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      '-webkit-font-smoothing': 'antialiased',
    },
  },
  prompt: {
    verticalAlign: 'middle',
    color: 'var(--pie-primary-text, var(--pie-text, #000000))',
    paddingBottom: '20px',
  },
  choicesWrapper: {
    display: 'flex',
  },
};

export class Likert extends React.Component {
  static propTypes = {
    choices: PropTypes.array,
    prompt: PropTypes.string,
    teacherInstructions: PropTypes.string,
    session: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onSessionChange: PropTypes.func.isRequired,
    likertOrientation: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  };

  UNSAFE_componentWillReceiveProps() {}

  isSelected(value) {
    return this.props.session && this.props.session.value === value;
  }

  render() {
    const {
      disabled,
      choices = [],
      prompt,
      onSessionChange,
      teacherInstructions,
      classes,
      likertOrientation,
    } = this.props;

    const flexDirection =
      likertOrientation === LIKERT_ORIENTATION.vertical ? 'column' : 'row';

    return (
      <div className={classes.corespringChoice}>
        {teacherInstructions && (
          <Collapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
          </Collapsible>
        )}
        <br />
        <br />
        <div
          className={classes.prompt}
          dangerouslySetInnerHTML={{ __html: prompt }}
        />
        <div className={classes.choicesWrapper} style={{ flexDirection }}>
          {choices.map((choice, index) => (
            <ChoiceInput
              key={`choice-${index}`}
              label={choice.label}
              value={choice.value}
              index={index}
              disabled={disabled}
              onChange={onSessionChange}
              likertOrientation={likertOrientation}
              checked={this.isSelected(choice.value)}
            ></ChoiceInput>
          ))}
        </div>
      </div>
    );
  }
}

Likert.defaultProps = {
  session: {
    value: [],
  },
};

export default withStyles(styles)(Likert);
