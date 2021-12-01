import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Popover, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  wrapper: {
    width: '200px',
    overflow: 'hidden',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    border: '4px solid #d3d3d3',
    '&.negative': {
      borderColor: 'rgb(255, 204, 238) !important'
    },
    '&.positive': {
      borderColor: 'rgb(153, 255, 153) !important'
    }
  },
  holder: {
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: '2px solid #d3d3d3'
  },
  positive: {
    backgroundColor: 'rgb(153, 255, 153) !important',
    '&:hover': {
      filter: 'brightness(85%)'
    }
  },
  negative: {
    backgroundColor: 'rgb(255, 204, 238) !important',
    '&:hover': {
      filter: 'brightness(85%)'
    }
  },
  button: {
    flexGrow: 1,
    width: '28%',
    textAlign: 'center',
    padding: '4px',
    cursor: 'pointer',
    '&:not(:nth-child(3n))': {
      borderRight: '1px solid #d3d3d3',
    },
    '&:hover': {
      backgroundColor: '#d3d3d3'
    },
    '&.negative:hover': {
      backgroundColor: 'rgb(153, 255, 153) !important',
    },
    '&.positive:hover': {
      backgroundColor: 'rgb(255, 204, 238) !important',
    }
  },
  arrow: {
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
      borderRightColor: '#d3d3d3'
    },
    '&.negative::before': {
      borderRightColor: 'rgb(255, 204, 238) !important'
    },
    '&.positive::before': {
      borderRightColor: 'rgb(153, 255, 153) !important'
    }
  }
};

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
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const { value: propsValue } = this.props;

    if (value !== propsValue) {
      this.setState({ value });
    }
  };

  onValueChange = event => this.setState({ value: event.target.value });

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
    const { anchorEl, classes, offset, onDelete, open, type } = this.props;
    const { value } = this.state;

    return (
      <Popover
        anchorEl={anchorEl}
        elevation={2}
        open={open}
        onClose={this.handleSave}
        classes={{ paper: classNames(classes.arrow, type) }}
        style={{ marginTop: `${offset}px`, transition: 'margin-top 2s ease-out' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={classNames(classes.wrapper, type)}>
          <TextField
            id="annotation-editor"
            style={{
              padding: '2px 5px',
              width: '95%'
            }}
            autoFocus
            multiline
            rows={1}
            rowsMax={4}
            value={value}
            onChange={this.onValueChange}
            InputProps={{ disableUnderline: true }}
          />
          <div className={classes.holder}>
            <div className={classes.button} onClick={onDelete}>
              Delete
            </div>
            <div className={classNames(classes.button, type)} onClick={this.handleTypeChange} >
              { type === 'negative' ? 'Green' : 'Pink' }
            </div>
            <div className={classes.button} onClick={this.handleSave} >
              Save
            </div>
          </div>
        </div>
      </Popover>
    );
  }
};

export default withStyles(styles)(FreeformEditor);
