import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { color } from '@pie-lib/pie-toolbox/render-ui';

export const ChoiceType = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export const Layout = ({ classes, className, content, isDragging, disabled, correct }) => {
  const rootNames = classNames(
      correct === true && 'correct',
      correct === false && 'incorrect',
      classes.choice,
      isDragging && classes.dragging,
      disabled && classes.disabled,
      className,
  );
  const cardNames = classNames(classes.card);
  return (
      <div className={rootNames}>
        <Card className={cardNames}>
          <CardContent
              classes={{ root: classes.cardRoot }}
              dangerouslySetInnerHTML={{ __html: content }}
          />
        </Card>
      </div>
  );
};

Layout.propTypes = {
  ...ChoiceType,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  correct: PropTypes.bool,
};

const styles = (theme) => ({
  choice: {
    direction: 'initial',
    cursor: 'pointer',
    width: '100%',
    '&.correct': {
      border: `solid 2px ${color.correct()}`,
    },
    '&.incorrect': {
      border: `solid 2px ${color.incorrect()}`,
    },
    borderRadius: '6px',
  },
  cardRoot: {
    color: color.text(),
    backgroundColor: color.white(),
    fontSize: theme.typography.fontSize + 2,
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
    borderRadius: '4px',
    border: '1px solid',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: '0.6',
  },
  dragging: {
    cursor: 'move',
  },
  card: {
    color: color.text(),
    backgroundColor: color.background(),
    width: '100%',
    pointerEvents: 'none',
  },
});

const Styled = withStyles(styles)(Layout);

const Choice = ({ id, content, disabled, correct, extraStyle, onRemoveChoice }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'categorize',
    item: { id, content },
    canDrag: !disabled,
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        onRemoveChoice(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
      <div ref={drag} style={{ margin: '4px', ...extraStyle }}>
        <Styled
            id={id}
            content={content}
            disabled={disabled}
            correct={correct}
            isDragging={isDragging}
        />
      </div>
  );
};

Choice.propTypes = {
  ...ChoiceType,
  extraStyle: PropTypes.object,
  onRemoveChoice: PropTypes.func.isRequired,
};

export default Choice;
