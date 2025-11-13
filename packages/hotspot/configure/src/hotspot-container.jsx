import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from './button';
import { CircleButton } from './buttons/circle';
import { PolygonButton } from './buttons/polygon';
import { RectangleButton } from './buttons/rectangle';
import { SUPPORTED_SHAPES } from './shapes';
import Drawable from './hotspot-drawable';
import UploadControl from './upload-control';
import { getAllShapes, groupShapes } from './utils';

const BaseContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
}));

const BoxContainer = styled('div')(({ theme, hasErrors, dropzoneActive }) => ({
  border: '1px solid #E0E1E6',
  borderRadius: '5px',
  ...(dropzoneActive && {
    border: '1px solid #0032C2',
  }),
  ...(hasErrors && !dropzoneActive && {
    border: `1px solid ${theme.palette.error.main}`,
  }),
}));

const ButtonShape = styled('div')({
  marginRight: '5px',
  '&:hover': {
    cursor: 'pointer',
  },
});

const CenteredContainer = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const DrawableHeight = styled('div')(({ theme }) => ({
  minHeight: 350,
  paddingBottom: theme.spacing(5),
  paddingRight: theme.spacing(5),
}));

const Toolbar = styled('div')(({ theme }) => ({
  backgroundColor: '#FFF',
  borderBottom: '1px solid #E0E1E6',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
}));

const ReplaceSection = styled('div')({
  marginRight: 'auto',
});

const ReplaceButton = styled('div')({
  marginLeft: 0,
});

const isImage = (file) => {
  const imageType = /image.*/;

  return file.type.match(imageType);
};

