import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Panel from './panel';
import { NumberTextField } from '@pie-lib/config-ui';
import grey from '@material-ui/core/colors/grey';
import Chip from '@material-ui/core/Chip';
import debug from 'debug';
const log = debug('@pie-element:categorize:configure:weighting');
import Grid, { Cell } from './grid';

const Percent = ({ percent, className }) => (
  <Chip classes={{ root: className }} label={`${percent}%`} />
);

Percent.propTypes = {
  percent: PropTypes.string.isRequired,
  className: PropTypes.string
};

const cell = () => ({
  alignSelf: 'center',
  borderBottom: `solid 1px ${grey[300]}`
});

const Rule = withStyles(() => ({
  label: cell(),
  number: cell(),
  percent: cell()
}))(({ classes, rule, onChange, percent, disabled }) => {
  const changeRule = (event, number) => {
    rule.points = number;
    onChange(rule);
  };
  return (
    <React.Fragment>
      <Cell html={rule.label} />
      <Cell>
        <NumberTextField
          disabled={disabled}
          className={classes.number}
          min={0}
          max={20}
          value={rule.points}
          suffix={rule.points === 1 ? 'pt' : 'pts'}
          onChange={changeRule}
        />
      </Cell>
      <Cell>
        <Percent className={classes.percent} percent={percent} />
      </Cell>
    </React.Fragment>
  );
});

const build = (rules, categories) => {
  return categories.map(c => {
    const rule = rules.find(r => r.category === c.id) || { points: 1 };
    return {
      label: c.label,
      category: c.id,
      points: rule.points
    };
  });
};

export class Weighting extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    weighting: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    categories: PropTypes.array
  };
  static defaultProps = {};

  toggleEnabled = () => {
    const { weighting, onChange } = this.props;
    weighting.enabled = !weighting.enabled;
    onChange(weighting);
  };

  changeRule = rule => {
    const { weighting, onChange } = this.props;

    const index = weighting.rules.findIndex(r => r.category === rule.category);
    const r = { category: rule.category, points: rule.points };
    if (index === -1) {
      weighting.rules.push(r);
    } else {
      weighting.rules.splice(index, 1, r);
    }

    log('[changeRule]: ', weighting);

    onChange(weighting);
  };

  getPercent = (rule, rules) => {
    const total = rules.reduce((sum, r) => sum + r.points, 0);
    const rawPercent = rule.points / total * 100;
    return rawPercent.toFixed(0);
  };

  render() {
    const { weighting, categories } = this.props;

    const rules = build(weighting.rules, categories);
    return (
      <Panel
        title="Weighting"
        enabled={weighting.enabled}
        onToggleEnabled={this.toggleEnabled}
      >
        <Grid headings={['Category', 'Points', '']} size={'1fr 70px 70px'}>
          {rules.map((r, index) => (
            <Rule
              rule={r}
              disabled={!weighting.enabled}
              percent={this.getPercent(r, rules)}
              onChange={this.changeRule}
              key={index}
            />
          ))}
        </Grid>
      </Panel>
    );
  }
}
const styles = () => ({
  weighting: {},
  ruleHolder: {
    display: 'grid',
    backgroundColor: 'red',
    gridTemplateColumns: '1fr 70px 70px',
    gridRowGap: '1px',
    gridColumnGap: 0
  }
});
export default withStyles(styles)(Weighting);
