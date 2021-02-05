import React from 'react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

export const MultiTraitButton = withStyles({
  button: {
    fontSize: '16px',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '11px 16px',
    width: '114px',
    background: '#f8f8f8',
    borderRadius: '4px',
    justifyContent: 'space-around',
    color: '#050F2D',
    cursor: 'pointer'
  }
})(({ classes, children, onClick }) => (
  <div className={classes.button} onClick={onClick}>
    <strong>+</strong>
    <div>{children}</div>
  </div>
));

export const PrimaryBlock = withStyles({
  primaryBlock: {
    width: '200px',
    minWidth: '200px',
    position: 'relative',
    padding: '8px'
  }
})(({ classes, children }) => (
  <div className={classes.primaryBlock}>
    {children}
  </div>
));

export const Block = withStyles({
  block: {
    width: '180px',
    minWidth: '180px',
    padding: '8px'
  }
})(({ classes, children }) => (
  <div className={classes.block}>
    {children}
  </div>
));
export const SecondaryBlock = withStyles({
  secondaryBlock: {
    display: 'flex',
    overflowX: 'scroll',
    alignItems: 'flex-end',
    // this is needed to show the editor toolbar:
    paddingBottom: '22px'
  }
})(({ classes, children }) => (
  <div className={classes.secondaryBlock}>
    {children}
  </div>
));


export const Row = withStyles({
  row: {
    display: 'flex',
    margin: '4px 0'
  }
})(({ classes, children, className }) => (
  <div className={classnames(classes.row, className)}>
    {children}
  </div>
));

export const ScorePoint = withStyles({
  scorePointBoxWrapper: {
    padding: '0 10px'
  },
  scorePointBox: {
    display: 'flex',
    borderRadius: '4px',
    background: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc'
  },
  subLabel: {
    width: '24px',
    textAlign: 'center'
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
  slateEditor: {
    fontFamily: 'Cerebri',
  },
})(({ classes, scorePointsValue, scoreDescriptor, pluginProps, onChange }) => (
  <div className={classes.scorePointBoxWrapper}>
    <div className={classes.scorePointBox}>
      <div className={classes.subLabel}>
        {scorePointsValue}
      </div>

      <EditableHtml
        className={classes.editableLabel}
        classes={{ slateEditor: classes.slateEditor }}
        markup={scoreDescriptor}
        placeholder='Label'
        onChange={onChange}
        pluginProps={pluginProps}
      />
    </div>
  </div>
));


const maxScoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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

export const MaxPointsPicker = withStyles({})(({ classes, maxPoints, onChange }) => (
  <FormControl>
    <InputLabel>
      Max Points
    </InputLabel>
    <Select
      value={maxPoints}
      onChange={onChange}
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
));

export const SimpleInput = withStyles({
  simpleInput: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '12px 0'
  },
  editableLevel: {
    background: 'white',
    width: '60%'
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
})(({ classes, markup, onChange, pluginProps, label }) => (
  <div className={classes.simpleInput}>
    {label && <div>{label}</div>}

    <EditableHtml
      className={classes.editableLevel}
      classes={{ slateEditor: classes.slateEditor }}
      markup={markup}
      onChange={onChange}
      placeholder='Trait Label'
      pluginProps={pluginProps}
    />
  </div>
));

export const UnderlinedInput = withStyles({
  underlinedInputWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editableLevel: {
    background: 'white',
    width: '100%',

    '& div': {
      padding: 0
    },

    '& > div': {
      border: 'none',
      borderBottom: '1px solid #ccc',
      borderRadius: 0,
      padding: '8px'
    },
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
})(({ classes, markup, onChange, pluginProps, label, placeholder }) => (
  <div className={classes.underlinedInputWrapper}>
    {label && <div>{label}</div>}

    <EditableHtml
      className={classes.editableLevel}
      classes={{ slateEditor: classes.slateEditor }}
      markup={markup}
      onChange={onChange}
      placeholder={placeholder}
      pluginProps={pluginProps}
    />
  </div>
));


export const ExpandedInput = withStyles({
  slateEditor: {
    fontFamily: 'Cerebri',
    height: '120px',
    padding: 0
  },
  prompt: {
    border: 'none',
    margin: '10px'
  },
})(({ classes, markup, onChange, pluginProps, placeholder }) => (
  <div>
    <EditableHtml
      className={classes.prompt}
      classes={{ slateEditor: classes.slateEditor }}
      markup={markup}
      onChange={onChange}
      placeholder={placeholder}
      pluginProps={pluginProps}
    />
  </div>
));

export const ScaleSettings = withStyles({
  scaleSettings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
})(({ classes, children }) => (
  <div className={classes.scaleSettings}>
    {children}
  </div>
));



