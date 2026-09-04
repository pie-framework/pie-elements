import * as React from 'react';
import { render } from '@testing-library/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import DragAndDropAnswer, { buildDragId } from '../answer';

jest.mock('@pie-lib/drag', () => ({
  PlaceHolder: (props) => <div data-testid="placeholder">{props.children}</div>,
}));
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    white: () => '#fff',
    border: () => '#ccc',
    correct: () => '#0f0',
    incorrect: () => '#f00',
  },
}));

describe('buildDragId', () => {
  it('identifies a pool choice by its choice id', () => {
    expect(buildDragId({ type: 'choice', id: 5 })).toEqual('choice-5');
  });

  it('identifies a placed answer by its response area, not by the choice it holds', () => {
    expect(buildDragId({ type: 'target', id: 5, promptId: 3 })).toEqual('target-prompt-3');
  });

  // The PIE-965 regression: with config.duplicates enabled the same choice can sit in
  // several response areas at once. dnd-kit keys its whole draggable registry off this
  // id, so those tiles must not share one.
  it('gives every response area holding the same choice a distinct id', () => {
    const ids = [1, 2, 3, 4, 5].map((promptId) => buildDragId({ type: 'target', id: 5, promptId }));

    expect(new Set(ids).size).toEqual(ids.length);
  });

  // Empty response areas have no choice id at all, so keying by choice id used to collapse
  // all of them onto "target-undefined".
  it('gives every empty response area a distinct id', () => {
    const ids = [1, 2, 3].map((promptId) => buildDragId({ type: 'target', id: undefined, promptId }));

    expect(new Set(ids).size).toEqual(ids.length);
  });

  it('never collides a pool choice with a response area', () => {
    expect(buildDragId({ type: 'choice', id: 3 })).not.toEqual(buildDragId({ type: 'target', id: 9, promptId: 3 }));
  });

  it('is stable for a response area regardless of which choice it holds', () => {
    expect(buildDragId({ type: 'target', id: 1, promptId: 2 })).toEqual(
      buildDragId({ type: 'target', id: 7, promptId: 2 }),
    );
  });

  it('falls back to the default type when none is given', () => {
    expect(buildDragId({ id: 5 })).toEqual('answer-5');
    expect(buildDragId({ id: 5, promptId: 1 })).toEqual('answer-prompt-1');
  });

  it('treats promptId 0 as a real response area', () => {
    expect(buildDragId({ type: 'target', id: 5, promptId: 0 })).toEqual('target-prompt-0');
  });
});

// dnd-kit is mocked repo-wide (see __mocks__/@dnd-kit/core.js), so these assert what the
// component hands to dnd-kit rather than dnd-kit's own resulting behaviour. That is the
// contract that matters here: dnd-kit keys its draggable registry, its isDragging flag and
// its drag transform off the `id` it is given, so one id per rendered tile is what keeps
// re-used choices independent of one another.
describe("DragAndDropAnswer's dnd-kit wiring", () => {
  beforeEach(() => {
    useDraggable.mockClear();
    useDroppable.mockClear();
  });

  const renderSlots = (slots) =>
    render(
      <div>
        {slots.map(({ promptId, id, title }) => (
          <DragAndDropAnswer
            key={promptId}
            type="target"
            promptId={promptId}
            id={id}
            title={title}
            instanceId="i1"
            draggable={!!title}
            disabled={false}
          />
        ))}
      </div>,
    );

  const draggableArgs = () => useDraggable.mock.calls.map(([args]) => args);

  it('gives each response area its own drag id when a choice is re-used across several', () => {
    // The exact PIE-965 scenario: one choice placed in five response areas. Keying the
    // draggable by the choice id gave all five the id "target-5", collapsing them into a
    // single entry in dnd-kit's draggableNodes Map — so every tile shared one isDragging
    // flag and one drag transform (appearing to move together), and the drag payload
    // resolved to whichever tile registered last (so the wrong response area changed).
    renderSlots([1, 2, 3, 4, 5].map((promptId) => ({ promptId, id: 5, title: 'water pollution' })));

    expect(draggableArgs().map((a) => a.id)).toEqual([
      'target-prompt-1',
      'target-prompt-2',
      'target-prompt-3',
      'target-prompt-4',
      'target-prompt-5',
    ]);
  });

  it('pairs each drag id with the promptId of its own response area', () => {
    renderSlots([1, 2, 3].map((promptId) => ({ promptId, id: 5, title: 'water pollution' })));

    draggableArgs().forEach(({ id, data }) => {
      expect(`target-prompt-${data.promptId}`).toEqual(id);
      expect(data.id).toEqual(5);
    });
  });

  it('gives each empty response area its own drag id', () => {
    // Empty areas carry no choice id, so keying by choice id gave every one of them
    // "target-undefined".
    renderSlots([1, 2, 3].map((promptId) => ({ promptId, id: undefined, title: undefined })));

    expect(new Set(draggableArgs().map((a) => a.id)).size).toEqual(3);
  });

  it('keeps the drop id per response area, distinct from the drag id', () => {
    renderSlots([1, 2].map((promptId) => ({ promptId, id: 5, title: 'water pollution' })));

    expect(useDroppable.mock.calls.map(([args]) => args.id)).toEqual(['drop-1', 'drop-2']);
  });

  it('keys a pool choice by its choice id, since the pool renders it once', () => {
    render(<DragAndDropAnswer type="choice" id={5} title="water pollution" instanceId="i1" />);

    expect(draggableArgs()[0].id).toEqual('choice-5');
  });
});
