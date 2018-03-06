import Menu, { MenuItem } from 'material-ui/Menu';
import ActionFeedback from 'material-ui-icons/Feedback';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import InputLabel from 'material-ui/Input/InputLabel';

export class IconMenu extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }


  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {

    const { opts, onClick } = this.props;

    const keys = Object.keys(opts);

    const handleMenuClick = (key) => () => {
      this.props.onClick(key);
      this.handleRequestClose();
    }

    return (
      <div>
        <InputLabel style={{fontSize: "13px"}}  shrink={true}>Feedback</InputLabel>
        <div onClick={this.handleClick}>
          {this.props.iconButtonElement}
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >{keys.map((k, index) => (<MenuItem
          key={index}
          onClick={handleMenuClick(k)}>{opts[k]}</MenuItem>))}
        </Menu>
      </div>
    );
  }
}

IconMenu.propTypes = {
  iconButtonElement: PropTypes.any
}

/**
 * TODO: move FeedbackMenu to config-ui (there's one in multiple choice too). 
 */
export default function FeedbackMenu(props) {

  const { value, onChange } = props;

  const t = value && value.type;
  const iconColor = t === 'custom' ? 'secondary'
    :
    (t === 'default' ? 'primary' : 'disabled');

  const tooltip = t === 'custom' ?
    'Custom Feedback' :
    (t === 'default' ? 'Default Feedback' : 'Feedback disabled');

  const icon = <IconButton
    aria-label={tooltip}>
    <ActionFeedback color={iconColor} />
  </IconButton>;

  return (
    <IconMenu
      iconButtonElement={icon}
      onClick={(key) => onChange(key)}
      opts={{
        none: 'No Feedback',
        default: 'Default',
        custom: 'Custom'
      }} />
  );
}
