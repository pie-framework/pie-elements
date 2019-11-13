import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { InputCheckbox } from '@pie-lib/config-ui';

export class Arrows extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    arrows: PropTypes.shape({ left: PropTypes.bool, right: PropTypes.bool })
      .isRequired,
    onChange: PropTypes.func
  };
  static defaultProps = {
    arrows: { left: true, right: true }
  };

  constructor(props) {
    super(props);

    this.change = (key, event, value) => {
      const update = { ...this.props.arrows, [key]: value };
      this.props.onChange(update);
    };
    this.changeLeft = this.change.bind(this, 'left');
    this.changeRight = this.change.bind(this, 'right');
  }

  render() {
    const { classes, className, arrows } = this.props;
    return (
      <div className={cn(classes.arrows, className)}>
        <InputCheckbox
          className={classes.checkbox}
          label={'Left'}
          checked={arrows.left}
          onChange={this.changeLeft}
        />
        &nbsp;
        <InputCheckbox
          className={classes.checkbox}
          label={'Right'}
          checked={arrows.right}
          onChange={this.changeRight}
        />
      </div>
    );
  }
}
const styles = theme => ({
  arrows: {
    paddingTop: theme.spacing.unit * 2
  }
});
export default withStyles(styles)(Arrows);
