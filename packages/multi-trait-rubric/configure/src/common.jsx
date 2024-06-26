import React from 'react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import {EditableHtml} from '@pie-lib/pie-toolbox/editable-html';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import grey from '@material-ui/core/colors/grey';
import { filteredDefaultPlugins } from './utils';

export const BlockWidth = 200;
export const PrimaryBlockWidth = 200;
export const DragHandleSpace = 32;
export const HeaderHeight = '100px';
export const HeaderHeightLarge = '160px';
const InputHeight = '120px';
const greyBorder = `solid 1px ${grey[400]}`;
const Padding = '8px 4px';

export const MultiTraitButton = withStyles((theme) => ({
  button: {
    fontSize: theme.typography.fontSize + 2,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px`,
    width: '114px',
    background: color.secondaryBackground(),
    borderRadius: '4px',
    justifyContent: 'space-around',
    color: color.text(),
    cursor: 'pointer',
  },
}))(({ classes, children, onClick }) => (
  <div className={classes.button} onClick={onClick}>
    <strong>+</strong>
    <div>{children}</div>
  </div>
));

export const PrimaryBlock = withStyles({
  primaryBlock: {
    width: `${PrimaryBlockWidth}px`,
    minWidth: `${PrimaryBlockWidth}px`,
    position: 'relative',
    padding: '0 10px',
    boxSizing: 'border-box',
  },
})(({ classes, children, className }) => <div className={classnames(classes.primaryBlock, className)}>{children}</div>);

export const Block = withStyles((theme) => ({
  block: {
    width: `${BlockWidth}px`,
    minWidth: `${BlockWidth}px`,
    '& ul, ol': {
      marginBlockStart: 0,
      paddingInlineStart: theme.spacing.unit * 2,
    },
  },
}))(({ classes, children }) => <div className={classes.block}>{children}</div>);

export const SecondaryBlock = withStyles({
  secondaryBlock: {
    display: 'flex',
    overflowX: 'hidden',
    alignItems: 'flex-end',
    // this is needed to show the editor toolbar!!!
    paddingBottom: '30px',
  },
})(({ classes, children, setRef, width }) => (
  <div className={classes.secondaryBlock} style={{ width: width }} ref={setRef}>
    {children}
  </div>
));

export const Row = withStyles({
  row: {
    display: 'flex',
  },
})(({ classes, children, className, height }) => (
  <div
    className={classnames(classes.row, className)}
    style={{
      height,
    }}
  >
    {children}
  </div>
));

const scorePointsStyles = (theme) => ({
  scorePointBoxWrapper: {
    padding: '0 10px',
  },
  scorePointBox: {
    display: 'flex',
    borderRadius: '4px',
    background: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: greyBorder,
  },
  scorePointBoxDisabled: {
    background: 'none',
    justifyContent: 'center',
    border: '0',
  },
  subLabel: {
    width: '24px',
    textAlign: 'center',
  },
  editableLabel: {
    textAlign: 'left',
    flex: 1,
    border: 'none',

    '& div': {
      padding: 0,
    },

    '& > div': {
      border: 'none',
      borderLeft: greyBorder,
      borderRadius: 0,
      padding: Padding,
    },
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
})

export const ScorePoint = withStyles((theme) => ({
  scorePointBoxWrapper: {
    padding: '0 10px',
  },
  scorePointBox: {
    display: 'flex',
    borderRadius: '4px',
    background: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: greyBorder,
  },
  scorePointBoxDisabled: {
    background: 'none',
    justifyContent: 'center',
    border: '0',
  },
  subLabel: {
    width: '24px',
    textAlign: 'center',
  },
  editableLabel: {
    textAlign: 'left',
    flex: 1,
    border: 'none',

    '& div': {
      padding: 0,
    },

    '& > div': {
      border: 'none',
      borderLeft: greyBorder,
      borderRadius: 0,
      padding: Padding,
    },
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
}))(
  ({
     classes, error = '',
     scorePointsValue,
     scoreDescriptor,
     pluginProps,
     onChange,
     showScorePointLabels,
     alignToRight,
     spellCheck,
     uploadSoundSupport,
     imageSupport = {},
     mathMlOptions = {},
   }) => {
    const scoreBoxClasses = showScorePointLabels
      ? classes.scorePointBox
      : `${classes.scorePointBox} ${classes.scorePointBoxDisabled}`;

    return (
      <div className={classes.scorePointBoxWrapper}>
        <div className={scoreBoxClasses}>
          <div className={classes.subLabel}>{scorePointsValue}</div>

          {showScorePointLabels ? (
            <EditableHtml
              className={classes.editableLabel}
              classes={{ slateEditor: classes.slateEditor }}
              error={error}
              markup={scoreDescriptor}
              placeholder=" Enter Label"
              onChange={onChange}
              pluginProps={pluginProps}
              activePlugins={filteredDefaultPlugins}
              spellCheck={spellCheck}
              toolbarOpts={alignToRight ? { alignment: 'right' } : {}}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
              imageSupport={imageSupport}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

const inputStyles = (theme) => ({
  root: {
    background: theme.palette.common.white,
    'label + &': {
      marginTop: theme.spacing.unit * 2.5,
      marginBottom: 0,
      width: '80px',
    },
  },
  input: {
    borderRadius: '4px',
    position: 'relative',
    border: greyBorder,
    fontSize: theme.typography.fontSize,
    fontFamily: 'Cerebri Sans',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,

    '&:focus': {
      borderRadius: '4px',
    },
  },
});

const BootstrapInput = withStyles(inputStyles)(InputBase);

const createMaxScoreOptions = (maxMaxPoints) => Array.from({ length: maxMaxPoints }, (_, i) => i + 1)

export const MaxPointsPicker = withStyles({})(({ maxPoints, onChange, maxMaxPoints }) => (
  <FormControl>
    <InputLabel>Max Points</InputLabel>
    <Select value={maxPoints} onChange={onChange} input={<BootstrapInput/>}>
      {createMaxScoreOptions(maxMaxPoints).map((maxScore) => (
        <MenuItem key={`menu-item-${maxScore}`} value={maxScore}>
          {maxScore}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));

export const SimpleInput = withStyles((theme) => ({
  simpleInput: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `${theme.spacing.unit * 1.5}px 0`,
  },
  editableLevel: {
    background: theme.palette.common.white,
    width: '60%',
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
}))(({ classes, markup, onChange, pluginProps, label, spellCheck, uploadSoundSupport, mathMlOptions = {}, imageSupport={} }) => (
  <div className={classes.simpleInput}>
    {label && <div>{label}</div>}

    <EditableHtml
      className={classes.editableLevel}
      classes={{ slateEditor: classes.slateEditor }}
      markup={markup}
      onChange={onChange}
      placeholder="Trait Label"
      pluginProps={pluginProps}
      activePlugins={filteredDefaultPlugins}
      spellCheck={spellCheck}
      uploadSoundSupport={uploadSoundSupport}
      languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
      mathMlOptions={mathMlOptions}
      imageSupport={imageSupport}
    />
  </div>
));

export const UnderlinedInput = withStyles((theme) => ({
  underlinedInputWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editableLevel: {
    background: theme.palette.common.white,
    width: '100%',

    '& div': {
      padding: 0,
    },

    '& > div': {
      border: 'none',
      borderBottom: greyBorder,
      borderRadius: 0,
      padding: Padding,
    },
  },
  slateEditor: {
    fontFamily: 'Cerebri',
  },
}))(
  ({
     classes,
     error,
     markup,
     onChange,
     pluginProps,
     label,
     placeholder,
     spellCheck,
     uploadSoundSupport,
     imageSupport = {},
     mathMlOptions = {},
   }) => (
    <div className={classes.underlinedInputWrapper}>
      {label && <div>{label}</div>}

      <EditableHtml
        className={classes.editableLevel}
        classes={{ slateEditor: classes.slateEditor }}
        error={error}
        markup={markup}
        onChange={onChange}
        placeholder={placeholder}
        pluginProps={pluginProps}
        activePlugins={filteredDefaultPlugins}
        spellCheck={spellCheck}
        uploadSoundSupport={uploadSoundSupport}
        languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
        mathMlOptions={mathMlOptions}
        imageSupport={imageSupport}
      />
    </div>
  ),
);

export const ExpandedInput = withStyles({
  slateEditor: {
    fontFamily: 'Cerebri',
    height: InputHeight,
    padding: 0,
  },
  prompt: {
    border: 'none',
    margin: '10px',
    marginTop: 0,
  },
})(
  ({
     classes, error,
     markup,
     onChange,
     pluginProps,
     placeholder,
     alignToRight,
     spellCheck,
     uploadSoundSupport,
     mathMlOptions = {},
     imageSupport = {},
   }) => (
    <div>
      <EditableHtml
        className={classes.prompt}
        classes={{ slateEditor: classes.slateEditor }}
        error={error}
        markup={markup}
        onChange={onChange}
        placeholder={placeholder}
        pluginProps={pluginProps}
        toolbarOpts={alignToRight ? { alignment: 'right' } : {}}
        spellCheck={spellCheck}
        uploadSoundSupport={uploadSoundSupport}
        languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
        autoWidthToolbar
        mathMlOptions={mathMlOptions}
        imageSupport={imageSupport}
      />
    </div>
  ),
);

export const ScaleSettings = withStyles({
  scaleSettings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
})(({ classes, children }) => <div className={classes.scaleSettings}>{children}</div>);

export const Arrow = withStyles((theme) => ({
  arrow: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: `linear-gradient(to left, ${theme.palette.common.white}, ${color.background()})`,
    boxSizing: 'border-box',
  },
  innerGrey: {
    position: 'absolute',
    zIndex: 11,
    cursor: 'pointer',
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: `linear-gradient(to left, ${theme.palette.common.white}, ${color.background()})`,
    boxSizing: 'border-box',

    '& svg': {
      position: 'absolute',
      bottom: '-24px',
    },
  },
}))(({ classes, children, className, show, width, onClick, left, showLevelTagInput }) => (
  <div
    className={classnames(classes.arrow, className)}
    style={{
      height: '-webkit-fill-available',
      display: show ? 'flex' : 'none',
      width: width,
      left: left,
      background: left ? `linear-gradient(to right, white, ${color.background()})` : undefined,
    }}
    onClick={onClick}
  >
    <div
      className={classnames(classes.innerGrey, className)}
      style={{
        display: show ? 'flex' : 'none',
        width: width,
        height: showLevelTagInput ? HeaderHeightLarge : HeaderHeight,
        left: 0,
        background: left
          ? `linear-gradient(to right, ${color.secondaryBackground()}, ${color.background()})`
          : undefined,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  </div>
));
