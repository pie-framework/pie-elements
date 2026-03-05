import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Choice, { ChoiceType } from './choice';
import DroppablePlaceholder from './droppable-placeholder';
export { ChoiceType };

const Wrapper = styled('div')({
  flex: 1,
  touchAction: 'none',
});

const LabelHolder = styled('div')(({ theme }) => ({
  margin: '0 auto',
  textAlign: 'center',
  paddingTop: theme.spacing(1),
}));

export class Choices extends React.Component {
  static propTypes = {
    choices: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.shape(ChoiceType), PropTypes.shape({ empty: PropTypes.bool })]),
    ),
    model: PropTypes.shape({
      categoriesPerRow: PropTypes.number,
      choicesLabel: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    choicePosition: PropTypes.string,
    onDropChoice: PropTypes.func,
    onRemoveChoice: PropTypes.func,
  };

  static defaultProps = {
    model: {
      categoriesPerRow: 1,
      choicesLabel: '',
    },
  };

  render() {
    const { choices = [], model, disabled, onDropChoice, onRemoveChoice, choicePosition } = this.props;

    let style = {
      textAlign: 'center',
    };

    if (choicePosition === 'left') {
      style.direction = 'rtl';
    }

    return (
      <Wrapper>
        <DroppablePlaceholder
          id="choices-board"
          onDropChoice={onDropChoice}
          onRemoveChoice={onRemoveChoice}
          disabled={disabled}
          style={{ background: 'none' }}
          choiceBoard={true}
        >
          {model.choicesLabel && model.choicesLabel !== '' && (
            <LabelHolder dangerouslySetInnerHTML={{ __html: model.choicesLabel }} />
          )}
          {choices.map((c, index) => {
            return c.empty ? (
              <div key={index} />
            ) : (
              <Choice
                disabled={disabled}
                key={index}
                extraStyle={{ maxWidth: `${95 / model.categoriesPerRow}%` }}
                {...c}
              />
            );
          })}
        </DroppablePlaceholder>
      </Wrapper>
    );
  }
}

export default Choices;
