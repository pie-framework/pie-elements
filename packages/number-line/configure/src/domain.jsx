import { MiniField } from './number-text-field';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';

const DOMAIN_BEGIN = 'domainBegin';
const DOMAIN_END = 'domainEnd';

const DisplayFlex = styled('div')({
  display: 'flex',
  gap: '20px',
});

const FlexRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

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
    const { domain } = this.props;

    return (
      <DisplayFlex>
        <FlexRow>
          <label>Min Value</label>
          <MiniField min={-100000} max={99999} value={domain.min} name={DOMAIN_BEGIN} onChange={this.changeMin} />
        </FlexRow>
        <FlexRow>
          <label>Max Value</label>
          <MiniField min={-99999} max={100000} value={domain.max} name={DOMAIN_END} onChange={this.changeMax} />
        </FlexRow>
      </DisplayFlex>
    );
  }
}
Domain.propTypes = {
  domain: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
  onChange: PropTypes.func.isRequired,
};

export default Domain;
