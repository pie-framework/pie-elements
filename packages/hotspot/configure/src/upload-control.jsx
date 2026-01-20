import React from 'react';
import PropTypes from 'prop-types';

import Button from './button';

const UploadControl = ({ label, onInputClick, onUploadImage, setRef }) => (
  <>
    <Button label={label} onClick={onInputClick} />
    <input
      accept="image/*"
      style={{ display: 'none' }}
      onChange={onUploadImage}
      ref={(ref) => {
        setRef(ref);
      }}
      type="file"
    />
  </>
);

UploadControl.propTypes = {
  label: PropTypes.string.isRequired,
  onInputClick: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired,
};

UploadControl.defaultProps = {
  classNameButton: '',
  classNameSection: '',
};

export default UploadControl;
