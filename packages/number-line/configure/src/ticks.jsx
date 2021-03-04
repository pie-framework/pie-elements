import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MiniField } from './number-text-field';
import { tickUtils } from '@pie-element/number-line';
import * as math from 'mathjs';
export const Ticks = props => {
  const { classes, ticks, onChange, domain } = props;

  const changeMinor = (e, minor) => onChange({ ...props.ticks, minor });
  const changeMajor = (e, major) => onChange({ ...props.ticks, major });

  const t = tickUtils.normalizeTicks(domain, ticks);

  const minorLimits = tickUtils.minorLimits(domain);
  return (
    <React.Fragment>
      <MiniField
        label="Frequency"
        value={math.number(t.minor)}
        min={math.number(minorLimits.min)}
        max={math.number(minorLimits.max)}
        className={classes.nl}
        onChange={changeMinor}
      />
      <MiniField
        label="Labels"
        value={math.number(t.major)}
        className={classes.nl}
        onChange={changeMajor}
      />
    </React.Fragment>
  );
};
Ticks.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  ticks: PropTypes.shape({
    major: PropTypes.number,
    minor: PropTypes.number
  }),
  domain: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number })
};

const styles = () => ({});
export default withStyles(styles)(Ticks);
