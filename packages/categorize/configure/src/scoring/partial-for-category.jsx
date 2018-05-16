import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';
import { NumberTextField } from '@pie-lib/config-ui';
import { AddButton } from '../design/buttons';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';

const Empty = withStyles(theme => ({
  empty: {
    padding: theme.spacing.unit,
    color: grey[500]
  }
}))(({ classes }) => <div className={classes.empty}>n/a</div>);

const Rule = withStyles(theme => ({
  rule: {
    display: 'flex',
    alignItems: 'center'
  },
  number: {
    width: '60px',
    margin: 0,
    padding: 0
  },
  small: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    flex: '1',
    fontSize: '12px'
  },
  icon: {
    width: '18px',
    height: '18px'
  },
  delete: {
    width: '24px',
    height: '24px'
  }
}))(({ rule, classes, onDelete, onChange }) => {
  const changePercent = (event, number) => {
    rule.percent = number;
    onChange(rule);
  };
  return (
    <div className={classes.rule}>
      <NumberTextField
        className={classes.number}
        min={1}
        max={100}
        value={rule.percent}
        suffix="%"
        onChange={changePercent}
      />
      <span className={classes.small}>
        for {rule.count} correct answer{rule.count > 1 ? 's' : ''}
      </span>
      <IconButton className={classes.delete} onClick={onDelete}>
        <Cancel className={classes.icon} />
      </IconButton>
    </div>
  );
});

const Box = withStyles(theme => ({
  box: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  addButton: {
    marginTop: theme.spacing.unit
  }
}))(({ classes, rules, canAdd, onDeleteRule, onAddRule, onChange }) => (
  <div className={classes.box}>
    {rules.map((r, index) => (
      <Rule
        rule={r}
        key={index}
        onChange={onChange}
        onDelete={() => onDeleteRule(r)}
      />
    ))}
    <AddButton
      disabled={!canAdd}
      className={classes.addButton}
      mini
      onClick={onAddRule}
    />
  </div>
));

export class PartialForCategory extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    category: PropTypes.object,
    partial: PropTypes.object,
    correctResponse: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  deleteRule = rule => {
    const { partial, onChange } = this.props;
    const index = partial.rules.find(r => r.count === rule.count);

    if (index !== -1) {
      partial.rules.splice(index, 1);
      onChange(partial);
    }
  };

  addRule = () => {
    const { partial, onChange } = this.props;

    const counts = partial.rules.map(r => r.count);
    let count = 0;
    do {
      count += 1;
    } while (counts.indexOf(count) !== -1 && count > 0);
    const rule = {
      count,
      percent: 50
    };
    partial.rules.push(rule);
    onChange(partial);
  };

  changeRule = rule => {
    const { partial, onChange } = this.props;
    partial.rules = partial.rules.map(u => {
      if (u.count === rule.count) {
        return rule;
      } else {
        return u;
      }
    });

    onChange(partial);
  };

  render() {
    const { classes, className, partial, correctResponse } = this.props;

    const choices = correctResponse ? correctResponse.choices : [];
    const canAdd = partial.rules.length < choices.length - 1;
    return (
      <div className={classNames(classes.partialForCategory, className)}>
        {!correctResponse || correctResponse.choices.length < 1 ? (
          <Empty />
        ) : (
          <Box
            rules={partial.rules}
            canAdd={canAdd}
            onDeleteRule={this.deleteRule}
            onChange={this.changeRule}
            onAddRule={this.addRule}
          />
        )}
      </div>
    );
  }
}
const styles = () => ({
  partialForCategory: {}
});
export default withStyles(styles)(PartialForCategory);
