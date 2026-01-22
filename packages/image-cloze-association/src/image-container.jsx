import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import ImageDropTarget from './image-drop-target';

const BaseContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  position: 'relative',
  width: 'fit-content',
}));

class ImageContainer extends Component {
  render() {
    const {
      answers,
      canDrag,
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
      maxResponsePerZone,
    } = this.props;

    return (
      <BaseContainer>
        <img src={src} height={height} width={width} />

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
              index={r.index}
              onDrop={(item) => onAnswerSelect(item, r.index)}
              onDragAnswerBegin={onDragAnswerBegin}
              onDragAnswerEnd={onDragAnswerEnd}
              showDashedBorder={showDashedBorder}
              responseAreaFill={responseAreaFill}
              answerChoiceTransparency={answerChoiceTransparency}
              responseContainerPadding={responseContainerPadding}
              imageDropTargetPadding={imageDropTargetPadding}
              maxResponsePerZone={maxResponsePerZone}
            />
          );
        })}
      </BaseContainer>
    );
  }
}

ImageContainer.propTypes = {
  answers: PropTypes.array.isRequired,
  canDrag: PropTypes.bool.isRequired,
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
  maxResponsePerZone: PropTypes.number,
};

export default ImageContainer;
