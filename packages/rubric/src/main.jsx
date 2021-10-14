import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';

export const RubricType = PropTypes.shape({
  excludeZero: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.string),
  sampleAnswers: PropTypes.arrayOf(PropTypes.string),
});

class Rubric extends React.Component {
  dudUrl = 'javascript:;';

  constructor(props) {
    super(props);
    this.state = {
      rubricOpen: false,
      linkPrefix: 'Show',
    };
    this.toggleRubric = this.toggleRubric.bind(this);
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    animationsDisabled: PropTypes.bool,
    value: RubricType,
  };

  toggleRubric() {
    this.setState({ rubricOpen: !this.state.rubricOpen });
    this.setState({ linkPrefix: this.state.rubricOpen ? 'Show' : 'Hide' });
  }

  shouldRenderPoint = (index, value) => {
    if (!value.excludeZero) {
      return true;
    } else {
      return index !== 0;
    }
  };

  render() {
    const { value, classes, animationsDisabled } = this.props;
    if (value && value.points) {
      const { points, sampleAnswers } = value;

      const rubricList = <List component="nav">
        {points.map(
          (desc, index) =>
            this.shouldRenderPoint(index, value) && (
              <React.Fragment key={index}>
                <ListItem key={`P${index}`}>
                  <ListItemText
                    className={classes.rubricCol}
                    primary={`${index} PTS`}
                  />
                  <ListItemText
                    primary={
                      <div dangerouslySetInnerHTML={{ __html: desc }} />
                    }
                  />
                </ListItem>
                {sampleAnswers && sampleAnswers[index] && (
                  <ListItem key={`S${index}`}>
                    <ListItemText
                      className={classes.rubricCol}
                      style={{marginLeft: '20px'}}
                      primary={'Sample Answer'}
                    />
                    <ListItemText
                      primary={
                        <div dangerouslySetInnerHTML={{ __html: sampleAnswers[index] }} />
                      }
                    />
                  </ListItem>
                )}
              </React.Fragment>
            )
        )}
      </List>;

      return (
        <div className={classes.root}>
          {!animationsDisabled ?
            <React.Fragment>
              <Link href={this.dudUrl} onClick={this.toggleRubric}>
                {this.state.linkPrefix} Rubric
              </Link>
              <Collapse in={this.state.rubricOpen} timeout="auto">
                {rubricList}
              </Collapse>
            </React.Fragment>
            : rubricList
          }
        </div>
      );
    } else {
      return null;
    }
  }
}

const styles = () => ({
  rubricCol: {
    flex: '0 1 auto',
  },
});

export default withStyles(styles)(Rubric);
