import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AddButton } from './buttons';

const HeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const TitleContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

export class Header extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    buttonLabel: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    info: PropTypes.any,
    buttonDisabled: PropTypes.bool,
    variant: PropTypes.string,
    tooltip: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    const { className, onAdd, label, buttonLabel, info, buttonDisabled, variant, tooltip } = this.props;
    return (
      <HeaderContainer className={className}>
        <TitleContainer>
          <Typography variant={variant || 'title'}>
            {label}
          </Typography>
          {info}
        </TitleContainer>
        <StyledTooltip
            title={tooltip || ''}
            enterTouchDelay={50} // Appear quickly after a touch
            leaveTouchDelay={3000} // Stay visible for 3 seconds
        >
          <span>
            <AddButton onClick={onAdd} label={buttonLabel} disabled={buttonDisabled} />
          </span>
        </StyledTooltip>
      </HeaderContainer>
    );
  }
}

export default Header;
