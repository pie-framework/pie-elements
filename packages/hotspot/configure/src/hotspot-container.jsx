import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Help from '@material-ui/icons/Help';

import Drawable from './hotspot-drawable';
import Button from './button';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      shapes: [],
      maxImageWidth: 0,
      maxImageHeight: 0,
      dragEnabled: true,
    }
  }

  componentDidMount() {
    const positionInfo = this.imageSection.getBoundingClientRect();
    const { height, width } = positionInfo;

    this.setState({
      maxImageWidth: width - 20,
      maxImageHeight: height - 20
    })
  }

  handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        file,
        imageUrl: reader.result,
      });
    };
    reader.readAsDataURL(file)
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.handleFileRead(file);
  };

  handleOnDrop = (ev) => {
    ev.preventDefault();
    const { items, files } = ev.dataTransfer;

    this.setState({ dropzoneActive: false });

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          this.handleFileRead(file);
        }
      }
    } else {
      for (let i = 0; i < files.length; i++) {
        const file = files[0];
        this.handleFileRead(file);
      }
    }
  };

  handleOnDragOver = (ev) => {
    ev.preventDefault();
    const { dropzoneActive } = this.state;
    if (!dropzoneActive) {
      this.setState({ dropzoneActive: true })
    }
  };

  handleOnDragExit = (ev) => {
    ev.preventDefault();
    this.setState({ dropzoneActive: false })
  };

  handleUndo = () => {
    const { shapes } = this.state;

    if (shapes.length) {
      shapes.pop();
      this.setState({
        shapes,
      })
    }
  };

  handleClearAll = () => this.setState({ shapes: [] });

  handleEnableDrag = () => this.setState({ dragEnabled: true });

  handleDisableDrag = () => this.setState({ dragEnabled: false });

  handleOnChangeShapes = shapes => this.setState({ shapes });

  handleInputClick = () => this.input.click();

  toggleTooltip = () => {
    const { showTooltip } = this.state;
    this.setState({ showTooltip: !showTooltip })
  };

  render() {
    const { classes, hotspotColor, outlineColor } = this.props;
    const { imageUrl, shapes, dropzoneActive, maxImageWidth, maxImageHeight, dragEnabled, showTooltip } = this.state;

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
            <Button
              disabled={!shapes.length}
              onClick={this.handleUndo}
              label="Undo"
            />
            <Button
              disabled={!shapes.length}
              onClick={this.handleClearAll}
              label="Clear all"
            />
          </div>

          <div ref={ref => { this.imageSection = ref; }} className={classes.drawableSection}>
            {imageUrl ? (
              <Drawable
                disableDrag={this.handleDisableDrag}
                enableDrag={this.handleEnableDrag}
                imageUrl={imageUrl}
                hotspotColor={hotspotColor}
                maxImageHeight={maxImageHeight}
                maxImageWidth={maxImageWidth}
                onChangeShapes={this.handleOnChangeShapes}
                outlineColor={outlineColor}
                shapes={shapes}
              />
            ) : (
              <div className={`${classes.drawableSection} ${classes.centered}`}>
                <label>Drag and drop, copy paste, or upload image from computer</label>
                <br />
                <Button
                  label="Upload Image"
                  onClick={this.handleInputClick}
                />
                <input
                  className={classes.input}
                  onChange={this.handleUploadImage}
                  ref={ref => { this.input = ref; }}
                  type="file"
                />
              </div>
            )}
          </div>

          {imageUrl ? (
            <div className={classes.tooltip}>
              {showTooltip ? (
                <div className={classes.tooltipContent}>
                  <label>
                    Click and move on your image to create a hotspot. Click the hotspot to mark correct. Click again to unmark.
                  </label>
                  <div className={classes.tooltipArrow} />
                </div>
              ) : null}
              <Help
                className={classes.icon}
                onMouseOut={this.toggleTooltip}
                onMouseOver={this.toggleTooltip}
              />
            </div>
          ) : null}
        </div>

        {imageUrl ? (
          <div className={classes.replaceButton}>
            <Button
              label="Replace Image"
              onClick={this.handleInputClick}
            />
            <input
              className={classes.input}
              onChange={this.handleUploadImage}
              ref={ref => { this.input = ref; }}
              type="file"
            />
          </div>
        ) : null}
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
    justifyContent: 'center',
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
    padding: '12px 8px',
    justifyContent: 'flex-end'
  },
  icon: {
    '&:hover': {
      color: '#333131',
    },
    color: '#C1C1C1',
    padding: '5px 9px'
  },
  drawableSection: {
    minHeight: 350
  },
  tooltip: {
    textAlign: 'right',
    position: 'relative'
  },
  tooltipContent: {
    background: '#333131',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    lineHeight: '18px',
    marginTop: '-70px',
    position: 'absolute',
    padding: '7px 16px',
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
  },
  replaceButton: {
    marginLeft: 0,
    marginTop: 16
  }
});

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  hotspotList: PropTypes.string.isRequired
};

export default withStyles(styles)(Container);
