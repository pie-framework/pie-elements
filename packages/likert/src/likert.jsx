import React from 'react';
import PropTypes from 'prop-types';
import ChoiceInput from './choice-input';
import { styled } from '@mui/material/styles';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/render-ui';
import { LIKERT_ORIENTATION } from './likertEntities';

const Main = styled('div')({
  color: color.text(),
  backgroundColor: color.background(),
  '& *': {
    '-webkit-font-smoothing': 'antialiased',
  },
});

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Prompt = styled('div')(({ theme }) => ({
  verticalAlign: 'middle',
  color: 'var(--pie-primary-text, var(--pie-text, #000000))',
  paddingBottom: theme.spacing(2),
}));

const ChoicesWrapper = styled('div')({
  display: 'flex',
});

export class Likert extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    choices: PropTypes.array,
    prompt: PropTypes.string,
    teacherInstructions: PropTypes.string,
    session: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onSessionChange: PropTypes.func.isRequired,
    likertOrientation: PropTypes.string.isRequired,
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
      className,
      likertOrientation,
    } = this.props;

    const flexDirection = likertOrientation === LIKERT_ORIENTATION.vertical ? 'column' : 'row';

    return (
      <Main className={className}>
        {teacherInstructions && (
          <StyledCollapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </StyledCollapsible>
        )}

        {prompt && (
          <Prompt>
            <PreviewPrompt prompt={prompt} />
          </Prompt>
        )}

        <ChoicesWrapper style={{ flexDirection }}>
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
            />
          ))}
        </ChoicesWrapper>
      </Main>
    );
  }
}

Likert.defaultProps = {
  session: {
    value: [],
  },
};

export default Likert;
