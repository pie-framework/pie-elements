import { MiniField } from './number-text-field';
import PropTypes from 'prop-types';
import React from 'react';

const DOMAIN_BEGIN = 'domainBegin';
const DOMAIN_END = 'domainEnd';

const sort = domain => {
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
    const update = { ...this.props.domain, [key]: value };
    onChange(sort(update));
  }

  render() {
    const { domain } = this.props;

    return (
      <div>
        {/* <Typography>Domain</Typography> */}
        <MiniField
          label="Minimum"
          value={domain.min}
          name={DOMAIN_BEGIN}
          onChange={this.changeMin}
        />
        <MiniField
          label="Maximum"
          value={domain.max}
          name={DOMAIN_END}
          onChange={this.changeMax}
        />
      </div>
    );
  }
}
Domain.propTypes = {
  domain: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
  onChange: PropTypes.func.isRequired
};
export default Domain;
