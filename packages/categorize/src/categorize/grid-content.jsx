import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

export class GridContent extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    columns: PropTypes.number,
    rows: PropTypes.number,
    extraStyle: PropTypes.object,
  };
  static defaultProps = {
    columns: 2,
    rows: 2,
  };

  render() {
    const { className, children, columns, extraStyle, rows } = this.props;
    const style = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: rows === 2 ? 'auto 1fr' : `repeat(${rows}, auto)`,
      ...extraStyle,
    };

    return (
      <StyledDiv style={style} className={className}>
        {children}
      </StyledDiv>
    );
  }
}

const StyledDiv = styled('div')(({ theme }) => ({
  display: 'grid',
  columnGap: theme.spacing(1),
  gridColumnGap: theme.spacing(1),
  rowGap: theme.spacing(1),
  gridRowGap: theme.spacing(1),
  gridAutoRows: '1fr',
}));

export default GridContent;
