import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import debug from 'debug';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { updateSessionValue } from './session-updater';

const log = debug('pie-ui:multiple-choice');

export const isComplete = (session, model, audioComplete) => {
  const { autoplayAudioEnabled, completeAudioEnabled } = model || {};

  if (autoplayAudioEnabled && completeAudioEnabled && !audioComplete) {
    return false;
  }

  if (!session || !session.value) {
    return false;
  }

  const { choiceMode, minSelections = 1, maxSelections } = model || {};
  const selections = session.value.length || 0;

  if (choiceMode === 'radio') {
    return !!selections;
  }

  if (selections < minSelections || selections > maxSelections) {
    return false;
  }

  return true;
};

export default class MultipleChoice extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this.audioComplete = false;

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          var element = React.createElement(Main, {
            model: this._model,
            session: this._session,
            onChoiceChanged: this._onChange.bind(this),
            onShowCorrectToggle: this.onShowCorrectToggle.bind(this),
          });

          //TODO: aria-label is set in the _rerender because we need to change it when the model.choiceMode is updated. Consider revisiting the placement of the aria-label setting in the _rerender
          this.setAttribute(
            'aria-label',
            this._model.choiceMode === 'radio' ? 'Multiple Choice Question' : 'Multiple Correct Answer Question',
          );
          this.setAttribute('role', 'region');
          this.setLangAttribute();

          ReactDOM.render(element, this, () => {
            log('render complete - render math');
            renderMath(this);
          });

          if (this._model.keyboardEventsEnabled === true) {
            this.enableKeyboardEvents();
          }
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true },
    );

    this._dispatchResponseChanged = debounce(() => {
      this.dispatchEvent(
        new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session, this._model, this.audioComplete)),
      );
    });

    this._dispatchModelSet = debounce(
      () => {
        this.dispatchEvent(
          new ModelSetEvent(
            this.tagName.toLowerCase(),
            isComplete(this._session, this._model),
            this._model !== undefined,
          ),
        );
      },
      50,
      { leading: false, trailing: true },
    );
  }

  onShowCorrectToggle() {
    renderMath(this);
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);
  }

  set model(s) {
    this._model = s;
    this._rerender();
    this._dispatchModelSet();
  }

  get session() {
    return this._session;
  }

  set session(s) {
    this._session = s;
    this._rerender();
    //TODO: remove this session-changed should only be emit on user change
    this._dispatchResponseChanged();
  }

  _onChange(data) {
    updateSessionValue(this._session, this._model.choiceMode, data);
    this._dispatchResponseChanged();
    this._rerender();
  }

  _createAudioInfoToast() {
    const info = document.createElement('div');
    info.id = 'play-audio-info';
    info.innerHTML =
      'Click anywhere to enable audio autoplay. Browser restrictions require user interaction to play audio.';
    Object.assign(info.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
    });

    return info;
  }

  connectedCallback() {
    this._rerender();

    if (this._model && !this._model.autoplayAudioEnabled) {
      return;
    }

    // Observation:  audio in Chrome will have the autoplay attribute,
    // while other browsers will not have the autoplay attribute and will need a user interaction to play the audio
    // This workaround fixes the issue of audio being cached and played on any user interaction in Safari and Firefox
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const audio = this.querySelector('audio');
          const isInsidePrompt = audio && audio.closest('#preview-prompt');

          if (audio && !isInsidePrompt) return;
          if (!audio) return;

          const info = this._createAudioInfoToast();
          const enableAudio = () => {
            if (this.querySelector('#play-audio-info')) {
              audio.play();
              this.removeChild(info);
            }

            document.removeEventListener('click', enableAudio);
          };

          // if the audio is paused, it means the user has not interacted with the page yet and the audio will not play
          // FIX FOR SAFARI: play with a slight delay to check if autoplay was blocked
          setTimeout(() => {
            if (audio.paused && !this.querySelector('#play-audio-info')) {
              // add info message as a toast to enable audio playback
              this.appendChild(info);
              document.addEventListener('click', enableAudio);
            } else {
              document.removeEventListener('click', enableAudio);
            }
          }, 500);

          // we need to listen for the playing event to remove the toast in case the audio plays because of re-rendering
          const handlePlaying = () => {
            const info = this.querySelector('#play-audio-info');

            if (info) {
              this.removeChild(info);
            }

            audio.removeEventListener('playing', handlePlaying);
          };

          audio.addEventListener('playing', handlePlaying);

          // we need to listen for the ended event to update the isComplete state
          const handleEnded = () => {
            this.audioComplete = true;
            this._dispatchResponseChanged();
            audio.removeEventListener('ended', handleEnded);
          };

          audio.addEventListener('ended', handleEnded);

          observer.disconnect();
        }
      });
    });

    observer.observe(this, { childList: true, subtree: true });
  }

  enableKeyboardEvents() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Handles global keyboard events for selecting or toggling multiple-choice answers.
   * Maps keys (1-9, 0, a-j, A-J) to choices and updates the session state accordingly.
   * Ensures valid key presses toggle or select the appropriate choice based on the model.
   */
  handleKeyDown(event) {
    if (!this._model || !this._session) {
      return;
    }

    const keyToIndex = (key) => {
      const numOffset = key >= '1' && key <= '9' ? key - '1' : key === '0' ? 9 : -1;
      const letterOffset = /^[a-jA-J]$/.test(key) ? key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) : -1;
      return numOffset >= 0 ? numOffset : letterOffset;
    };

    const choiceIndex = keyToIndex(event.key);

    if (choiceIndex === undefined || choiceIndex >= this._model.choices.length) {
      return;
    }

    const currentValue = this._session.value || [];
    const choiceId = this._model.choices[choiceIndex].value;

    const newValue = {
      value: choiceId,
      selected: !currentValue.includes(choiceId),
      selector: 'Keyboard',
    };

    this._onChange(newValue);
  }
}
