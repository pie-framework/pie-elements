import React from 'react';
import PropTypes from 'prop-types';
import DraggableCalculator from './draggable-calculator';
import CalculatorIcon from './calculator-icon';
import { styled } from '@mui/material/styles';

const StyledCalculatorIcon = styled(CalculatorIcon)(({ theme, active }) => ({
  transition: 'fill 200ms',
  cursor: 'pointer',
  verticalAlign: 'middle',
  fill: active ? theme.palette.common.black : theme.palette.grey[600],
  '&:hover': {
    fill: theme.palette.common.black,
  },
}));

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggleShow = () => this.setState({ show: !this.state.show });
  onClickClose = () => this.setState({ show: false });

  render() {
    const { show } = this.state;
    const { mode } = this.props.model;

    return (
      <div>
        <StyledCalculatorIcon
          active={show}
          onClick={() => this.onToggleShow()}
        />
        <DraggableCalculator mode={mode} show={show} onClose={this.onClickClose} />
      </div>
    );
  }
}

export default Main;
