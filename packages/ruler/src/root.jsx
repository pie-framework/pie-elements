import React from 'react';
import { Ruler } from '@pie-lib/tools';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Toggle from './toggle';

const StyledRuler = styled(Ruler)({
  position: 'absolute',
  left: '200px',
  zIndex: '101',
});

export class Root extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggle = () => this.setState({ show: !this.state.show });

  render() {
    const { show } = this.state;
    const { model } = this.props;

    return (
      <div>
        <Toggle active={show} onToggle={this.onToggle} />

        {show && (
          <StyledRuler
            measure={model.measure}
            units={model.units}
            width={model.width}
            label={model.label}
            startPosition={{ left: 100, top: 100 }}
            tickCount={model.imperialTicks}
          />
        )}
      </div>
    );
  }
}

export default Root;
