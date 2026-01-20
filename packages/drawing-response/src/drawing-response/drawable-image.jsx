import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const ImageContainer = styled('div')({
  position: 'relative',
  width: 'fit-content',
});

const Image = styled('img')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

const DrawableImage = ({ url, dimensions: { height, width } }) => (
  <ImageContainer>
    <Image
      alt="drawing-response-image"
      src={url}
      style={{
        height,
        maxWidth: width,
        maxHeight: 350,
        width,
      }}
    />
  </ImageContainer>
);

DrawableImage.propTypes = {
  dimensions: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export default DrawableImage;
