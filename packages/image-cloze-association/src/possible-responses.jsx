import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { color } from '@pie-lib/render-ui';
import { ICADroppablePlaceholder } from '@pie-lib/drag';

import PossibleResponse from './possible-response';

const PossibleResponses = ({
  canDrag,
  classes,
  data,
  onAnswerRemove,
  onDragBegin,
  onDragEnd,
  answerChoiceTransparency,
  customStyle,
  isVertical,
  minHeight,
}) => (
  <div className={classes.base} style={customStyle}>
    <ICADroppablePlaceholder
      classes={classes.pool}
      disabled={!canDrag}
      onRemoveAnswer={onAnswerRemove}
      isVerticalPool={isVertical}
      minHeight={minHeight}
    >
      {(data || []).map((item) => (
        <PossibleResponse
          canDrag={canDrag}
          key={item.id}
          data={item}
          onDragBegin={onDragBegin}
          onDragEnd={onDragEnd}
          answerChoiceTransparency={answerChoiceTransparency}
          containerStyle={{ margin: '4px' }}
        />
      ))}
    </ICADroppablePlaceholder>
  </div>
);

PossibleResponses.propTypes = {
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  data: PropTypes.array.isRequired,
  onAnswerRemove: PropTypes.func.isRequired,
  onDragBegin: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  answerChoiceTransparency: PropTypes.bool,
  customStyle: PropTypes.object,
  isVertical: PropTypes.bool,
  minHeight: PropTypes.number,
};

PossibleResponses.defaultProps = {
  classes: {},
};

const styles = (theme) => ({
  base: {
    backgroundColor: color.background(),
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
  },
});

export default withStyles(styles)(PossibleResponses);
