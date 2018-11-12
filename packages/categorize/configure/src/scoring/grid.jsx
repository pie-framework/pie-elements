import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

export const Cell = withStyles(theme => ({
  cell: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderBottom: `solid 1px ${grey[300]}`,
    display: 'flex',
    alignItems: 'center'
  }
}))(
  ({ classes, children, html }) =>
    html ? (
      <div
        className={classes.cell}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : (
      <div className={classes.cell}>{children}</div>
    )
);

Cell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  html: PropTypes.string
};
export const Heading = withStyles(theme => ({
  heading: {
    fontWeight: 'bold',
    paddingBottom: 0,
    marginBottom: theme.spacing.unit
  }
}))(({ classes, children }) => (
  <Cell>
    <div className={classes.heading}>{children}</div>
  </Cell>
));

export class Grid extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    headings: PropTypes.arrayOf(PropTypes.string),
    size: PropTypes.string
  };

  static defaultProps = {};
  render() {
    const { classes, className, children, headings, size } = this.props;
    const length = Array.isArray(headings) ? headings.length : 1;
    const columns = size ? size : `repeat(${length}, 1fr)`;
    const style = {
      gridTemplateColumns: columns
    };

    return (
      <div style={style} className={classNames(classes.grid, className)}>
        {headings.map((h, index) => <Heading key={index}>{h}</Heading>)}
        {children}
      </div>
    );
  }
}
const styles = () => ({
  grid: {
    display: 'grid',
    backgroundColor: 'red',
    gridRowGap: '1px',
    gridColumnGap: 0
  }
});
export default withStyles(styles)(Grid);
