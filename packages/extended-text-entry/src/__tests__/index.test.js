import RootExtendedTextEntry, { isComplete, textContent } from '../index';

describe('textContent', () => {
  const assertContent = function () {
    const args = Array.prototype.slice.call(arguments);
    const [input, expected] = args.length === 2 ? args : [args[0], args[0]];
    it(`${input} => ${expected}`, () => {
      const result = textContent(input);
      expect(result).toEqual(expected);
    });
  };
  assertContent(undefined);
  assertContent([], undefined);
  assertContent({}, undefined);
  assertContent('', '');
  assertContent('<div></div>', '');
  assertContent('< div ->/div>', '< div ->/div>');
  assertContent('<foo', '');
  assertContent('<foo/ >', '');
  assertContent('<foo />', '');
});

describe('Completeness Checker', () => {
  const assertIsComplete = (input, expected) => {
    it(`${input}: ${expected}`, () => {
      expect(isComplete(input)).toEqual(expected);
    });
  };
  assertIsComplete('', false);
  assertIsComplete('<div></div>', false);
  assertIsComplete('<div><p></p><h1></h1></div>', false);
  assertIsComplete('<div><p></p><h1</h1></div>', false);
  assertIsComplete('<div>test</div>', true);
  assertIsComplete('<div><p><a>test</a></p></div>', true);
  assertIsComplete('foo', true);
});

describe('deferred session-changed', () => {
  const TAG = 'ete-session-commit-test';

  if (!window.customElements.get(TAG)) {
    window.customElements.define(TAG, class extends RootExtendedTextEntry {});
  }

  let element;
  let documentEvents;

  const onDocumentEvent = (event) => documentEvents.push(event);

  // No model, so `render()` no-ops and the assertions stay on the element's
  // event contract rather than on a React mount of the editor.
  const mount = () => {
    documentEvents = [];
    document.addEventListener('session-changed', onDocumentEvent);
    element = document.createElement(TAG);
    document.body.appendChild(element);
    element.session = { id: '1', element: TAG };
    return element;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.removeEventListener('session-changed', onDocumentEvent);
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('writes the session synchronously and defers only the dispatch', () => {
    mount();

    element.valueChange('<div>answer</div>');

    expect(element.session.value).toEqual('<div>answer</div>');
    expect(documentEvents).toHaveLength(0);

    jest.advanceTimersByTime(1500);

    expect(documentEvents).toHaveLength(1);
    expect(documentEvents[0].detail.complete).toEqual(true);
  });

  it('commitPendingSession dispatches while the element is still attached', () => {
    mount();

    element.valueChange('<div>answer</div>');
    element.commitPendingSession();

    expect(element.isConnected).toEqual(true);
    expect(documentEvents).toHaveLength(1);
    expect(documentEvents[0].detail.component).toEqual(TAG);
  });

  it('commitPendingSession is a no-op when nothing is pending', () => {
    mount();

    element.commitPendingSession();
    jest.advanceTimersByTime(1500);

    expect(documentEvents).toHaveLength(0);
  });

  it('keeps each session field on its own completeness', () => {
    mount();

    element.commentChange('');
    jest.advanceTimersByTime(1500);

    expect(documentEvents).toHaveLength(1);
    expect(documentEvents[0].detail.complete).toEqual(false);
  });

  it('teardown commits the response but cannot reach a document listener', () => {
    mount();
    const localEvents = [];
    element.addEventListener('session-changed', (event) => localEvents.push(event));

    element.valueChange('<div>answer</div>');
    element.remove();

    // The response is on the session either way, which is what a player's
    // synthesized commit reads.
    expect(element.session.value).toEqual('<div>answer</div>');
    // `disconnectedCallback` runs after removal, so the flushed event reaches a
    // listener inside the removed subtree and nothing above it. This is why a
    // player calls `commitPendingSession()` instead of relying on teardown.
    expect(localEvents).toHaveLength(1);
    expect(documentEvents).toHaveLength(0);
  });
});
