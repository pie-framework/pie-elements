import React from 'react';
import PropTypes from 'prop-types';

import DragHandle from '@material-ui/icons/DragHandle';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { withStyles } from '@material-ui/core/styles';

import EditableHtml from '@pie-lib/editable-html';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

const styles = {
  actions: {
    visibility: 'hidden'
  },
  traitTile: {
    width: '100%',
    backgroundColor: '#f6f6f6',
    marginTop: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
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
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  label1: {
    textAlign: 'center',
    width: '80%',
    border: 'none',
    margin: '8px',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  editableLabel: {
    textAlign: 'left'
  },
  subLabel: {
    paddingBottom: '16px'
  }
};

const inputStyles = {
  root: {
    'label + &': {
      marginTop: '24px',
      marginBottom: '24px',
      width: '60px'
    },
  },
  input: {
    borderRadius: '4px',
    position: 'relative',
    border: '1px solid #ced4da',
    fontSize: '16px',
    padding: '10px 26px 10px 12px',

    '&:focus': {
      borderRadius: '4px',
    }
  },
};


const BootstrapInput = withStyles(inputStyles)(InputBase);


export class TraitsHeaderTile extends React.Component {
  onScorePointLabelChange = ({ scorePointLabel, value }) => {
    const { scorePointsLabels, onScaleChange } = this.props;

    if (value < 0 || value >= scorePointsLabels.length) return;

    scorePointsLabels[value] = scorePointLabel;

    onScaleChange({ scorePointsLabels });
  };

  render() {
    const {
      scorePointsValues,
      scorePointsLabels,
      traitLabel,
      classes,
      showStandards,
      onTraitLabelChange,
      showDescription,
      showLevelTagInput,
      maxPoints,
      maxScoreOptions,
      updateMaxPointsFieldValue,
      scaleIndex
    } = this.props;
    const pluginProps = {
      image: { disabled: true },
      math: { disabled: true }
    };

    return (
      <div className={classes.traitTile}>
        <span><DragHandle className={classes.actions}/></span>

        <div className={classes.label1}>
          {showLevelTagInput && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
              <div className={classes.subLabel}>Trait Label</div>
              <EditableHtml
                className={classes.editableLabel}
                markup={traitLabel || 'Trait'}
                onChange={onTraitLabelChange}
                placeholder='Trait Label'
                pluginProps={pluginProps}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <h4>Scale #{scaleIndex}</h4>
            <div style={{ width: '24px' }}/>
            <FormControl className={classes.margin}>
              <InputLabel>
                Max Points
              </InputLabel>
              <Select
                value={maxPoints}
                onChange={updateMaxPointsFieldValue}
                input={<BootstrapInput/>}
              >
                {(maxScoreOptions || []).map(maxScore => (
                  <MenuItem
                    key={`menu-item-${maxScore}`}
                    value={maxScore}
                  >
                    {maxScore}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {showStandards && (
          <div className={classes.label}>
            Standard(s)
          </div>
        )}

        {showDescription && (
          <div className={classes.label}>
            Description
          </div>
        )}

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
  showStandards: PropTypes.bool,
  showLevelTagInput: PropTypes.bool,
  showDescription: PropTypes.bool,
};

export default withStyles(styles)(TraitsHeaderTile);
