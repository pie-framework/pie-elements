import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from './button';

const isImage = (file) => {
  const imageType = /image.*/;
  return file.type.match(imageType);
};

class ImageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxImageWidth: 0,
      maxImageHeight: 0,
      dragEnabled: true,
      dropzoneActive: false,
    }
  }

  componentDidMount() {
    const positionInfo = this.imageSection.getBoundingClientRect();
    const { height, width } = positionInfo;
    this.setState({
      maxImageWidth: width,
      maxImageHeight: height
    })
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

  makeDropzoneActive= () => this.setState({ dropzoneActive: true });
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
  handleInputClick = () => this.input.click();

  handleOnImageLoad = ({ target: { offsetHeight, offsetWidth } }) => {
    const { onUpdateImageDimension } = this.props;
    const resizeHandle = this.resize;

    const dimensions = {
      height: offsetHeight,
      width: offsetWidth
    };

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
    const { maxImageWidth } = this.state;

    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const fitsContainer = x <= maxImageWidth + 5;
    const hasMinimumWidth = x > 150 && y > 150;

    if (fitsContainer && hasMinimumWidth) {
      box.style.width = `${x}px`;
      box.style.height = `${y}px`;

      this.setState({ dimensions: { height: y, width: x }});
    }

    this.handleDisableDrag();
  };

  renderUploadControl(label) {
    const { classes } = this.props;

    return (
      <div>
        <Button
          label={label}
          onClick={this.handleInputClick}
        />
        <input
          accept="image/*"
          className={classes.input}
          onChange={this.handleUploadImage}
          ref={ref => { this.input = ref; }}
          type="file"
        />
      </div>
    )
  }

  render() {
    const {
      classes,
      imageUrl
    } = this.props;
    const {
      dropzoneActive,
      dragEnabled,
      maxImageHeight,
      maxImageWidth
    } = this.state;

    return (
      <div className={classes.base} >
        <div className={`${classes.box} ${dropzoneActive ? classes.boxActive : ''}`}
             {...dragEnabled ? {
               onDragExit: this.handleOnDragExit,
               onDragLeave: this.handleOnDragExit,
               onDragOver: this.handleOnDragOver ,
               onDrop: this.handleOnDrop
             } : {}}
        >
          <div className={classes.toolbar}>
            {this.renderUploadControl(imageUrl ? 'Replace Image' : 'Upload Image')}
          </div>

          <div ref={ref => { this.imageSection = ref; }} className={classes.drawableHeight}>
            {imageUrl ? (
              <div className={classes.imageContainer}>
                <img
                  className={classes.image}
                  height="auto"
                  onLoad={this.handleOnImageLoad}
                  ref={ref => { this.image = ref; }}
                  src={imageUrl}
                  style={{ maxWidth: maxImageWidth, maxHeight: maxImageHeight }}
                />
                <div ref={ref => { this.resize = ref; }} className={classes.resize} />
              </div>
            ) : (
              <div className={`${classes.drawableHeight} ${classes.centered}`}>
                <label>Drag and drop or upload image from computer</label>
                <br />
                {this.renderUploadControl('Upload Image')}
              </div>
            )}
          </div>
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
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 'fit-content'
  },
  resize: {
    borderBottom: '1px solid #727272',
    borderRight: '1px solid #727272',
    bottom: '-10px',
    cursor: 'se-resize',
    height: '10px',
    position: 'absolute',
    right: '-10px',
    width: '10px'
  },
  input: {
    display: 'none'
  },
  toolbar: {
    backgroundColor: '#ECEDF1',
    borderBottom: '1px solid #E0E1E6',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    display: 'flex',
    padding: '12px 8px'
  }
});

ImageContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired
};

export default withStyles(styles)(ImageContainer);
