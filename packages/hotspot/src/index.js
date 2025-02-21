import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';

import HotspotComponent from './hotspot';
import { updateSessionValue, updateSessionMetadata } from './session-updater';

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

    Object.assign(info.style, {
      position: 'absolute',
      top: 0,
      width:'100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      zIndex: '1000'
    });

    const img = document.createElement('img');
    img.src = 'https://student.assessment.renaissance.com/ce/quizenginecap/assets/img/playAppsSel.gif';
    img.alt = 'Click anywhere to enable audio autoplay';
    img.width = 500;
    img.height = 300;

    info.appendChild(img);
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
            updateSessionMetadata(this._session, { audioStartTime: new Date().getTime() });
            
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
            updateSessionMetadata(this._session, { audioEndTime: new Date().getTime() });
            
            let { audioStartTime, audioEndTime, waitTime } = this._session;
            if(!waitTime && audioStartTime && audioEndTime) {
              // waitTime is elapsed time the user waited for auto-played audio to finish
              this._session.waitTime = (audioEndTime - audioStartTime);
            }
            
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
