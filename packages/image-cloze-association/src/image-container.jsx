import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import ImageDropTarget from './image-drop-target';

class ImageContainer extends Component {
  render() {
    const {
      answers,
      canDrag,
      classes,
      draggingElement,
      image: { height, src, width } = {},
      onAnswerSelect,
      onDragAnswerBegin,
      onDragAnswerEnd,
      responseContainers,
      showDashedBorder,
      responseAreaFill,
      answerChoiceTransparency,
      responseContainerPadding,
      imageDropTargetPadding,
    } = this.props;

    return (
      <div className={classes.base}>
        <img src={src} height={height} width={width} alt={'Image not found'} />

        {(responseContainers || []).map((r, i) => {
          const rHeight = (r.height.replace('%', '') / 100) * height;
          const rWidth = (r.width.replace('%', '') / 100) * width;
          const rLeft = (r.x / 100) * width;
          const rTop = (r.y / 100) * height;
          const answersParsed = answers.filter((a) => a.containerIndex === r.index);

          return (
            <ImageDropTarget
              answers={answersParsed}
              canDrag={canDrag}
              containerStyle={{
                height: rHeight,
                width: rWidth,
                left: rLeft,
                top: rTop,
              }}
              key={r.id + i}
              draggingElement={draggingElement}
              onDrop={(item) => onAnswerSelect(item, r.index)}
              onDragAnswerBegin={onDragAnswerBegin}
              onDragAnswerEnd={onDragAnswerEnd}
              showDashedBorder={showDashedBorder}
              responseAreaFill={responseAreaFill}
              answerChoiceTransparency={answerChoiceTransparency}
              responseContainerPadding={responseContainerPadding}
              imageDropTargetPadding={imageDropTargetPadding}
            />
          );
        })}
      </div>
    );
  }
}

ImageContainer.propTypes = {
  answers: PropTypes.array.isRequired,
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  draggingElement: PropTypes.shape({}).isRequired,
  image: PropTypes.object.isRequired,
  onAnswerSelect: PropTypes.func.isRequired,
  onDragAnswerBegin: PropTypes.func.isRequired,
  onDragAnswerEnd: PropTypes.func.isRequired,
  responseContainers: PropTypes.array.isRequired,
  showDashedBorder: PropTypes.bool,
  answerChoiceTransparency: PropTypes.bool,
  responseAreaFill: PropTypes.string,
  responseContainerPadding: PropTypes.string,
  imageDropTargetPadding: PropTypes.string,
};

ImageContainer.defaultProps = {
  classes: {},
};

const styles = (theme) => ({
  base: {
    margin: theme.spacing.unit * 2,
    position: 'relative',
    width: 'fit-content',
  },
});

export default withStyles(styles)(ImageContainer);
