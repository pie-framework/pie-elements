import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-konva';

class ImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    const { src } = this.props;

    this.image = new window.Image();
    this.image.src = src;
    this.image.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {
    this.setState({
      image: this.image
    });
  };

  render() {
    const { x, y } = this.props;
    const { image } = this.state;

    return (
      <Image
        width={20}
        height={20}
        x={x}
        y={y}
        image={image}
      />
    );
  }
}

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default ImageComponent;
