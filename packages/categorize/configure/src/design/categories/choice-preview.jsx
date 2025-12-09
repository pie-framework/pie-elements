import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DraggableChoice } from '@pie-lib/drag';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { HtmlAndMath } from '@pie-lib/render-ui';
import { color } from '@pie-lib/render-ui';

const ChoicePreviewContainer = styled('div')({
  position: 'relative',
  overflow: 'auto',
});

const DeleteIconButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
  top: 0,
  color: `${color.tertiary()} !important`,
});

export class ChoicePreview extends React.Component {
  static propTypes = {
    alternateResponseIndex: PropTypes.number,
    category: PropTypes.object,
    className: PropTypes.string,
    choice: PropTypes.object.isRequired,
    choiceIndex: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  delete = () => {
    const { onDelete, choice } = this.props;
    onDelete(choice);
  };

  render() {
    const { alternateResponseIndex, category, className, choice, choiceIndex } = this.props;
    return (
      <ChoicePreviewContainer className={className}>
        {choice ? (
          <DraggableChoice
            alternateResponseIndex={alternateResponseIndex}
            category={category}
            choice={choice}
            choiceIndex={choiceIndex}
            onRemoveChoice={this.delete}
            type={'choice-preview'}
            id={choice.id}
            categoryId={category && category.id}
          >
            <HtmlAndMath html={choice?.content} />
          </DraggableChoice>
        ) : null}
        <DeleteIconButton
          aria-label="delete"
          onClick={this.delete}
          size="large">
          <RemoveCircleOutlineIcon />
        </DeleteIconButton>
      </ChoicePreviewContainer>
    );
  }
}

export default ChoicePreview;
