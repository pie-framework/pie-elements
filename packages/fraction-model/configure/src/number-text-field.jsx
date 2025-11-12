import { NumberTextField as NTF } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import cn from 'classnames';

const StyledNTF = styled(NTF)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const MiniStyledNTF = styled(NTF)({
  maxWidth: '120px',
  width: '120px',
  marginTop: '0',
  '& [class^="MuiInputBase-root"]': {
    height: 40,
    fontSize: '14px',
  },
});

export class NumberTextField extends React.Component {
  static propTypes = {};

  render() {
    const props = { ...this.props };
    return <StyledNTF {...props} variant="outlined" />;
  }
}

export const MiniField = React.forwardRef((props, ref) => (
  <MiniStyledNTF {...props} ref={ref} variant="outlined" />
));

export default NumberTextField;
