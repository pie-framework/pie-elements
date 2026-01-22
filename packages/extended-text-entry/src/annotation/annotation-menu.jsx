import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Popover } from '@mui/material';

const StyledPopover = styled(Popover)({
  '& .MuiPaper-root': {
    overflowX: 'unset',
    overflowY: 'unset',
    marginTop: '-16px',
    '&::after': {
      position: 'absolute',
      left: 'calc(50% - 7px)',
      border: 'solid transparent',
      content: '""',
      height: 0,
      width: 0,
      pointerEvents: 'none',
      borderWidth: '7px',
      borderTopColor: 'black',
    },
  },
});

const MainWrapper = styled('div')(({ theme }) => ({
  width: '300px',
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: theme.palette.common.white,
  border: `2px solid ${theme.palette.grey[100]}`,
}));

const AnnotationsWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});

const ControlsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  borderTop: `2px solid ${theme.palette.grey[100]}`,
}));

const Button = styled('div')(({ theme, variant }) => ({
  width: '22%',
  textAlign: 'center',
  padding: '4px',
  cursor: 'pointer',
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  '&:not(:nth-child(4n))': {
    borderRight: `1px solid ${theme.palette.grey[100]}`,
  },
  '&:nth-child(4n)': {
    flexGrow: 1,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  ...(variant === 'positive' && {
    backgroundColor: 'rgb(153, 255, 153) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  }),
  ...(variant === 'negative' && {
    backgroundColor: 'rgb(255, 204, 238) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  }),
}));

class AnnotationMenu extends React.Component {
  static propTypes = {
    anchorEl: PropTypes.object,
    open: PropTypes.bool,
    annotations: PropTypes.array,
    isNewAnnotation: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onWrite: PropTypes.func,
    onAnnotate: PropTypes.func,
  };

  render() {
    const { anchorEl, annotations, isNewAnnotation, onAnnotate, onClose, onEdit, onDelete, onWrite, open } =
      this.props;

    return (
      <StyledPopover
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        elevation={5}
        transitionDuration={{ enter: 225, exit: 195 }}
         anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MainWrapper>
          <AnnotationsWrapper>
            {annotations.map((annotation, index) => (
              <Button
                key={`annotation-${index}`}
                variant={annotation.type}
                onClick={() => onAnnotate(annotation)}
              >
                {annotation.label}
              </Button>
            ))}
          </AnnotationsWrapper>
          <ControlsWrapper>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button style={{ pointerEvents: 'none' }} />
            {isNewAnnotation ? (
              <React.Fragment>
                <Button variant="positive" onClick={() => onWrite('positive')}>
                  Write
                </Button>
                <Button variant="negative" onClick={() => onWrite('negative')}>
                  Write
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button onClick={onDelete}>
                  Delete
                </Button>
                <Button onClick={onEdit}>
                  Edit
                </Button>
              </React.Fragment>
            )}
          </ControlsWrapper>
        </MainWrapper>
      </StyledPopover>
    );
  }
}

export default AnnotationMenu;
