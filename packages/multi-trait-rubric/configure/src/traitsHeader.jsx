import React from 'react';
import PropTypes from 'prop-types';

import DragHandle from '@material-ui/icons/DragHandle';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { withStyles } from '@material-ui/core/styles';

import EditableHtml from '@pie-lib/editable-html';

const styles = {
  actions: {
    visibility: 'hidden'
  },
  traitTile: {
    width: '100%',
    backgroundColor: 'white',
    marginTop: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'flex-start'
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  label: {
    textAlign: 'center',
    width: '80%',
    border: 'none',
    margin: '8px',
    padding: '10px 0'
  },
  editableLabel: {
    textAlign: 'left'
  },
  subLabel: {
    paddingBottom: '16px'
  }
};

class TraitsHeaderTile extends React.Component {
  onScorePointLabelChange = ({ scorePointLabel, value }) => {
    const { scorePointsLabels, onScaleChange } = this.props;

    scorePointsLabels[value] = scorePointLabel;

    onScaleChange({ scorePointsLabels });
  };

  render() {
    const {
      scorePointsValues,
      scorePointsLabels,
      traitLabel,
      classes,
      onTraitLabelChange,
    } = this.props;
    const pluginProps = {
      image: { disabled: true },
      math: { disabled: true }
    };

    return (
      <div className={classes.traitTile}>
        <span><DragHandle className={classes.actions}/></span>

        <div className={classes.label}>
          <div className={classes.subLabel}>Trait Label</div>
          <EditableHtml
            className={classes.editableLabel}
            markup={traitLabel || 'Label'}
            onChange={onTraitLabelChange}
            placeholder='Trait Label'
            pluginProps={pluginProps}
          />
        </div>

        <div className={classes.label}>
          Standard(s)
        </div>

        <div className={classes.label}>
          Description
        </div>

        {scorePointsValues.map((scorePointsValue, index) => {
          const value = scorePointsValues.length - index - 1;
          let scoreDescriptor;

          try {
            scoreDescriptor = scorePointsLabels[value] || '';
          } catch (e) {
            scoreDescriptor = '';
          }

          return (
            <div
              className={classes.label}
              key={`score-point-label-${index}`}
            >
              <div className={classes.subLabel}>
                {scorePointsValue}
              </div>

              <EditableHtml
                className={classes.editableLabel}
                markup={scoreDescriptor}
                placeholder='Label'
                onChange={scorePointLabel => this.onScorePointLabelChange({ scorePointLabel, value })}
                pluginProps={pluginProps}
              />
            </div>
          )
        })}

        <div className={classes.controls}>
          <IconButton color='default'>
            <RemoveCircle classes={{ root: classes.actions }}/>
          </IconButton>
        </div>
      </div>
    );
  }
}

TraitsHeaderTile.propTypes = {
  classes: PropTypes.object.isRequired,
  onTraitLabelChange: PropTypes.func,
  onScaleChange: PropTypes.func,
  scorePointsValues: PropTypes.arrayOf(PropTypes.number),
  scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
  traitLabel: PropTypes.string,
};

export default withStyles(styles)(TraitsHeaderTile);
