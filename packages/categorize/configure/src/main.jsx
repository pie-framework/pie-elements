import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Design from './design';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    configuration: PropTypes.object,
    className: PropTypes.string,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.object
  };

  static defaultProps = {};

  render() {
    const {
      classes,
      className,
      model,
      onModelChanged,
      configuration,
      onConfigurationChanged
    } = this.props;

    return (
      <div className={classNames(classes.main, className)}>
        <Design
          imageSupport={this.props.imageSupport}
          title="Design"
          model={model}
          configuration={configuration}
          onChange={onModelChanged}
          onConfigurationChanged={onConfigurationChanged}
        />
      </div>
    );
  }
}
const styles = () => ({
  main: {}
});

export default withStyles(styles)(Main);
