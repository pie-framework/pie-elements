import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Choice from './choice';
import PlaceHolder from './droppable-placeholder';

export const CategoryType = {
  id: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
};

export class Category extends React.Component {
  static propTypes = {
    ...CategoryType,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onDropChoice: PropTypes.func,
    onRemoveChoice: PropTypes.func,
    minRowHeight: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    const {
      className,
      choices = [],
      disabled,
      onDropChoice,
      onRemoveChoice,
      id,
      correct,
      minRowHeight,
    } = this.props;

    return (
      <StyledDiv className={className} id={id}>
        <PlaceHolder
          id={id}
          onDropChoice={onDropChoice}
          disabled={disabled}
          correct={correct}
          minRowHeight={minRowHeight}
        >
          {choices.map((c, index) => (
            <Choice
              onRemoveChoice={onRemoveChoice}
              disabled={disabled}
              key={index}
              choiceIndex={index}
              categoryId={id}
              {...c}
            />
          ))}
        </PlaceHolder>
      </StyledDiv>
    );
  }
}

const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 2,
}));

export default Category;
