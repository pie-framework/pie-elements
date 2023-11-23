import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MiniField } from './number-text-field-custom';

const Size = (props) => {
  const { classes, size, min, max, step, onChange } = props;
  const changeWidth = (e, width) => onChange({ ...props.size, width });
  return (
    <div className={classes.flexRow}>
      <div className={classes.flexCol}>
        <label>Width (px)</label>
        <label className={classes.minMaxLabel}>
          Min {min}, Max {max}
        </label>
      </div>
      <MiniField
        value={size.width}
        min={min}
        max={max}
        step={step}
        onlyIntegersAllowed={true}
        onChange={changeWidth}
        variant={'outlined'}
      />
    </div>
  );
};

Size.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const styles = () => ({
  class: {},
  flexRow: {
    display: 'flex',
    'align-items': 'center',
    gap: '10px',
  },
  flexCol: {
    display: 'flex',
    'flex-flow': 'column',
  },
  minMaxLabel: {
    'font-size': 'small',
    color: 'gray',
  },
});
export default withStyles(styles)(Size);
