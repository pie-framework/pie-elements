import React from 'react';
import PropTypes from 'prop-types';
import ArrowHead from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const ArrowContainer = styled('div')({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
});

// A 1px rule joining a prompt to its answer: it is the connector, so it needs to
// stay perceivable on every scheme's surface.
const Line = styled('span')(({ isRight }) => ({
  backgroundColor: color.border(),
  bottom: isRight ? 20 : 19,
  content: '""',
  display: 'block',
  height: 1,
  left: 20,
  position: 'absolute',
  width: '100%',
}));

export class Arrow extends React.Component {
  static propTypes = {
    direction: PropTypes.string,
  };

  render() {
    const { direction } = this.props;

    const extraStyle =
      direction === 'left'
        ? {}
        : {
            transform: 'rotate(180deg)',
          };

    return (
      <ArrowContainer style={extraStyle}>
        <ArrowHead
          style={{
            transform: 'rotate(90deg)',
            // Pairs with Line above: head and shaft are one connector and have to
            // step together, or the arrow loses its point on a dark scheme.
            color: color.border(),
            fontSize: 40,
          }}
        />
        <Line isRight={direction !== 'left'} />
      </ArrowContainer>
    );
  }
}

export default Arrow;
