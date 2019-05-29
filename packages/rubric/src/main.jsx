import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';


export const RubricType = PropTypes.shape({
  maxPoints: PropTypes.number.isRequired,
  excludeZero: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.string)
});


class Rubric extends React.Component {
  dudUrl = 'javascript:;';

  constructor(props) {
    super(props);
    this.state = {
      rubricOpen: false,
      linkPrefix: 'Show'
    };
    this.toggleRubric = this.toggleRubric.bind(this);
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: RubricType
  }

  toggleRubric() {
    this.setState({rubricOpen: !this.state.rubricOpen});
    this.setState({linkPrefix: (this.state.rubricOpen ? 'Show' : 'Hide')});
  }

  render() {
    const { value, classes } = this.props;
    const points = value.points;
    return (
      <div className={classes.root}>
        <Link href={this.dudUrl} onClick={this.toggleRubric}>
        {this.state.linkPrefix} Rubric
        </Link>
        <Collapse in={this.state.rubricOpen} timeout="auto">
          <List component="nav">
            {points.map((desc,index) => (
                  <ListItem key={index}>
                    <ListItemText className={classes.rubricCol} primary={`${index} PTS`} />
                    <ListItemText 
                      primary={<div dangerouslySetInnerHTML={{ __html: desc }}/>}
                    />
                  </ListItem>
                ))}
          </List>
        </Collapse>

    </div>
     
    )
  }
}

const styles = theme => ({
  rubricCol: {
    flex: '0 1 auto'
  }
});


export default withStyles(styles)(Rubric);