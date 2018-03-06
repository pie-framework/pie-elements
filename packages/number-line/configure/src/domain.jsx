import { NumberTextField } from '@pie-libs/config-ui';
import PropTypes from 'prop-types';
import React from 'react';

const DOMAIN_BEGIN = 'domainBegin';
const DOMAIN_END = 'domainEnd';

export class Domain extends React.Component {


  constructor(props) {
    super(props);
    this.onDomainBeginChange = this.onDomainValueChange.bind(this, DOMAIN_BEGIN);
    this.onDomainEndChange = this.onDomainValueChange.bind(this, DOMAIN_END);
  }

  onDomainValueChange(key, event, value) {
    const { onChange, domain } = this.props;

    const d = [domain[0], domain[1]];

    if (value === undefined) {
      return;
    }

    let newValue = parseInt(value, 10);
    if (key === DOMAIN_BEGIN) {
      d[0] = newValue;
    } else {
      d[1] = newValue;
    }
    //Make sure that d[0] < d[1]
    const sorted = d.sort();
    const out = d[0] > d[1] ? [d[1], d[0]] : d;
    onChange(out);
  }

  render() {
    const { domain } = this.props;

    return <div>
      Domain =
          <NumberTextField
        value={domain[0]}
        name={DOMAIN_BEGIN}
        onChange={this.onDomainBeginChange} /> to
          <NumberTextField
        value={domain[1]}
        name={DOMAIN_END}
        onChange={this.onDomainEndChange} />
    </div>;
  }
}

Domain.propTypes = {
  domain: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired
}

export default Domain;