import React from 'react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import { color } from '@pie-lib/render-ui';
import grey from '@material-ui/core/colors/grey';
import {filteredDefaultPlugins} from './utils';

export const BlockWidth = 200;
export const PrimaryBlockWidth = 200;
export const DragHandleSpace = 32;
export const HeaderHeight = '100px';
export const HeaderHeightLarge = '160px';
const InputHeight = '120px';
const greyBorder = `solid 1px ${grey[400]}`;
const Padding = '8px 4px';

export const MultiTraitButton = withStyles({
  button: {
    fontSize: '16px',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '11px 16px',
    width: '114px',
    background: color.secondaryBackground(),
    borderRadius: '4px',
    justifyContent: 'space-around',
    color: color.text(),
    cursor: 'pointer'
  }
})(({ classes, children, onClick }) => (
  <div
    className={classes.button}
    onClick={onClick}
  >
    <strong>+</strong>
    <div>{children}</div>
  </div>
));

export const PrimaryBlock = withStyles({
  primaryBlock: {
    width: `${PrimaryBlockWidth}px`,
    minWidth: `${PrimaryBlockWidth}px`,
    position: 'relative',
    padding: Padding,
    boxSizing: 'border-box',
  }
})(({ classes, children, className }) => (
  <div className={classnames(classes.primaryBlock, className)}>
    {children}
  </div>
));

export const Block = withStyles({
  block: {
    width: `${BlockWidth}px`,
    minWidth: `${BlockWidth}px`,
    padding: Padding,

    '& ul, ol': {
      marginBlockStart: 0,
      paddingInlineStart: '16px'
    }
  },
})(({ classes, children }) => (
  <div className={classes.block}>
    {children}
  </div>
));

export const SecondaryBlock = withStyles({
  secondaryBlock: {
    display: 'flex',
    overflowX: 'hidden',
    alignItems: 'flex-end',
    // this is needed to show the editor toolbar!!!
    paddingBottom: '22px'
  }
})(({ classes, children, setRef, width }) => (
  <div className={classes.secondaryBlock} style={{ width: width }} ref={setRef}>
    {children}
  </div>
));

export const Row = withStyles({
  row: {
    display: 'flex',
    margin: '4px 0',
  }
})(({ classes, children, className, height }) => (
  <div
    className={classnames(classes.row, className)}
    style={{
      height
    }}
  >
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
    border: greyBorder
  },
  scorePointBoxDisabled: {
    background: 'none',
    justifyContent: 'center',
    border: '0'
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
      borderLeft: greyBorder,
      borderRadius: 0,
      padding: Padding
    },
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
})(({ classes, scorePointsValue, scoreDescriptor, pluginProps, onChange, showScorePointLabels, alignToRight }) => {

  const scoreBoxClasses =
    showScorePointLabels ? classes.scorePointBox : `${classes.scorePointBox} ${classes.scorePointBoxDisabled}`;

  return (
    <div className={classes.scorePointBoxWrapper}>
      <div className={scoreBoxClasses}>
        <div className={classes.subLabel}>
          {scorePointsValue}
        </div>

        {showScorePointLabels ? <EditableHtml
          className={classes.editableLabel}
          classes={{ slateEditor: classes.slateEditor }}
          markup={scoreDescriptor}
          placeholder='Label'
          onChange={onChange}
          pluginProps={pluginProps}
          activePlugins={filteredDefaultPlugins}
          toolbarOpts={alignToRight && { alignment: 'right' }}
        /> : null}
      </div>
    </div>
  );
});

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
    border: greyBorder,
    fontSize: '14px',
    fontFamily: 'Cerebri Sans',
    padding: '8px 12px',

    '&:focus': {
      borderRadius: '4px',
    }
  },
};

const BootstrapInput = withStyles(inputStyles)(InputBase);

export const MaxPointsPicker = withStyles({})(({ maxPoints, onChange }) => (
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
      activePlugins={filteredDefaultPlugins}
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
      borderBottom: greyBorder,
      borderRadius: 0,
      padding: Padding
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
      activePlugins={filteredDefaultPlugins}
    />
  </div>
));


export const ExpandedInput = withStyles({
  slateEditor: {
    fontFamily: 'Cerebri',
    height: InputHeight,
    padding: 0
  },
  prompt: {
    border: 'none',
    margin: '10px',
    marginTop: 0
  },
})(({ classes, markup, onChange, pluginProps, placeholder, alignToRight }) => (
  <div>
    <EditableHtml
      className={classes.prompt}
      classes={{ slateEditor: classes.slateEditor }}
      markup={markup}
      onChange={onChange}
      placeholder={placeholder}
      pluginProps={pluginProps}
      toolbarOpts={alignToRight && { alignment: 'right' }}
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

export const Arrow = withStyles({
  arrow: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: `linear-gradient(to left, white, ${color.background()})`,
    boxSizing: 'border-box',
    padding: '4px 0'
  },
  innerGrey: {
    position: 'absolute',
    zIndex: 11,
    cursor: 'pointer',
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: `linear-gradient(to left, white, ${color.background()})`,
    boxSizing: 'border-box',

    '& svg': {
      position: 'absolute',
      bottom: '-24px'
    }
  }
})(({ classes, children, className, show, width, onClick, left, showLevelTagInput }) => (

  <div className={classnames(classes.arrow, className)}
       style={{
         height: '-webkit-fill-available',
         display: show ? 'flex' : 'none',
         width: width,
         left: left,
         background: left ? `linear-gradient(to right, white, ${color.background()})` : undefined
       }}
       onClick={onClick}
  >
    <div className={classnames(classes.innerGrey, className)}
         style={{
           display: show ? 'flex' : 'none',
           width: width,
           height: showLevelTagInput ? HeaderHeightLarge : HeaderHeight,
           left: 0,
           background: left ? `linear-gradient(to right, ${color.secondaryBackground()}, ${color.background()})` : undefined
         }}
         onClick={onClick}
    >
      {children}
    </div>
  </div>

));
