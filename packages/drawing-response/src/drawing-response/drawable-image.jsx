import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const DrawableImage = ({ classes, url, dimensions: { height, width } }) => (
  <div className={classes.imageContainer}>
    <img
      className={classes.image}
      src={url}
      style={{
        height,
        maxWidth: 598,
        maxHeight: 350,
        width,
      }}
    />
  </div>
);

const styles = () => ({
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  imageContainer: {
    position: 'relative',
    width: 'fit-content'
  }
});

DrawableImage.propTypes = {
  classes: PropTypes.object.isRequired,
  dimensions: PropTypes.object.isRequired,
  url:PropTypes.string.isRequired
};

export default withStyles(styles)(DrawableImage);
