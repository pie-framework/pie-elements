import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NumberTextFieldCustom } from '@pie-lib/pie-toolbox/config-ui';

const Size = (props) => {
  // Setting default value if not passed in configuration properties.
  const { classes, size = { width: 500 }, min = 150, max = 800, step = 20, onChange } = props;
  const changeWidth = (e, width) => onChange({ ...props.size, width });
  return (
    <div className={classes.flexRow}>
      <div className={classes.flexCol}>
        <label>Width (px)</label>
        <label className={classes.minMaxLabel}>
          Min {min}, Max {max}
        </label>
      </div>
      <NumberTextFieldCustom
        inputClassName={classes.numberTextField}
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
    alignItems: 'center',
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
  numberTextField: {
    cursor: 'default',
  },
});
export default withStyles(styles)(Size);
