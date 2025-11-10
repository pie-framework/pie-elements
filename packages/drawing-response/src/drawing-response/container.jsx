import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Translator from '@pie-lib/translator';

import constants from './constants';
import Button from './button';
import DrawablePalette from './drawable-palette';
import DrawableMain from './drawable-main';
import DrawableText from './drawable-text';
import Icon from './icon';

const { tools: TOOLS } = constants;
const { translator } = Translator;

const BaseContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Box = styled('div')(({ theme }) => ({
  border: '1px solid #E0E1E6',
  borderRadius: '5px',
  marginTop: theme.spacing(2),
  backgroundColor: '#ECEDF1',
}));

const DrawableHeight = styled('div')({
  minHeight: 350,
  backgroundColor: '#fff',
});

const Toolbar = styled('div')(({ theme }) => ({
  borderBottom: '1px solid #E0E1E6',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  padding: '12px 8px 4px',
  boxSizing: 'border-box',
  maxWidth: 'calc(100% - 163px)', // 163px is the width set on undoControls
  '& button': {
    marginBottom: theme.spacing(1),
  },
}));

const ROGVAIV = ['red', 'orange', 'yellow', 'violet', 'blue', 'green', 'white', 'black'].map((c) => ({
  value: c,
  label: c,
}));

export class Container extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func.isRequired,
    imageDimensions: PropTypes.object.isRequired,
    imageUrl: PropTypes.string.isRequired,
    backgroundImageEnabled: PropTypes.bool.isRequired,
    language: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const TextEntry = new DrawableText();

    this.state = {
      scale: 1,
      drawableDimensions: {
        height: 0,
        width: 0,
      },
      toolActive: TOOLS[0],
      fillColor: 'white',
      fillColorList: [
        { value: 'transparent', label: 'no fill' },
        { value: 'lightblue', label: 'light blue' },
        { value: 'lightyellow', label: 'light yellow' },
        ...ROGVAIV,
      ],
      outlineColor: 'black',
      outlineColorList: ROGVAIV,
      paintColor: 'red',
      paintColorList: ROGVAIV,
      TextEntry,
    };
  }

  setTranslatedState(language) {
    const translatedROGVAIV = ROGVAIV.map((c) => ({
      value: c.value,
      label: translator.t(`drawingResponse.${c.label}`, { lng: language }),
    }));

    this.setState({
      fillColorList: [
        { value: 'transparent', label: translator.t('drawingResponse.noFill', { lng: language }) },
        { value: 'lightblue', label: translator.t('drawingResponse.lightblue', { lng: language }) },
        { value: 'lightyellow', label: translator.t('drawingResponse.lightyellow', { lng: language }) },
        ...translatedROGVAIV,
      ],
      paintColor: translator.t('drawingResponse.red', { lng: language }),
      outlineColorList: translatedROGVAIV,
      paintColorList: translatedROGVAIV,
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { language } = props;
    this.setTranslatedState(language);
  }

  setDimensions() {
    const checkExist = setInterval(() => {
      try {
        const { height, width } = this.drawable.getBoundingClientRect();
        const effectiveWidth = this.props.session.width || width;

        if (height !== 0 && width !== 0) {
          this.setState({
            drawableDimensions: {
              height,
              width: effectiveWidth,
            },
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('setDimensions Error: ', e);
      } finally {
        clearInterval(checkExist);
      }
    }, 100);
  }

  componentDidMount() {
    const { language } = this.props;
    this.setTranslatedState(language);

    this.setDimensions();

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const target = document.getElementById('question-container')?.style?.cssText;
        const zoom = target?.substring(target.indexOf('--pie-zoom') + 11, target.lastIndexOf('%'));
        const zoomParsed = zoom?.replace(/\s/g, '');

        if (zoomParsed) {
          const newScale = parseFloat(zoomParsed) / 100;
          if (newScale !== this.state.scale) {
            this.setState({
              scale: parseFloat(zoomParsed) / 100,
            });
          }
        } else if (!zoomParsed && this.state.scale !== 1) {
          this.setState({
            scale: 1,
          });
        }
      });
    });

    // Use ResizeObserver to detect when the drawable container becomes visible
    // (e.g., after switching from build to item preview in New Item Bank) and trigger dimension calculation.
    // This helps ensure the canvas is properly sized even when componentDidMount is not re-triggered.
    this.resizeObserver = new ResizeObserver(() => {
      this.setDimensions();
    });

    if (this.drawable) {
      this.resizeObserver.observe(this.drawable);
    }

    const target = document.getElementById('question-container');
    if (target) {
      this.observer.observe(target, { attributes: true, attributeFilter: ['style'] });
    }
  }

  componentWillUnmount() {
    const { TextEntry } = this.state;

    TextEntry.removeEventListeners();
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  handleMakeToolActive(tool) {
    const { TextEntry } = this.state;
    const { type } = tool;
    const { language } = this.props;

    if (type !== 'Text') {
      this.setState({
        toolActive: tool,
      });
    } else {
      TextEntry.addNewTextEntry(language);
      // Force update
      this.setState({
        updatedAt: new Date(),
      });
    }
  }

  checkIfToolIsDisabled = (type) => {
    if (this.props.disabled) return true;

    const { toolActive } = this.state;
    // Text will never be disabled since on each "Text Entry" click a new text is added
    if (type === 'Text') {
      return false;
    }
    return type === toolActive.type;
  };

  handleColorChange(type, color) {
    const cType = `${type}Color`;
    this.setState({
      [cType]: color,
    });
  }

  render() {
    const { disabled, imageUrl, imageDimensions, onSessionChange, session, backgroundImageEnabled, language } =
      this.props;
    const {
      drawableDimensions,
      toolActive,
      fillColor,
      fillColorList,
      outlineColor,
      outlineColorList,
      paintColor,
      paintColorList,
      TextEntry,
    } = this.state;

    const heightToUse = drawableDimensions.height * this.state.scale;

    return (
      <BaseContainer>
        {!disabled && (
          <DrawablePalette
            fillColor={fillColor}
            fillList={fillColorList}
            outlineColor={outlineColor}
            outlineList={outlineColorList}
            paintColor={paintColor}
            paintList={paintColorList}
            onFillColorChange={(color) => this.handleColorChange('fill', color)}
            onOutlineColorChange={(color) => this.handleColorChange('outline', color)}
            onPaintColorChange={(color) => this.handleColorChange('paint', color)}
            language={language}
          />
        )}

        <Box>
          <Toolbar>
            {TOOLS.map((tool) => {
              const { type, label, icon } = tool;

              return (
                <Button
                  title={label}
                  key={type}
                  disabled={this.checkIfToolIsDisabled(type)}
                  onClick={() => this.handleMakeToolActive(tool)}
                  label={<Icon path={icon} />}
                />
              );
            })}
          </Toolbar>

          <DrawableHeight
            ref={(drawable) => {
              this.drawable = drawable;
            }}
            style={{ height: heightToUse, maxHeight: heightToUse, overflow: 'scroll' }}
          >
            <DrawableMain
              scale={this.state.scale}
              session={session}
              disabled={disabled}
              onSessionChange={onSessionChange}
              fillColor={fillColor}
              outlineColor={outlineColor}
              paintColor={paintColor}
              imageUrl={imageUrl}
              drawableDimensions={drawableDimensions}
              imageDimensions={imageDimensions}
              toolActive={toolActive}
              TextEntry={TextEntry}
              backgroundImageEnabled={backgroundImageEnabled}
              language={language}
            />
          </DrawableHeight>
        </Box>
      </BaseContainer>
    );
  }
}

export default Container;
