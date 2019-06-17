import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';

import Button from './button';

const UploadControl = ({
  classNameButton,
  classNameSection,
  classes,
  label,
  onInputClick,
  onUploadImage,
  setRef
}) => (
  <div className={classNameSection}>
    <Button
      className={classNameButton}
      label={label}
      onClick={onInputClick}
    />
    <input
      accept="image/*"
      className={classes.input}
      onChange={onUploadImage}
      ref={ref => { setRef(ref); }}
      type="file"
    />
  </div>
);


const styles = () => ({
  input: {
    display: 'none'
  }
});

UploadControl.propTypes = {
  classes: PropTypes.object.isRequired,
  classNameButton: PropTypes.string,
  classNameSection: PropTypes.string,
  label: PropTypes.string.isRequired,
  onInputClick: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired
};

UploadControl.defaultProps = {
  classNameButton: '',
  classNameSection: ''
};

export default withStyles(styles)(UploadControl);
