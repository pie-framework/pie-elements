import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NumberTextField, { MiniField } from './number-text-field';

const Size = props => {
  const { size, onChange } = props;

  const changeWidth = (e, width) => onChange({ ...props.size, width });

  return <MiniField label="Width" value={size.width} onChange={changeWidth} />;
};

Size.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  onChange: PropTypes.func.isRequired
};

const styles = theme => ({
  class: {}
});
export default withStyles(styles)(Size);
