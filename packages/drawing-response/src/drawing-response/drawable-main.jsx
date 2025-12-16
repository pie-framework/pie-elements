import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { Layer, Stage } from 'react-konva';
import { styled } from '@mui/material/styles';
import Translator from '@pie-lib/translator';

const { translator } = Translator;
import ImageBackground from './drawable-image';
import Button from './button';
import factory from './factory';

const Wrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
});

const Base = styled('div')({
  position: 'relative',
  width: '100%',
});

const UndoControls = styled('div')({
  marginTop: -43,
  marginRight: 10,
  position: 'absolute',
});

export class DrawableMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawables: [],
      newDrawable: [],
      textIsSelected: false,
    };
    this.stage = null;
    this.layer = null;
  }

  componentWillUnmount() {
    // Clean up refs to prevent React Konva errors
    this.stage = null;
    this.layer = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.session) {
      const { TextEntry } = nextProps;
      const { drawables: currentDrawables } = this.state;

      if (nextProps.session.drawables) {
        const newDrawables = cloneDeep(nextProps.session.drawables);
        const drawablesString = JSON.stringify(currentDrawables);
        const sessionDrawableString = JSON.stringify((newDrawables || []).map((drawable) => omit(drawable, 'type')));

        if (drawablesString !== sessionDrawableString) {
          const drawableArray = nextProps.session.drawables;

          this.setState({
            drawables: drawableArray.map((drawable) => factory(drawable.type, drawable)),
          });
        }

        const currentTexts = TextEntry.all.map((text) => ({
          ...text,
          ...(TextEntry[`text_${text.id}`] && TextEntry[`text_${text.id}`].attrs),
          value: TextEntry[`textarea_${text.id}`] && TextEntry[`textarea_${text.id}`].value,
        }));

        if (!isEqual(currentTexts, nextProps.session.texts)) {
          TextEntry.setAll(nextProps.session.texts || []);
        }
      }
    } else {
      this.handleSessionChange();
    }
  }

  handleSessionChange = () => {
    const { onSessionChange, session, TextEntry, drawableDimensions } = this.props;
    const { drawables } = this.state;

    const newSession = {
      width: drawableDimensions.width,
      drawables: drawables.map((d) => d.toJson()),
      texts: TextEntry.all.map((text) => ({
        ...text,
        ...(TextEntry[`text_${text.id}`] && TextEntry[`text_${text.id}`].attrs),
        value: TextEntry[`textarea_${text.id}`] && TextEntry[`textarea_${text.id}`].value,
      })),
    };

    if (!isEqual(newSession, session)) {
      onSessionChange({
        ...session,
        ...newSession,
      });
    }
  };

  onMouseOverElement = () => this.setState({ isOver: true });

  onMouseOutElement = () => this.setState({ isOver: false });

  handleMouseDown = (e) => {
    // ONLY IF MOBILE?
    document.body.style.overflow = 'hidden';

    const { newDrawable, textIsSelected } = this.state;
    const { toolActive, fillColor, outlineColor, scale } = this.props;

    if (newDrawable.length === 0 && !textIsSelected) {
      const stage = e.target.getStage();
      if (!stage) return;

      const { x, y } = stage.getPointerPosition();

      const newDrawable = factory(toolActive.type, {
        startx: x / scale,
        starty: y / scale,
        fillColor,
        outlineColor,
        createdAt: new Date(),
      });

      this.setState({
        newDrawable: [newDrawable],
      });
    }
  };

  handleMouseUp = (e) => {
    // ONLY IF MOBILE?
    document.body.style.overflow = 'initial';

    const { newDrawable, drawables } = this.state;
    const { scale } = this.props;

    if (newDrawable.length === 1) {
      const stage = e.target.getStage();
      if (!stage) return;

      const { x, y } = stage.getPointerPosition();
      const drawableToAdd = newDrawable[0];

      drawableToAdd.registerMovement(x / scale, y / scale);
      drawables.push(drawableToAdd);

      this.setState(
        {
          newDrawable: [],
          drawables,
        },
        this.handleSessionChange.bind(this, drawableToAdd),
      );
    }
  };

  handleMouseMove = (e) => {
    const { newDrawable } = this.state;
    const { scale } = this.props;

    if (newDrawable.length === 1) {
      const stage = e.target.getStage();
      if (!stage) return;

      const { x, y } = stage.getPointerPosition();
      const updatedNewDrawable = newDrawable[0];

      updatedNewDrawable.registerMovement(x / scale, y / scale);

      this.setState({
        newDrawable: [updatedNewDrawable],
      });
    }
  };

  handleUndo = () => {
    const { drawables } = this.state;
    const { TextEntry } = this.props;

    const newDrawables = [...drawables];
    const allData = [...drawables, ...TextEntry.all];

    allData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const lastElement = allData[allData.length - 1];

    if (lastElement && lastElement.type === 'text-entry') {
      TextEntry.all.pop();
      this.setState({ updatedAt: new Date() }, this.handleSessionChange);
    } else {
      newDrawables.pop();
      this.setState({ drawables: newDrawables }, this.handleSessionChange);
    }
  };

  handleClearAll = () => {
    const { TextEntry } = this.props;

    TextEntry.all = [];
    this.setState({ drawables: [], updatedAt: new Date() }, this.handleSessionChange);
  };

  toggleTextSelected = (textIsSelected) => this.setState({ textIsSelected });

  render() {
    const {
      disabled,
      drawableDimensions,
      fillColor,
      imageDimensions,
      imageUrl,
      paintColor,
      outlineColor,
      TextEntry,
      backgroundImageEnabled = true,
      toolActive: { type },
      scale,
      language,
    } = this.props;
    const { isOver, newDrawable } = this.state;

    const draggable = type === 'Select';
    const paint = type === 'PaintBucket';
    const drawables = [...this.state.drawables, ...this.state.newDrawable];

    const drawableProps = {
      draggable: draggable && !disabled,
      disabled,
      paint,
      fillColor,
      forceUpdate: () => this.setState({ updatedAt: new Date() }),
      paintColor,
      outlineColor,
      toggleTextSelected: this.toggleTextSelected,
      handleSessionChange: this.handleSessionChange,
      stage: this.stage,
      onMouseOverElement: this.onMouseOverElement,
      onMouseOutElement: this.onMouseOutElement,
      scale,
    };

    let listeners = {};

    if (!disabled) {
      listeners = {
        onMouseUp: this.handleMouseUp,
        onTouchEnd: this.handleMouseUp,
        onMouseMove: this.handleMouseMove,
        onTouchMove: this.handleMouseMove,
      };

      if (!draggable) {
        listeners.onMouseDown = this.handleMouseDown;
        listeners.onTouchStart = this.handleMouseDown;
      }
    }

    const imageHeight = imageDimensions?.height * scale;
    const imageWidth = imageDimensions?.width * scale;

    return (
      <Wrapper>
        <UndoControls>
          <Button
            disabled={disabled}
            onClick={this.handleUndo}
            label={translator.t('common:undo', { lng: language })}
          />
          <Button
            disabled={disabled}
            onClick={this.handleClearAll}
            label={translator.t('common:clearAll', { lng: language })}
          />
        </UndoControls>
        <Base>
          {backgroundImageEnabled && imageUrl && (
            <ImageBackground dimensions={{ height: imageHeight, width: imageWidth }} url={imageUrl} />
          )}

          {TextEntry.renderTextareas()}

          {/* Wrap Stage in a styled div instead of styling Stage directly */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              touchAction: 'none',
              cursor: draggable && (isOver || newDrawable.length === 1) ? 'pointer' : 'default',
            }}
          >
            <Stage
              key="drawing-stage"
              scaleX={scale}
              scaleY={scale}
              ref={(ref) => (this.stage = ref)}
              height={drawableDimensions.height}
              width={drawableDimensions.width}
              {...listeners}
            >
              <Layer ref={(ref) => (this.layer = ref)}>
                {drawables.map((drawable, key) => drawable.render({ ...drawableProps, key }))}
                {TextEntry.render(drawableProps)}
              </Layer>
            </Stage>
          </div>
        </Base>
      </Wrapper>
    );
  }
}

DrawableMain.propTypes = {
  disabled: PropTypes.bool,
  drawableDimensions: PropTypes.object.isRequired,
  imageDimensions: PropTypes.object.isRequired,
  fillColor: PropTypes.string.isRequired,
  onSessionChange: PropTypes.func.isRequired,
  paintColor: PropTypes.string.isRequired,
  outlineColor: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  TextEntry: PropTypes.object.isRequired,
  toolActive: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  backgroundImageEnabled: PropTypes.bool.isRequired,
  scale: PropTypes.number.isRequired,
  language: PropTypes.string,
};

export default DrawableMain;