export class Container extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // always transform shapes map into shapes array at this level
    return {
      ...prevState,
      shapes: getAllShapes(nextProps.shapes),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      dragEnabled: true,
      // always transform shapes map into shapes array at this level
      shapes: getAllShapes(props.shapes),
      selectedShape: SUPPORTED_SHAPES.NONE,
    };
    this.fakeImageHandler = {
      cancel: () => {},
      done: (a, url) => this.props.onImageUpload(url),
      fileChosen: () => {},
      progress: () => {},
    };
  }

  handleFileRead = (file) => {
    if (file instanceof Blob) {
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
    }
  };
  enableDropzone = () => this.setState({ dropzoneActive: true });

  disableDropzone = () => this.setState({ dropzoneActive: false });

  handleOnPaste = (e) => {
    const { files } = e.clipboardData;

    if (files && isImage(files[0])) {
      this.handleFileRead(files[0]);
    }
  };

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

    this.disableDropzone();
  };

  handleOnDragOver = (e) => {
    e.preventDefault();

    const { dropzoneActive } = this.state;

    if (!dropzoneActive) {
      this.enableDropzone();
    }
  };

  handleOnDragExit = (e) => {
    e.preventDefault();

    this.disableDropzone();
  };

  onUpdateShapes = (newShapes) => {
    const { onUpdateShapes } = this.props;
    this.setState(
      { shapes: newShapes },
      // always transform shapes array back into shapes map when saving changes
      () => onUpdateShapes(groupShapes(newShapes)),
    );
  };

  onDeleteShape = (id) => {
    const { shapes } = this.state;
    if (shapes && shapes.length) {
      // filter the deleted shape out
      let newShapes = shapes.filter((shape) => shape.id !== id);
      this.onUpdateShapes(newShapes);
    }
  };

  handleClearAll = () => this.onUpdateShapes([]);

  handleEnableDrag = () => this.setState({ dragEnabled: true });

  handleDisableDrag = () => this.setState({ dragEnabled: false });

  handleInputClick = () => {
    const { insertImage } = this.props;

    if (insertImage) {
      insertImage(this.fakeImageHandler);
    }
  };

  handleFinishDrawing = () => {
    // Explicitly end the current shape drawing session
    // This would cause the finalizeCreation method to be called in the HotspotDrawable component
    this.setState({ selectedShape: SUPPORTED_SHAPES.NONE });
  };

  render() {
    const {
      dimensions,
      hasErrors,
      hotspotColor,
      imageUrl,
      multipleCorrect,
      onUpdateImageDimension,
      outlineColor,
      strokeWidth,
      preserveAspectRatioEnabled,
      hoverOutlineColor,
      selectedHotspotColor,
    } = this.props;
    
    const { dropzoneActive, dragEnabled } = this.state;
    const { shapes, selectedShape } = this.state;

    return (
      <BaseContainer>
        <BoxContainer
          hasErrors={hasErrors}
          dropzoneActive={dropzoneActive}
          {...(dragEnabled
            ? {
                onDragExit: this.handleOnDragExit,
                onDragLeave: this.handleOnDragExit,
                onDragOver: this.handleOnDragOver,
                onDrop: this.handleOnDrop,
                onPaste: this.handleOnPaste,
              }
            : {})}
        >
          <Toolbar>
            <ButtonShape
              onClick={() => this.setState({ selectedShape: selectedShape === SUPPORTED_SHAPES.RECTANGLE ? SUPPORTED_SHAPES.NONE : SUPPORTED_SHAPES.RECTANGLE })}
            >
              <RectangleButton isActive={selectedShape === SUPPORTED_SHAPES.RECTANGLE} />
            </ButtonShape>
            <ButtonShape
              onClick={() => this.setState({ selectedShape: selectedShape === SUPPORTED_SHAPES.POLYGON ? SUPPORTED_SHAPES.NONE : SUPPORTED_SHAPES.POLYGON })}
            >
              <PolygonButton isActive={selectedShape === SUPPORTED_SHAPES.POLYGON} />
            </ButtonShape>
            <ButtonShape
              onClick={() => this.setState({ selectedShape: selectedShape === SUPPORTED_SHAPES.CIRCLE ? SUPPORTED_SHAPES.NONE : SUPPORTED_SHAPES.CIRCLE })}
            >
              <CircleButton isActive={selectedShape === SUPPORTED_SHAPES.CIRCLE} />
            </ButtonShape>

            {imageUrl && (
              <ReplaceSection>
                <UploadControl
                  label="Replace Image"
                  onInputClick={this.handleInputClick}
                  setRef={(ref) => {
                    this.input = ref;
                  }}
                />
              </ReplaceSection>
            )}
            <Button disabled={!(shapes && shapes.length)} onClick={this.handleClearAll} label="Clear all" />
          </Toolbar>

          <DrawableHeight
            ref={(ref) => {
              this.imageSection = ref;
            }}
          >
            {imageUrl ? (
              <Drawable
                dimensions={dimensions}
                disableDrag={this.handleDisableDrag}
                enableDrag={this.handleEnableDrag}
                shapeType={this.state.selectedShape}
                handleFinishDrawing={this.handleFinishDrawing}
                imageUrl={imageUrl}
                hotspotColor={hotspotColor}
                selectedHotspotColor={selectedHotspotColor}
                hoverOutlineColor={hoverOutlineColor}
                multipleCorrect={multipleCorrect}
                onUpdateImageDimension={onUpdateImageDimension}
                onUpdateShapes={this.onUpdateShapes}
                onDeleteShape={this.onDeleteShape}
                outlineColor={outlineColor}
                shapes={shapes}
                strokeWidth={strokeWidth}
                preserveAspectRatioEnabled={preserveAspectRatioEnabled}
              />
            ) : (
              <CenteredContainer>
                <label>Drag and drop or upload image from computer</label>
                <br />
                <UploadControl
                  label="Upload Image"
                  onInputClick={this.handleInputClick}
                  setRef={(ref) => {
                    this.input = ref;
                  }}
                />
              </CenteredContainer>
            )}
          </DrawableHeight>
        </BoxContainer>
      </BaseContainer>
    );
  }
}

Container.propTypes = {
  dimensions: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  selectedHotspotColor: PropTypes.string,
  hoverOutlineColor: PropTypes.string,
  multipleCorrect: PropTypes.bool.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  insertImage: PropTypes.func,
  onUpdateShapes: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  shapes: PropTypes.shape({
    rectangles: PropTypes.array,
    polygons: PropTypes.array,
  }).isRequired,
  strokeWidth: PropTypes.number,
  preserveAspectRatioEnabled: PropTypes.bool,
  hasErrors: PropTypes.bool,
};

Container.defaultProps = {
  strokeWidth: 5,
};

export default Container;
