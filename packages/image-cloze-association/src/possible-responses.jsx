import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import { ICADroppablePlaceholder } from '@pie-lib/pie-toolbox/drag';

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
}) => (
  <div className={classes.base} style={customStyle}>
    <ICADroppablePlaceholder
      classes={classes.pool}
      disabled={!canDrag}
      id="pula-in-pisda"
      onRemoveAnswer={onAnswerRemove}
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
