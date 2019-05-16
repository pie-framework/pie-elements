import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

export class ResponsesSection extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { choices } = props.model;

    this.state = reduce(choices, (obj, c, key) => {
      if (c.length > 1) {
        obj[key] = c[0].label;
      }

      return obj;
    }, {});
  }

  getRemainingChoices = () => {
    const { choices } = this.props.model;

    return reduce(choices, (arr, c, index) => {
      if (this.state[index]) {
        return arr;
      }

      arr.push(c);
      return arr;
    }, []);
  };

  onSectionSelect = (index, val) => {
    this.setState({
      [index]: val
    });
  };

  render() {
    const {
      classes,
      model
    } = this.props;
    const {
      choices
    } = model;

    return (
      <div className={classes.design}>
        {map(choices, (c, index) => (
            <AlternatSection
              key={index}
              value={this.state[index]}
              onSelect={(val) => this.onSectionSelect(index, val)} choices={this.getRemainingChoices()}
            />
          ))
        }
      </div>
    );
  }
}

const Styled = withStyles(styles)(ResponsesSection);

export default Styled;