import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderMath } from '@pie-lib/math-rendering';
import { EnableAudioAutoplayImage } from '@pie-lib/render-ui';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';

import ImageClozeAssociationComponent from './root';

export default class ImageClozeAssociation extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  set model(m) {
    this._model = m;

    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
    this._render();
  }

  isComplete() {
    const {
      autoplayAudioEnabled,
      completeAudioEnabled,
      completeResponses,
      duplicateResponses,
      hasUnplacedChoices,
      maxResponsePerZone,
      responseAreasToBeFilled,
    } = this._model || {};
    const elementContext = this;

    // check audio completion if audio settings are enabled and audio actually exists
    if (autoplayAudioEnabled && completeAudioEnabled && !this.audioComplete) {
      if (elementContext) {
        const audio = elementContext.querySelector('audio');
        const isInsidePrompt = audio && audio.closest('#preview-prompt');

        // only require audio completion if audio exists and is inside the prompt
        if (audio && isInsidePrompt) {
          return false;
        }
      }
    }

    if (!this._session || !this._session.answers) {
      return false;
    }

    const { answers } = this._session;

    if (!Array.isArray(answers)) {
      return false;
    }

    // filter answers by containerIndex and count the ones with content
    const filledResponseAreas = [...new Map(answers.map((item) => [item.containerIndex, item])).values()].length;
    // check if an answer choice was added to at least as many response areas
    // as the number of populated response areas in the correct answer
    const areResponseAreasFilled = filledResponseAreas >= responseAreasToBeFilled;

    if (maxResponsePerZone > 1) {
      if (duplicateResponses) {
        // an answer choice can be used multiple times
        return areResponseAreasFilled;
      }

      // any correct answer have any unplaced answer choices (by the author)
      if (hasUnplacedChoices) {
        return areResponseAreasFilled;
      }

      const allAnswersValue = answers.map((answer) => answer.value);

      // check if any correct answer have any unplaced answer choices (by the student)
      const requiredAnswersPlaced = completeResponses.some((response) =>
        response.every((val) => allAnswersValue.includes(val)),
      );

      // true - all choices (required for a correct response) were placed into a response area
      return requiredAnswersPlaced;
    }

    return areResponseAreasFilled;
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

  updateAnswer(data) {
    this._session.answers = data;
    this._session.selector = 'Mouse';

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));

    this._render();
  }

  _createAudioInfoToast() {
    const info = document.createElement('div');
    info.id = 'play-audio-info';

    Object.assign(info.style, {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      zIndex: '1000',
      cursor: 'pointer',
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
            const info = this.querySelector('#play-audio-info');

            if (info) {
              container.removeChild(info);
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

          // store references to remove later
          this._audio = audio;
          this._handlePlaying = handlePlaying;
          this._handleEnded = handleEnded;
          this._enableAudio = enableAudio;

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

    if (this._root) {
      this._root.unmount();
    }
  }

  _render() {
    if (this._model && this._session) {
      const el = React.createElement(ImageClozeAssociationComponent, {
        model: this._model,
        session: this._session,
        updateAnswer: this.updateAnswer.bind(this),
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(el);
      queueMicrotask(() => {
        renderMath(this);
      });
    }
  }
}
