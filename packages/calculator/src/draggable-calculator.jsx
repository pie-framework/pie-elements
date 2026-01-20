import React from 'react';
import Calculator from '@pie-framework/material-ui-calculator';
import Draggable from 'react-draggable';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const CalculatorContainer = styled('div')(({ theme, mode }) => {
  const {
    palette: { grey },
  } = theme;

  const border = `solid 1px var(--pie-ui, ${grey[900]})`;

  return {
    display: 'inline-block',
    border,
    zIndex: '10',
    ...(mode === 'scientific' && {
      minWidth: '515px',
    }),
  };
});

const TitleBar = styled('div')(({ theme }) => {
  const {
    palette: { primary },
  } = theme;

  const border = `solid 1px var(--pie-ui, ${theme.palette.grey[900]})`;

  return {
    cursor: 'move',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: primary.light,
    borderBottom: border,
  };
});

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    width: '24px',
    height: '24px',
    color: theme.palette.common.white,
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  flex: 1,
}));

class BaseLayout extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['basic', 'scientific']),
  };

  render() {
    const { onClose, mode } = this.props;

    return (
      <CalculatorContainer mode={mode}>
        <TitleBar className="handle">
          <Title variant="h6">
            Calculator
          </Title>
          <CloseIconButton
            onClick={onClose}
            aria-label="Delete"
            size="large">
            <Close />
          </CloseIconButton>
        </TitleBar>
        <Calculator mode={mode} />
      </CalculatorContainer>
    );
  }
}

export const CalculatorLayout = BaseLayout;

const DraggableContainer = styled('div')({
  position: 'absolute',
});

export class DraggableCalculator extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['basic', 'scientific']),
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deltaPosition: {
        x: 0,
        y: 0,
      },
    };
  }

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;

    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  render() {
    const { mode, show, onClose } = this.props;
    const { x, y } = this.state.deltaPosition;

    return show ? (
      <Draggable onDrag={this.handleDrag} defaultPosition={{ x, y }} handle=".handle">
        {/* draggable needs to have a div as the first child so it can find the classname. */}
        <DraggableContainer>
          <CalculatorLayout onClose={onClose} mode={mode} />
        </DraggableContainer>
      </Draggable>
    ) : null;
  }
}

export default DraggableCalculator;
