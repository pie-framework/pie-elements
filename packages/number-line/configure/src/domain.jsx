import { MiniField } from './number-text-field';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from '@mui/styles/withStyles';

const DOMAIN_BEGIN = 'domainBegin';
const DOMAIN_END = 'domainEnd';

const sort = (domain) => {
  if (domain.min <= domain.max) {
    return domain;
  }
  return { min: domain.max, max: domain.min };
};

export class Domain extends React.Component {
  constructor(props) {
    super(props);

    this.changeMin = this.change.bind(this, 'min');
    this.changeMax = this.change.bind(this, 'max');
  }

  change(key, event, value) {
    const { onChange } = this.props;
    let update;
    //Added condition when min and max is same, then it should not update the value
    if ((key === 'min' && value === this.props.domain.max) || (key === 'max' && value === this.props.domain.min)) {
      update = { ...this.props.domain };
    } else {
      update = { ...this.props.domain, [key]: value };
    }
    onChange(sort(update));
  }

  render() {
    const { classes, domain } = this.props;

    return (
      <div className={classes.displayFlex}>
        <div className={classes.flexRow}>
          <label>Min Value</label>
          <MiniField min={-100000} max={99999} value={domain.min} name={DOMAIN_BEGIN} onChange={this.changeMin} />
        </div>
        <div className={classes.flexRow}>
          <label>Max Value</label>
          <MiniField min={-99999} max={100000} value={domain.max} name={DOMAIN_END} onChange={this.changeMax} />
        </div>
      </div>
    );
  }
}
Domain.propTypes = {
  classes: PropTypes.object.isRequired,
  domain: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
  onChange: PropTypes.func.isRequired,
};
const styles = (theme) => ({
  displayFlex: {
    display: 'flex',
    gap: '20px',
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
});
export default withStyles(styles)(Domain);
