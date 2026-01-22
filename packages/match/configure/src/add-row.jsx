import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AddButton from '@mui/icons-material/Add';

const StyledButton = styled(Button)({
  display: 'flex',
  alignSelf: 'flex-start',
  margin: 0,
});

const StyledAddButton = styled(AddButton)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
}));

export class AddRowButton extends React.Component {
  static propTypes = {
    onAddClick: PropTypes.func.isRequired,
  };

  render() {
    const { onAddClick } = this.props;

    return (
      <StyledButton disabled={false} onClick={onAddClick}>
        <StyledAddButton />
        Add Another Row
      </StyledButton>
    );
  }
}

export default AddRowButton;
