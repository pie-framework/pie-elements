import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

const CardBarContainer = styled('div')({
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

const CardBar = (props) => {
  const { header, children, mini, info } = props;

  return (
    <CardBarContainer>
      <FlexContainer>
        <Typography variant={mini ? 'subheading' : 'h5'}>{header}</Typography>
        {info}
      </FlexContainer>
      {children && (
        <Tooltip
          title={children}
          slotProps={{
            tooltip: {
              sx: (theme) => ({
                fontSize: theme.typography.fontSize - 2,
              }),
            },
          }}
        >
          <StyledIconButton aria-label="Delete" size="large">
            <HelpIcon />
          </StyledIconButton>
        </Tooltip>
      )}
    </CardBarContainer>
  );
};

CardBar.propTypes = {
  mini: PropTypes.bool,
  header: PropTypes.string,
  children: PropTypes.node,
  info: PropTypes.any,
};

export default CardBar;
