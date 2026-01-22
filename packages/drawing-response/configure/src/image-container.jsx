import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Button from './button';

const isImage = (file) => {
  const imageType = /image.*/;
  return file.type.match(imageType);
};

const BaseContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const Box = styled('div')(({ active }) => ({
  border: active ? '1px solid #0032C2' : '1px solid #E0E1E6',
  borderRadius: '5px',
}));

const CenteredDiv = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const DrawableHeight = styled('div')({
  minHeight: 350,
});

const Image = styled('img')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

const StyledImageContainer = styled('div')({
  position: 'relative',
  width: 'fit-content',
});

const ResizeHandle = styled('div')({
  borderBottom: '1px solid #727272',
  borderRight: '1px solid #727272',
  bottom: '-10px',
  cursor: 'se-resize',
  height: '10px',
  position: 'absolute',
  right: '-10px',
  width: '10px',
});

const HiddenInput = styled('input')({
  display: 'none',
});

const Toolbar = styled('div')({
  backgroundColor: '#ECEDF1',
  borderBottom: '1px solid #E0E1E6',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  display: 'flex',
  padding: '12px 8px',
});

export class ImageContainer extends Component {

  static propTypes = {
    imageDimensions: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      maxImageWidth: '100%',
      maxImageHeight: 'auto',
      dragEnabled: true,
      dropzoneActive: false,
    };
    this.fakeImageHandler = {
      cancel: () => {},
      done: (a, url) => this.props.onImageUpload(url),
      fileChosen: () => {},
      progress: () => {},
    };
  }

  componentDidMount() {
    if (this.imageSection) {
      const positionInfo = this.imageSection.getBoundingClientRect();
      const { height, width } = positionInfo;
      this.setState({
        maxImageWidth: width,
        maxImageHeight: height,
      });
    }
  }

  handleFileRead = (file) => {
    const { onImageUpload, insertImage } = this.props;
    const reader = new FileReader();

    reader.onloadend = () => onImageUpload(reader.result);
    reader.readAsDataURL(file);

    if (insertImage) {
      insertImage({
        ...this.fakeImageHandler,
        getChosenFile: () => file,
        isPasted: true,
      });
    }
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.handleFileRead(file);
  };

  makeDropzoneActive = () => this.setState({ dropzoneActive: true });

  makeDropzoneInactive = () => this.setState({ dropzoneActive: false });

  handleOnDrop = (e) => {
    e.preventDefault();
    const { items, files } = e.dataTransfer;

    if (items && items[0].kind === 'file') {
      const file = items[0].getAsFile();
      if (isImage(file)) {
        this.handleFileRead(file);
      }
    } else if (isImage(files[0])) {
      this.handleFileRead(files[0]);
    }

    this.makeDropzoneInactive();
  };

  handleOnDragOver = (e) => {
    e.preventDefault();
    const { dropzoneActive } = this.state;

    if (!dropzoneActive) {
      this.makeDropzoneActive();
    }
  };

  handleOnDragExit = (e) => {
    e.preventDefault();
    this.makeDropzoneInactive();
  };

  handleEnableDrag = () => this.setState({ dragEnabled: true });
  handleDisableDrag = () => this.setState({ dragEnabled: false });
  handleInputClick = () => {
    const { insertImage } = this.props;

    if (insertImage) {
      insertImage(this.fakeImageHandler);
    }
  };

  handleOnImageLoad = ({ target: { offsetHeight, offsetWidth, naturalHeight, naturalWidth } }) => {
    const { onUpdateImageDimension, imageDimensions } = this.props;
    const resizeHandle = this.resize;

    const dimensions = {
      height: (imageDimensions && imageDimensions.height) || offsetHeight || naturalHeight,
      width: (imageDimensions && imageDimensions.width) || offsetWidth || naturalWidth,
    };

    // check if aspect ratio is not respected on replacing image
    const imageAspectRatio = naturalWidth / naturalHeight;

    if (dimensions.width !== dimensions.height * imageAspectRatio) {
      dimensions.width = dimensions.height * imageAspectRatio;
    }

    this.setState({ dimensions });
    onUpdateImageDimension(dimensions);

    resizeHandle.addEventListener('mousedown', this.initialiseResize, false);
  };

  initialiseResize = () => {
    window.addEventListener('mousemove', this.startResizing, false);
    window.addEventListener('mouseup', this.stopResizing, false);
  };

  stopResizing = () => {
    const { onUpdateImageDimension } = this.props;
    const { dimensions } = this.state;

    this.handleEnableDrag();
    onUpdateImageDimension(dimensions);

    window.removeEventListener('mousemove', this.startResizing, false);
    window.removeEventListener('mouseup', this.stopResizing, false);
  };

  startResizing = (e) => {
    const box = this.image;
    const { maxImageWidth, maxImageHeight, dimensions } = this.state;

    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const imageAspectRatio = dimensions.width / dimensions.height;
    const fitsContainer = x <= maxImageWidth + 5 && x / imageAspectRatio <= maxImageHeight + 5;
    const hasMinimumWidth = x > 150 && y > 150;

    if (fitsContainer && hasMinimumWidth && box) {
      box.style.width = `${x}px`;
      box.style.height = `${x / imageAspectRatio}px`;

      this.setState({
        dimensions: {
          width: x,
          height: x / imageAspectRatio,
        },
      });
    }

    this.handleDisableDrag();
  };

  renderUploadControl(label) {
    return (
      <div>
        <Button label={label} onClick={this.handleInputClick} />
        <HiddenInput
          accept="image/*"
          onChange={this.handleUploadImage}
          ref={(ref) => {
            this.input = ref;
          }}
          type="file"
        />
      </div>
    );
  }

  render() {
    const { imageUrl, imageDimensions } = this.props;
    const { dropzoneActive, dragEnabled, maxImageHeight, maxImageWidth } = this.state;

    return (
      <BaseContainer>
        <Box
          active={dropzoneActive}
          {...(dragEnabled
            ? {
                onDragExit: this.handleOnDragExit,
                onDragLeave: this.handleOnDragExit,
                onDragOver: this.handleOnDragOver,
                onDrop: this.handleOnDrop,
              }
            : {})}
        >
          <Toolbar>{this.renderUploadControl(imageUrl ? 'Replace Image' : 'Upload Image')}</Toolbar>

          <DrawableHeight
            ref={(ref) => {
              this.imageSection = ref;
            }}
          >
            {imageUrl ? (
              <StyledImageContainer>
                <Image
                  height="auto"
                  onLoad={this.handleOnImageLoad}
                  ref={(ref) => {
                    this.image = ref;
                  }}
                  src={imageUrl}
                  style={{
                    width: imageDimensions && imageDimensions.width ? imageDimensions.width : undefined,
                    maxWidth: maxImageWidth,
                    maxHeight: maxImageHeight,
                  }}
                  alt=""
                />
                <ResizeHandle
                  ref={(ref) => {
                    this.resize = ref;
                  }}
                />
              </StyledImageContainer>
            ) : (
              <DrawableHeight as={CenteredDiv}>
                <label>Drag and drop or upload image from computer</label>
                <br />
                {this.renderUploadControl('Upload Image')}
              </DrawableHeight>
            )}
          </DrawableHeight>
        </Box>
      </BaseContainer>
    );
  }
}

ImageContainer.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  insertImage: PropTypes.func,
};

export default ImageContainer;
