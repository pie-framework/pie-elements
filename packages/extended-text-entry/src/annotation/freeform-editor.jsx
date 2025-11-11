import React from 'react';
import PropTypes from 'prop-types';
import { Popover, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPopover = styled(Popover)(({ theme, annotationType }) => ({
  '& .MuiPaper-root': {
    overflowX: 'unset',
    overflowY: 'unset',
    marginLeft: '16px',
    '&::before': {
      position: 'absolute',
      right: '100%',
      top: '13px',
      border: 'solid transparent',
      content: '""',
      height: 0,
      width: 0,
      pointerEvents: 'none',
      borderWidth: '7px',
      borderRightColor: theme.palette.grey[100],
    },
    ...(annotationType === 'negative' && {
      '&::before': {
        borderRightColor: 'rgb(255, 204, 238) !important',
      },
    }),
    ...(annotationType === 'positive' && {
      '&::before': {
        borderRightColor: 'rgb(153, 255, 153) !important',
      },
    }),
  },
}));

const Wrapper = styled('div')(({ theme, annotationType }) => ({
  width: '200px',
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  border: `4px solid ${theme.palette.grey[100]}`,
  ...(annotationType === 'negative' && {
    borderColor: 'rgb(255, 204, 238) !important',
  }),
  ...(annotationType === 'positive' && {
    borderColor: 'rgb(153, 255, 153) !important',
  }),
}));

const Holder = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  borderTop: `2px solid ${theme.palette.grey[100]}`,
}));

const Button = styled('div')(({ theme, variant, annotationType }) => ({
  flexGrow: 1,
  width: '28%',
  textAlign: 'center',
  padding: '4px',
  cursor: 'pointer',
  '&:not(:nth-child(3n))': {
    borderRight: `1px solid ${theme.palette.grey[100]}`,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  ...(variant === 'positive' && {
    backgroundColor: 'rgb(153, 255, 153) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  }),
  ...(variant === 'negative' && {
    backgroundColor: 'rgb(255, 204, 238) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  }),
  ...(variant === 'typeChange' && annotationType === 'negative' && {
    '&:hover': {
      backgroundColor: 'rgb(153, 255, 153) !important',
    },
  }),
  ...(variant === 'typeChange' && annotationType === 'positive' && {
    '&:hover': {
      backgroundColor: 'rgb(255, 204, 238) !important',
    },
  }),
}));

class FreeformEditor extends React.Component {
  static propTypes = {
    anchorEl: PropTypes.object,
    open: PropTypes.bool,
    offset: PropTypes.number,
    value: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
    onTypeChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const { value: propsValue } = this.props;

    if (value !== propsValue) {
      this.setState({ value });
    }
  }

  onValueChange = (event) => this.setState({ value: event.target.value });

  handleSave = () => {
    const { value: oldValue, onSave, onClose, onDelete } = this.props;
    const { value } = this.state;

    if (value === '') {
      onDelete();
    }

    if (oldValue !== value) {
      onSave(oldValue, value);
    }

    this.setState({ value: '' });
    onClose();
  };

  handleTypeChange = () => {
    const { onTypeChange, onDelete } = this.props;
    const { value } = this.state;

    if (value === '') {
      onDelete();
    } else {
      onTypeChange(value);
    }

    this.setState({ value: '' });
  };

  render() {
    const { anchorEl, offset, onDelete, open, type } = this.props;
    const { value } = this.state;

    return (
      <StyledPopover
        anchorEl={anchorEl}
        elevation={2}
        open={open}
        onClose={this.handleSave}
        annotationType={type}
        style={{ marginTop: `${offset}px`, transition: 'margin-top 2s ease-out' }}
        transitionDuration={{ enter: 225, exit: 195 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Wrapper annotationType={type}>
          <TextField
            id="annotation-editor"
            style={{
              padding: '2px 5px',
              width: '95%',
            }}
            autoFocus
            multiline
            rows={1}
            maxRows={4}
            value={value}
            onChange={this.onValueChange}
            InputProps={{ disableUnderline: true }}
          />
          <Holder>
            <Button onClick={onDelete}>
              Delete
            </Button>
            <Button variant="typeChange" annotationType={type} onClick={this.handleTypeChange}>
              {type === 'negative' ? 'Green' : 'Pink'}
            </Button>
            <Button onClick={this.handleSave}>
              Save
            </Button>
          </Holder>
        </Wrapper>
      </StyledPopover>
    );
  }
}

export default FreeformEditor;
