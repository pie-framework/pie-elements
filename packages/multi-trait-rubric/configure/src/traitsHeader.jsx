import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import EditableHtml from '@pie-lib/editable-html';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import Delete from '@material-ui/icons/Delete';

const styles = {
  toolbar: {
    backgroundColor: '#f6f6f6',
    width: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    position: 'relative'
  },
  traitTile: {
    marginTop: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  scorePointBoxWrapper: {
    padding: '0 10px'
  },
  scorePointBox: {
    display: 'flex',
    borderRadius: '4px',
    background: 'white',
    width: '140px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc'
  },
  label: {
    textAlign: 'center',
    width: '140px',
    border: 'none',
    margin: '8px',
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  label1: {
    textAlign: 'center',
    border: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '160px'
  },
  editableLabel: {
    textAlign: 'left',
    flex: 1,
    border: 'none',

    '& div': {
      padding: 0
    },

    '& > div': {
      border: 'none',
      borderLeft: '1px solid #ccc',
      borderRadius: 0,
      padding: '8px'
    },
  },
  editableLevel: {
    background: 'white'
  },
  subLabel: {
    width: '24px',
    textAlign: 'center'
  },
  subLabelMain: {
    width: 'max-content',
    padding: '8px'
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
  delete: {
    fill: 'grey',
    marginLeft: '16px',
    height: '30px',
    width: '30px',
    position: 'absolute',
    top: '4px',
    right: '4px',
    cursor: 'pointer'
  }
};

const inputStyles = {
  root: {
    background: 'white',
    'label + &': {
      marginTop: '20px',
      marginBottom: 0,
      width: '80px'
    },
  },
  input: {
    borderRadius: '4px',
    position: 'relative',
    border: '1px solid #ced4da',
    fontSize: '14px',
    fontFamily: 'Cerebri Sans',
    padding: '8px 12px',

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
      scaleIndex,
      showDeleteScaleModal
    } = this.props;
    const pluginProps = {
      image: { disabled: true },
      math: { disabled: true }
    };

    return (
      <div className={classes.toolbar}>
        <div>
          <Delete
            classes={{ root: classes.delete }}
            onClick={showDeleteScaleModal}
          />
          {showLevelTagInput && (
            <div className={classes.scorePointBoxWrapper}>

              <div className={classNames(classes.subLabel, classes.subLabelMain)}>Level Label</div>

              <EditableHtml
                className={classes.editableLevel}
                classes={{ slateEditor: classes.slateEditor }}
                markup={traitLabel || 'Trait'}
                onChange={onTraitLabelChange}
                placeholder='Trait Label'
                pluginProps={pluginProps}
              />

            </div>
          )}
        </div>
        <div className={classes.traitTile}>
          <div className={classes.label1}>

            <div style={{
              lineHeight: '16px',
              color: '#050F2D'
            }}>Scale {scaleIndex + 1}</div>
            <div style={{ width: '16px' }}/>
            <FormControl className={classes.margin}>
              <InputLabel style={{ width: 'max-content', color: '#050F2D' }}>
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
              <div className={classes.scorePointBoxWrapper}>
                <div
                  className={classes.scorePointBox}
                  key={`score-point-label-${index}`}
                >
                  <div className={classes.subLabel}>
                    {scorePointsValue}
                  </div>

                  <EditableHtml
                    className={classes.editableLabel}
                    classes={{ slateEditor: classes.slateEditor }}
                    markup={scoreDescriptor}
                    placeholder='Label'
                    onChange={scorePointLabel => this.onScorePointLabelChange({ scorePointLabel, value })}
                    pluginProps={pluginProps}
                  />
                </div>
              </div>
            )
          })}
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
