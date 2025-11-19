import React from 'react';

import { styled } from '@mui/material/styles';
import EditableHtml from '@pie-lib/editable-html';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import { color, InputContainer } from '@pie-lib/render-ui';
import { filteredDefaultPlugins } from './utils';
import { grey } from '@mui/material/colors';

const InputHeight = '120px';
export const BlockWidth = 200;
export const PrimaryBlockWidth = 200;
export const DragHandleSpace = 32;
export const HeaderHeight = '100px';
export const HeaderHeightLarge = '160px';
const greyBorder = `solid 1px ${grey[400]}`;
const Padding = '8px 4px';

// global styles for EditableHtml components
const GlobalStyles = styled('div')(({ theme }) => ({
  '& .editable-label': {
    textAlign: 'left',
    flex: 1,
    border: 'none',

    '& div': {
      padding: 0,
      border: 'none',
    },

    '& > div': {
      borderLeft: greyBorder,
      borderRadius: 0,
      padding: Padding,
    },
  },

  '& .editable-level': {
    background: theme.palette.common.white,
    width: '60%',
  },

  '& .underlined-editable-level': {
    background: theme.palette.common.white,
    width: '100%',

    '& div': {
      padding: 0,
      border: 'none',
    },

    '& > div': {
      borderBottom: greyBorder,
      borderRadius: 0,
      padding: Padding,
    },
  },

  '& .expanded-input-prompt': {
    border: 'none',
    margin: '10px',
    marginTop: 0,
  },
}));

const StyledButton = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize + 2,
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  width: '114px',
  background: color.secondaryBackground(),
  borderRadius: '4px',
  justifyContent: 'space-around',
  color: color.text(),
  cursor: 'pointer',
}));

export const MultiTraitButton = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>
    <strong>+</strong>
    <div>{children}</div>
  </StyledButton>
);

export const PrimaryBlock = styled('div')(({ theme }) => ({
  width: `${PrimaryBlockWidth}px`,
  minWidth: `${PrimaryBlockWidth}px`,
  position: 'relative',
  padding: '0 10px',
  boxSizing: 'border-box',
}));

export const Block = styled('div')(({ theme }) => ({
  width: `${BlockWidth}px`,
  minWidth: `${BlockWidth}px`,
  '& ul, ol': {
    marginBlockStart: 0,
    paddingInlineStart: theme.spacing(2),
  },
}));

const StyledSecondaryBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  overflowX: 'hidden',
  alignItems: 'flex-end',
  // this is needed to show the editor toolbar!!!
  paddingBottom: '30px',
}));

export const SecondaryBlock = ({ children, setRef, width }) => (
  <StyledSecondaryBlock style={{ width: width }} ref={setRef}>
    {children}
  </StyledSecondaryBlock>
);

export const Row = (({ children, height }) => (
  <div
    style={{
      display: 'flex',
      height,
    }}
  >
    {children}
  </div>
));

const ScorePointBoxWrapper = styled('div')({
  padding: '0 10px',
});

const ScorePointBox = styled('div')({
  display: 'flex',
  borderRadius: '4px',
  background: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: greyBorder,
});

const ScorePointBoxDisabled = styled('div')({
  display: 'flex',
  borderRadius: '4px',
  background: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  border: '0',
});

const SubLabel = styled('div')({
  width: '24px',
  textAlign: 'center',
});

export const ScorePoint = ({
  error = '',
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
  const ScorePointBoxComponent = showScorePointLabels ? ScorePointBox : ScorePointBoxDisabled;

  return (
    <GlobalStyles>
      <ScorePointBoxWrapper>
        <ScorePointBoxComponent>
          <SubLabel>{scorePointsValue}</SubLabel>

          {showScorePointLabels ? (
            <EditableHtml
              className="editable-label"
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
              slateEditorExtraStyles={{ fontFamily: 'Cerebri' }}
            />
          ) : null}
        </ScorePointBoxComponent>
      </ScorePointBoxWrapper>
    </GlobalStyles>
  );
};

const StyledBootstrapInput = styled(InputBase)(({ theme }) => ({
  '&.MuiInputBase-root': {
    background: theme.palette.common.white,
    marginTop: theme.spacing(1),
    'label + &': {
      width: '80px',
    },
  },
  '& .MuiInputBase-input': {
    borderRadius: '4px',
    position: 'relative',
    border: greyBorder,
    fontSize: theme.typography.fontSize,
    fontFamily: 'Cerebri Sans',
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,

    '&:focus': {
      borderRadius: '4px',
    },
  },
}));

const createMaxScoreOptions = (maxMaxPoints) => Array.from({ length: maxMaxPoints }, (_, i) => i + 1);

export const MaxPointsPicker = ({ maxPoints, onChange, maxMaxPoints }) => (
  <InputContainer label="Max Points">
    <Select
      value={maxPoints}
      onChange={onChange}
      input={<StyledBootstrapInput />}
      MenuProps={{
        transitionDuration: {
          enter: 225,
          exit: 195
        }
      }}
    >
      {createMaxScoreOptions(maxMaxPoints).map((maxScore) => (
        <MenuItem key={`menu-item-${maxScore}`} value={maxScore}>
          {maxScore}
        </MenuItem>
      ))}
    </Select>
  </InputContainer>
);

const SimpleInputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: `${theme.spacing(1.5)} 0`,
}));

export const SimpleInput = ({
  markup,
  onChange,
  pluginProps,
  label,
  spellCheck,
  uploadSoundSupport,
  mathMlOptions = {},
  imageSupport = {},
}) => (
  <GlobalStyles>
    <SimpleInputWrapper>
      {label && <div>{label}</div>}

      <EditableHtml
        className="editable-level"
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
        slateEditorExtraStyles={{ fontFamily: 'Cerebri' }}
      />
    </SimpleInputWrapper>
  </GlobalStyles>
);

const UnderlinedInputWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const UnderlinedInput = ({
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
  <GlobalStyles>
    <UnderlinedInputWrapper>
      {label && <div>{label}</div>}

      <EditableHtml
        className="underlined-editable-level"
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
        slateEditorExtraStyles={{ fontFamily: 'Cerebri' }}
      />
    </UnderlinedInputWrapper>
  </GlobalStyles>
);

export const ExpandedInput = ({
  error,
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
  <GlobalStyles>
    <EditableHtml
      className="expanded-input-prompt"
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
      slateEditorExtraStyles={{
        fontFamily: 'Cerebri',
        height: InputHeight,
        padding: 0
      }}
    />
  </GlobalStyles>
);

export const ScaleSettings = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  paddingBottom: '18px',
  gap: theme.spacing(0.25),
}));

const StyledArrow = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 10,
  cursor: 'pointer',
  right: 0,
  alignItems: 'flex-start',
  justifyContent: 'center',
  background: `linear-gradient(to left, ${theme.palette.common.white}, ${color.background()})`,
  boxSizing: 'border-box',
}));

const StyledInnerGrey = styled('div')(({ theme }) => ({
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
}));

export const Arrow = ({ children, show, width, onClick, left, showLevelTagInput }) => (
  <StyledArrow
    style={{
      height: '-webkit-fill-available',
      display: show ? 'flex' : 'none',
      width: width,
      left: left,
      background: left ? `linear-gradient(to right, white, ${color.background()})` : undefined,
    }}
    onClick={onClick}
  >
    <StyledInnerGrey
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
    </StyledInnerGrey>
  </StyledArrow>
);
