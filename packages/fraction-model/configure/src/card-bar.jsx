import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const StyledCardBar = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const FlexContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledIconButton = styled(IconButton)({
  margin: 0,
  padding: 0,
});

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
  },
}));

const CardBar = (props) => {
  const { header, children, mini, info } = props;

  return (
    <StyledCardBar>
      <FlexContainer>
        <Typography variant={mini ? 'h6' : 'h5'}>{header}</Typography>
        {info}
      </FlexContainer>
      {children && (
        <StyledTooltip title={children}>
          <StyledIconButton aria-label="Delete" size="large">
            <HelpIcon />
          </StyledIconButton>
        </StyledTooltip>
      )}
    </StyledCardBar>
  );
};

CardBar.propTypes = {
  mini: PropTypes.bool,
  header: PropTypes.string,
  children: PropTypes.node,
  info: PropTypes.any,
};

export default CardBar;
