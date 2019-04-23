import React from 'react';
import PropTypes from 'prop-types';
import Design from './design';
import { Tabs } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {};

  onPromptChanged = prompt => {
    const { onChange, model } = this.props;
    const update = cloneDeep(model);

    update.prompt = prompt;
    onChange(update);
  };

  render() {
    const { model, onChange, classes, imageSupport } = this.props;

    return (
      <Design
        className={classes.container}
        title={'Design'}
        model={model}
        onChange={onChange}
        imageSupport={imageSupport}
        onPromptChanged={this.onPromptChanged}
      />
    );
  }
}
export default withStyles(theme => ({
  container: {
    paddingTop: theme.spacing.unit
  }
}))(Main);
