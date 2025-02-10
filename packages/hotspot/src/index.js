import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';

import HotspotComponent from './hotspot';
import { updateSessionValue } from './session-updater';

export default class Hotspot extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this.audioComplete = false;
  }

    set model(m) {
    this._model = m;

    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
    this._render();
  }

  isComplete() {
    if (!this._session || !this._session.answers) {
      return false;
    }

    const { autoplayAudioEnabled, completeAudioEnabled } = this._model || {};
    if (autoplayAudioEnabled && completeAudioEnabled && !this.audioComplete) {
      return false;
    }

    if (!Array.isArray(this._session.answers)) {
      return false;
    }

    return this._session.answers.length > 0;
  }

  set session(s) {
    if (s && !s.answers) {
      s.answers = [];
    }

    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  onSelectChoice(data) {
    updateSessionValue(this._session, this._model, data);

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));

    this._render();
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
    this._render();

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
            this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));

            audio.removeEventListener('ended', handleEnded);
          };

          audio.addEventListener('ended', handleEnded);

          observer.disconnect();
        }
      });
    });

    observer.observe(this, { childList: true, subtree: true });
  }

  _render() {
    if (this._model && this._session) {
      const el = React.createElement(HotspotComponent, {
        model: this._model,
        session: this._session,
        onSelectChoice: this.onSelectChoice.bind(this),
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
