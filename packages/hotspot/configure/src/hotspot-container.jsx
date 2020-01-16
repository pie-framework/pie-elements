import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Help from '@material-ui/icons/Help';

import Drawable from './hotspot-drawable';
import Button from './button';
import UploadControl from './upload-control';

const isImage = (file) => {
  const imageType = /image.*/;
  return file.type.match(imageType);
};

export class Container extends Component {
  constructor(props) {
    super(props);

    const { shapes } = props;
    const shapesKeys = Object.keys(shapes || {});


    this.state = {
      dragEnabled: true,
      shapes: shapesKeys.length
        ? shapesKeys.reduce((acc, currentShapeKey) =>
            acc.concat(
              shapes[currentShapeKey]
                ? shapes[currentShapeKey].map(shape => ({ ...shape, type: currentShapeKey }))
                : []),
          [])
        : []
    }
  }

  handleFileRead = (file) => {
    const { onImageUpload } = this.props;
    const reader = new FileReader();

    reader.onloadend = () => {
      onImageUpload(reader.result);
    };
    reader.readAsDataURL(file)
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.handleFileRead(file);
  };

  enableDropzone = () => this.setState({ dropzoneActive: true });
  disableDropzone = () => this.setState({ dropzoneActive: false });

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

  onUpdateShapes = newShapes => {
    const { onUpdateShapes } = this.props;

    this.setState({
      shapes: newShapes
    }, () => {
      if (newShapes.length) {
        const updatedShapes = newShapes.reduce((acc, { type, ...shapeProps}) => {
          acc[type] = [...(acc[type] || []), shapeProps];
          return acc;
        }, {
          rectangles: [],
          polygons: []
        });

        onUpdateShapes(updatedShapes);
      } else {
        onUpdateShapes({
          rectangles: [],
          polygons: []
        });
      }
    });
  };

  handleUndo = () => {
    const { shapes } = this.state;

    if (shapes && shapes.length) {
      const newShapes = shapes ? shapes.slice(0, shapes.length - 1) : [];
      this.onUpdateShapes(newShapes);
    }
  };

  handleClearAll = () => {
    this.onUpdateShapes([]);
  };

  handleEnableDrag = () => this.setState({ dragEnabled: true });
  handleDisableDrag = () => this.setState({ dragEnabled: false });
  handleInputClick = () => this.input.click();

  toggleTooltip = () => {
    const { showTooltip } = this.state;
    this.setState({ showTooltip: !showTooltip })
  };

  render() {
    const {
      classes,
      dimensions,
      hotspotColor,
      imageUrl,
      multipleCorrect,
      onUpdateImageDimension,
      outlineColor,
      strokeWidth
    } = this.props;
    const {
      dropzoneActive,
      dragEnabled,
      showTooltip
    } = this.state;
    const { shapes } = this.state;

    return (
      <div className={classes.base}>
        <div className={`${classes.box} ${dropzoneActive ? classes.boxActive : ''}`}
             {...dragEnabled ? {
               onDragExit: this.handleOnDragExit,
               onDragLeave: this.handleOnDragExit,
               onDragOver: this.handleOnDragOver,
               onDrop: this.handleOnDrop
             } : {}}
        >
          <div className={classes.toolbar}>
            {imageUrl && (
              <UploadControl
                classNameButton={classes.replaceButton}
                classNameSection={classes.replaceSection}
                label="Replace Image"
                onInputClick={this.handleInputClick}
                onUploadImage={this.handleUploadImage}
                setRef={(ref) => {
                  this.input = ref;
                }}
              />
            )}
            <Button
              disabled={!(shapes && shapes.length)}
              onClick={this.handleUndo}
              label="Undo"
            />
            <Button
              disabled={!(shapes && shapes.length)}
              onClick={this.handleClearAll}
              label="Clear all"
            />
          </div>

          <div
            ref={ref => {
              this.imageSection = ref;
            }}
            className={classes.drawableHeight}>
            {imageUrl
              ? (
                <Drawable
                  dimensions={dimensions}
                  disableDrag={this.handleDisableDrag}
                  enableDrag={this.handleEnableDrag}
                  imageUrl={imageUrl}
                  hotspotColor={hotspotColor}
                  multipleCorrect={multipleCorrect}
                  onUpdateImageDimension={onUpdateImageDimension}
                  onUpdateShapes={this.onUpdateShapes}
                  outlineColor={outlineColor}
                  shapes={shapes}
                  strokeWidth={strokeWidth}
                />
              )
              : (
                <div className={`${classes.drawableHeight} ${classes.centered}`}>
                  <label>Drag and drop or upload image from computer</label>
                  <br/>
                  <UploadControl
                    label="Upload Image"
                    onInputClick={this.handleInputClick}
                    onUploadImage={this.handleUploadImage}
                    setRef={(ref) => {
                      this.input = ref;
                    }}
                  />
                </div>
              )}
          </div>

          {imageUrl && (
            <div className={classes.tooltip}>
              {showTooltip && (
                <div className={classes.tooltipContent}>
                  <label>
                    Click, move mouse and click again to create a hotspot. Click the hotspot to mark correct. Click
                    again to unmark.
                  </label>
                  <div className={classes.tooltipArrow}/>
                </div>
              )}
              <Help
                className={classes.icon}
                onMouseOut={this.toggleTooltip}
                onMouseOver={this.toggleTooltip}
              />
            </div>
          )}
        </div>
      </div>

    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 2
  },
  box: {
    border: '1px solid #E0E1E6',
    borderRadius: '5px'
  },
  boxActive: {
    border: '1px solid #0032C2'
  },
  centered: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  drawableHeight: {
    minHeight: 350
  },
  icon: {
    '&:hover': {
      color: '#333131',
      cursor: 'help'
    },
    color: '#C1C1C1',
    padding: '5px 9px'
  },
  replaceButton: {
    marginLeft: 0,
  },
  replaceSection: {
    marginRight: 'auto'
  },
  toolbar: {
    backgroundColor: '#ECEDF1',
    borderBottom: '1px solid #E0E1E6',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 8px'
  },
  tooltip: {
    position: 'relative',
    textAlign: 'right'
  },
  tooltipContent: {
    background: '#333131',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    lineHeight: '18px',
    marginTop: '-70px',
    padding: '7px 16px',
    position: 'absolute',
    right: '5px',
    textAlign: 'left',
    width: '300px'
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '10px solid #333131',
    marginBottom: -10,
    marginTop: '2px',
    position: 'absolute',
    right: '5px'
  }
});

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  dimensions: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  multipleCorrect: PropTypes.bool.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  shapes: PropTypes.shape({
    rectangles: PropTypes.array,
    polygons: PropTypes.array
  }).isRequired,
  strokeWidth: PropTypes.number
};
Container.defaultProps = {
  strokeWidth: 5
};


export default withStyles(styles)(Container);
