import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import { ICADroppablePlaceholder } from '@pie-lib/pie-toolbox/drag';

import PossibleResponse from './possible-response';

const PossibleResponses = ({ canDrag, classes, data, onAnswerRemove, onDragBegin, onDragEnd }) => (
  <div className={classes.base}>
    <ICADroppablePlaceholder disabled={!canDrag} onRemoveAnswer={onAnswerRemove}>
      {data.map((item) => (
        <PossibleResponse canDrag={canDrag} key={item.id} data={item} onDragBegin={onDragBegin} onDragEnd={onDragEnd} />
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
};

PossibleResponses.defaultProps = {
  classes: {},
};

const styles = (theme) => ({
  base: {
    backgroundColor: color.background(),
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(PossibleResponses);
