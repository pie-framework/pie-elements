import React from 'react';
import PropTypes from 'prop-types';
import Design from './design';
import PartialScoring from '@pie-lib/scoring-config';
import { Tabs } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  changePartialScoring = partialScoring => {
    const { onChange, model } = this.props;
    const update = cloneDeep(model);
    update.partialScoring = partialScoring;
    onChange(update);
  };

  render() {
    const { model, onChange, classes } = this.props;

    return (
      <Tabs>
        <Design
          className={classes.container}
          title={'Design'}
          model={model}
          onChange={onChange}
        />
        <PartialScoring
          title={'Scoring'}
          label={model.partialScoringLabel}
          partialScoring={model.partialScoring}
          onChange={this.changePartialScoring}
        />
      </Tabs>
    );
  }
}
export default withStyles(theme => ({
  container: {
    paddingTop: theme.spacing.unit
  }
}))(Main);
