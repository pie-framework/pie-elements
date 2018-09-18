import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Weighting from './weighting';
import Partial from './partial';
import debug from 'debug';

const log = debug('@pie-element:categorize:configure:scoring');

export class Scoring extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    scoring: PropTypes.object,
    onChange: PropTypes.func,
    categories: PropTypes.array,
    correctResponse: PropTypes.array
  };

  static defaultProps = {};

  changeWeighting = weighting => {
    log('[changeWeighting]', weighting);
    const { scoring, onChange } = this.props;
    scoring.weighting = weighting;
    onChange(scoring);
  };

  changePartial = partial => {
    const { scoring, onChange } = this.props;
    scoring.partial = partial;
    onChange(scoring);
  };

  render() {
    const {
      classes,
      className,
      scoring,
      categories,
      correctResponse
    } = this.props;

    return (
      <div className={classNames(classes.scoring, className)}>
        <Weighting
          weighting={scoring.weighting}
          onChange={this.changeWeighting}
          categories={categories}
        />
        <Partial
          className={classes.partial}
          partial={scoring.partial}
          correctResponse={correctResponse}
          categories={categories}
          onChange={this.changePartial}
        />
      </div>
    );
  }
}
const styles = theme => ({
  scoring: {},
  partial: {
    marginTop: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Scoring);
