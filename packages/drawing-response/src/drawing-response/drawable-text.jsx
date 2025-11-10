import React from 'react';
import { Text } from 'react-konva';
import Translator from '@pie-lib/translator';

const { translator } = Translator;
import Transformer from './drawable-transformer';

export const generateId = () => Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

export default class TextDrawable {
  static getTextareaNode(id) {
    return `textarea_${id}`;
  }

  static getTextNode(id) {
    return `text_${id}`;
  }

  static getTransformerNode(id) {
    return `transformer_${id}`;
  }

  constructor(props) {
    this.all = (props && props.all) || [];
    this.eventListenersDetachArray = [];
  }

  removeEventListeners = () => this.eventListenersDetachArray.forEach((fn) => fn());

  setAll = (all) => {
    this.all = all;
    this.props.forceUpdate();
  };

  addNewTextEntry = (language) => {
    const all = this.all;
    const id = generateId();

    all.push({
      id: id,
      text: '',
      isDefault: true,
      label: translator.t('drawingResponse.onDoubleClick', { lng: language }),
      width: 200,
      x: (all.length + 1) * 5 + 50,
      y: (all.length + 1) * 5 + 50,
      textVisible: true,
      transformerVisible: true,
      textareaVisible: false,
      createdAt: new Date(),
      type: 'text-entry',
    });

    this.props.handleSessionChange();
  };

  showOnlyTextNodes() {
    this.all.map((item) => {
      item.textVisible = true;
      item.transformerVisible = false;
      item.textareaVisible = false;
    });
  }

  toggleTextarea(id, value) {
    this.all = this.all.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          textVisible: !value,
          transformerVisible: !value,
          textareaVisible: value,
        };
      }
      return item;
    });
    this.props.forceUpdate();
  }

  initializeDefault(id, isDefault) {
    if (isDefault) {
      const current = this.all.filter((item) => item.id === id)[0];
      current.isDefault = false;
    }
  }

  saveValue(id, textareaNode) {
    const value = textareaNode.value;
    this.all = this.all.map((t) =>
      t.id === id ? { ...t, text: value } : t
    );

    if (!value) {
      this.all = this.all.filter((t) => t.id !== id);
    }

    this.toggleTextarea(id, false);
    this.props.handleSessionChange();
    this.props.forceUpdate();
  }

  handleMouseDown = () => this.props.toggleTextSelected(true);
  handleMouseUp = () => this.props.toggleTextSelected(false);

  handleClick = (e, id) => {
    const current = this.all.filter((item) => item.id === id)[0];
    current.transformerVisible = true;
    this.props.forceUpdate();
  };

  handleDblClick = (e, text) => {
    const { id, isDefault } = text;
    this.toggleTextarea(id, true);

    const textNode = this[TextDrawable.getTextNode(id)];
    const textareaNode = this[TextDrawable.getTextareaNode(id)];

    if (!textNode || !textareaNode) return;

    const areaPosition = textNode.getAbsolutePosition();

    textareaNode.value = text.text || '';
    textareaNode.style.position = 'absolute';
    textareaNode.style.top = areaPosition.y + 'px';
    textareaNode.style.left = areaPosition.x + 'px';
    textareaNode.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textareaNode.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textareaNode.style.fontSize = textNode.fontSize() + 'px';
    textareaNode.style.border = 'none';
    textareaNode.style.padding = '0px';
    textareaNode.style.margin = '0px';
    textareaNode.style.overflow = 'hidden';
    textareaNode.style.background = 'none';
    textareaNode.style.outline = 'none';
    textareaNode.style.resize = 'none';
    textareaNode.style.lineHeight = textNode.lineHeight();
    textareaNode.style.fontFamily = textNode.fontFamily();
    textareaNode.style.transformOrigin = 'left top';
    textareaNode.style.textAlign = textNode.align();
    textareaNode.style.color = textNode.fill();
    textareaNode.style.display = 'block';

    let rotation = textNode.rotation();
    textareaNode.style.transform = rotation ? `rotateZ(${rotation}deg)` : '';

    textareaNode.focus();

    const keyDownHandler = (e) => {
      console.log(e.key);
      if (e.key === 'Enter' && !e.shiftKey) {
        this.saveValue(id, textareaNode);
      }
      if (e.key === 'Escape') {
        this.toggleTextarea(id, false);
      }
    };

    const blurHandler = () => {
      this.showOnlyTextNodes();
      this.saveValue(id, textareaNode);
    };

    textareaNode.addEventListener('keydown', keyDownHandler);
    textareaNode.addEventListener('blur', blurHandler);

    this.eventListenersDetachArray.push(() => {
      textareaNode.removeEventListener('keydown', keyDownHandler);
      textareaNode.removeEventListener('blur', blurHandler);
    });

    this.initializeDefault(id, isDefault);
    this.props.forceUpdate();
  };

  handleTransform = (e, textNode) => {
    this[textNode].setAttrs({
      width: this[textNode].width() * this[textNode].scaleX(),
      scaleX: this.props.scale,
    });
  };

  renderTextareas() {
    return this.all.map((text) => {
      const { id, textareaVisible } = text;
      const textareaNode = `textarea_${id}`;

      return (
        <textarea
          key={textareaNode}
          ref={(textarea) => {
            this[textareaNode] = textarea;
          }}
          style={{ display: `${textareaVisible ? 'block' : 'none'}` }}
        />
      );
    });
  }

  setInitialProps(props) {
    if (!this.props) {
      this.props = props;
    }
  }

  render(props) {
    this.setInitialProps(props);

    if (props.stage) {
      const newStage = props.stage;

      // setting the handler only once
      if (newStage !== this.stage) {
        const stageClickHandler = (e) => {
          if (e.target !== this.stage) {
            return;
          }

          this.showOnlyTextNodes();
          this.props.forceUpdate();
        };

        newStage.on('click', stageClickHandler);

        this.eventListenersDetachArray.push(() => newStage.off('click', stageClickHandler));
      }

      this.stage = newStage;
    }

    return this.all.map((text) => {
      const { id, label, x, y, width, textVisible, rotation, transformerVisible } = text;

      const textNode = `text_${id}`;
      const transformerNode = `transformer_${id}`;
      let extraProps = {};

      if (!props.disabled) {
        extraProps = {
          onClick: (e) => this.handleClick(e, id),
          onTap: (e) => this.handleClick(e, id),
          onDblClick: (e) => this.handleDblClick(e, text),
          onDblTap: (e) => this.handleDblClick(e, text),
          onTransform: (e) => this.handleTransform(e, textNode),
          onTransformEnd: this.props.handleSessionChange,
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleMouseDown,
          onMouseUp: this.handleMouseUp,
          onTouchEnd: this.handleMouseUp,
          onDragEnd: this.props.handleSessionChange,
          onMouseEnter: this.props.onMouseOverElement,
          onMouseLeave: this.props.onMouseOutElement,
        };
      }

      if (rotation) {
        extraProps.rotation = rotation;
      }

      return [
        <Text
          key={id}
          bubbles={true}
          id={id}
          ref={(text) => {
            this[textNode] = text;
          }}
          text={text.text || label}
          name={textNode}
          x={x}
          y={y}
          width={width}
          draggable={!props.disabled}
          visible={textVisible}
          fontSize={16}
          {...extraProps}
        />,
        transformerVisible && (
          <Transformer
            key={`transformer_${id}`}
            ref={(text) => {
              this[transformerNode] = text;
            }}
            selectedShapeName={textNode}
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onTouchEnd={this.handleMouseUp}
          />
        ),
      ];
    });
  }
}
