import React from 'react';
import { NumberTextField as NTF } from '@pie-lib/config-ui';
import { styled } from '@mui/material/styles';

const StyledNumberTextField = styled(NTF)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const MiniField = styled(NTF)({
  maxWidth: '100px',
});

const NumberTextField = (props) => {
  return <StyledNumberTextField {...props} variant="outlined" />;
};

export { MiniField };
export default NumberTextField;
