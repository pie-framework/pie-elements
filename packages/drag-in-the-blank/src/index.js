import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { EnableAudioAutoplayImage } from '@pie-lib/pie-toolbox/render-ui';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import Main from './main';

export const isComplete = (session, model, audioComplete) => {
  const { autoplayAudioEnabled, completeAudioEnabled } = model || {};

  if (autoplayAudioEnabled && completeAudioEnabled && !audioComplete) {
    return false;
  }

  if (!session || !session.value) {
    return false;
  }

  return Object.values(session.value || {}).some((value) => !!value);
};

export default class DragInTheBlank extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this._audioInitialized = false;
    this.audioComplete = false;
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), isComplete(this._session, this._model, this.audioComplete), !!this._model));
    // reset the audioInitialized to false since the model changed, and we might need to reinitialize the audio
    this._audioInitialized = false;
    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  _render = () => {
    if (this._model && this._session) {
      let elem = React.createElement(Main, {
        model: this._model,
        value: this._session.value,
        onChange: this.changeSession,
      });

      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  };

  dispatchChangedEvent = () => {
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session, this._model, this.audioComplete)));
  };

  changeSession = (value) => {
    this.session.value = value;
    this.session.selector = 'Mouse';

    this.dispatchChangedEvent();
    this._render();
  };

  _createAudioInfoToast() {
    const info = document.createElement('div');
    info.id = 'play-audio-info';

    Object.assign(info.style, {
      position: 'absolute',
      top: 0,
      width:'100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      zIndex: '1000',
      cursor: 'pointer'
    });

    const img = document.createElement('img');
    img.src = EnableAudioAutoplayImage;
    img.alt = 'Click anywhere to enable audio autoplay';
    img.width = 500;
    img.height = 300;

    info.appendChild(img);
    return info;
  }

  connectedCallback() {
    this._render();

    // Observation:  audio in Chrome will have the autoplay attribute,
    // while other browsers will not have the autoplay attribute and will need a user interaction to play the audio
    // This workaround fixes the issue of audio being cached and played on any user interaction in Safari and Firefox
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (this._audioInitialized) return;
          const audio = this.querySelector('audio');
          const isInsidePrompt = audio && audio.closest('#preview-prompt');

          if (!this._model) return;
          if (!this._model.autoplayAudioEnabled) return;
          if (audio && !isInsidePrompt) return;
          if (!audio) return;

          const info = this._createAudioInfoToast();
          const container = this.querySelector('#main-container');
          const enableAudio = () => {
            if (this.querySelector('#play-audio-info')) {
              audio.play();
              container.removeChild(info);
            }

            document.removeEventListener('click', enableAudio);
          };

          // if the audio is paused, it means the user has not interacted with the page yet and the audio will not play
          // FIX FOR SAFARI: play with a slight delay to check if autoplay was blocked
          setTimeout(() => {
            if (audio.paused && !this.querySelector('#play-audio-info')) {
              // add info message as a toast to enable audio playback
              container.appendChild(info);
              document.addEventListener('click', enableAudio);
            } else {
              document.removeEventListener('click', enableAudio);
            }
          }, 500);

          // we need to listen for the playing event to remove the toast in case the audio plays because of re-rendering
          const handlePlaying = () => {
            //timestamp when auto-played audio started playing
            this._session.audioStartTime = this._session.audioStartTime || new Date().getTime();

            const info = this.querySelector('#play-audio-info');
            if (info) {
              container.removeChild(info);
            }

            audio.removeEventListener('playing', handlePlaying);
          };

          audio.addEventListener('playing', handlePlaying);

          // we need to listen for the ended event to update the isComplete state
          const handleEnded = () => {
            //timestamp when auto-played audio completed playing
            this._session.audioEndTime = this._session.audioEndTime || new Date().getTime();

            let { audioStartTime, audioEndTime, waitTime } = this._session;
            if(!waitTime && audioStartTime && audioEndTime) {
              // waitTime is elapsed time the user waited for auto-played audio to finish
              this._session.waitTime = (audioEndTime - audioStartTime);
            }

            this.audioComplete = true;
            this.dispatchChangedEvent();
            audio.removeEventListener('ended', handleEnded);
          };

          audio.addEventListener('ended', handleEnded);

          // store references to remove later
          this._audio = audio;
          this._handlePlaying = handlePlaying;
          this._handleEnded = handleEnded;
          this._enableAudio = enableAudio;
          // set to true to prevent multiple initializations
          this._audioInitialized = true;

          observer.disconnect();
        }
      });
    });

    observer.observe(this, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._enableAudio);

    if (this._audio) {
      this._audio.removeEventListener('playing', this._handlePlaying);
      this._audio.removeEventListener('ended', this._handleEnded);
      this._audio = null;
    }
  }
}
