import React from 'react';
import { Protractor } from '@pie-lib/tools';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Toggle from './toggle';

const StyledProtractor = styled(Protractor)({
  position: 'absolute',
  left: '200px',
  zIndex: '101',
});

class Main extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggle = () => this.setState({ show: !this.state.show });

  render() {
    const { show } = this.state;

    return (
      <div>
        <Toggle active={show} onToggle={this.onToggle} />

        {show && <StyledProtractor startPosition={{ left: 100, top: 100 }} />}
      </div>
    );
  }
}

export default Main;
