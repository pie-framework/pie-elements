import { PlacementOrdering } from '../placement-ordering';
import { reducer } from '../ordering';

jest.mock('../ordering', () => ({
  buildState: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
  reducer: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
}));

describe('PlacementOrdering click-to-select / click-to-place state machine', () => {
  let onSessionChange;
  let instance;

  const createInstance = (mod, sess) => {
    onSessionChange = jest.fn();
    const session = { value: [], ...sess };
    const choices = [
      { id: 'c1', label: 'C1' },
      { id: 'c2', label: 'C2' },
    ];
    const model = { config: { includeTargets: true }, choices, ...mod };
    const props = { model, session, onSessionChange };

    const inst = new PlacementOrdering(props);
    inst.setState = jest.fn((state, callback) => {
      Object.assign(inst.state, typeof state === 'function' ? state(inst.state) : state);
      if (callback) callback();
    });
    inst.props = props;
    return inst;
  };

  const choiceData = { id: 'c1', type: 'choice', instanceId: 'i', value: 'C1', index: undefined };
  const otherChoiceData = { id: 'c2', type: 'choice', instanceId: 'i', value: 'C2', index: undefined };
  const targetData = { id: 'c1', type: 'target', instanceId: 'i', value: 'C1', index: 0 };

  beforeEach(() => {
    reducer.mockReset();
    reducer.mockReturnValue({ response: ['x'] });
    instance = createInstance();
  });

  describe('toggleChoiceSelection', () => {
    it('selects a choice when nothing is selected', () => {
      instance.toggleChoiceSelection(choiceData);

      expect(instance.state.selectedChoice).toEqual(choiceData);
    });

    it('deselects when the same choice is toggled again', () => {
      instance.toggleChoiceSelection(choiceData);
      instance.toggleChoiceSelection(choiceData);

      expect(instance.state.selectedChoice).toBeNull();
    });

    it('switches selection to a different choice', () => {
      instance.toggleChoiceSelection(choiceData);
      instance.toggleChoiceSelection(otherChoiceData);

      expect(instance.state.selectedChoice).toEqual(otherChoiceData);
    });
  });

  describe('cancelSelection', () => {
    it('clears the current selection', () => {
      instance.selectChoice(choiceData);
      instance.cancelSelection();

      expect(instance.state.selectedChoice).toBeNull();
    });
  });

  describe('placeSelectedChoice', () => {
    it('does nothing when nothing is selected', () => {
      instance.placeSelectedChoice(targetData);

      expect(onSessionChange).not.toHaveBeenCalled();
    });

    it('places the selected choice, updates the session, and clears the selection', () => {
      instance.selectChoice(choiceData);
      instance.placeSelectedChoice(targetData);

      expect(reducer).toHaveBeenCalledWith({ type: 'move', from: undefined, to: targetData }, expect.anything());
      expect(onSessionChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['x'] }));
      expect(instance.state.selectedChoice).toBeNull();
    });
  });

  describe('onChoiceClick / onPlacementClick guard against a real drag\'s trailing click', () => {
    it('onChoiceClick is a no-op immediately after a real drag ends', () => {
      instance.lastDragEndAt = Date.now();
      instance.onChoiceClick(choiceData);

      expect(instance.state.selectedChoice).toBeNull();
    });

    it('onChoiceClick selects normally once the guard window has passed', () => {
      instance.lastDragEndAt = Date.now() - 1000;
      instance.onChoiceClick(choiceData);

      expect(instance.state.selectedChoice).toEqual(choiceData);
    });

    it('onPlacementClick is a no-op immediately after a real drag ends', () => {
      instance.selectChoice(choiceData);
      instance.lastDragEndAt = Date.now();
      instance.onPlacementClick(targetData);

      expect(onSessionChange).not.toHaveBeenCalled();
    });

    it('onPlacementClick places normally once the guard window has passed', () => {
      instance.selectChoice(choiceData);
      instance.lastDragEndAt = Date.now() - 1000;
      instance.onPlacementClick(targetData);

      expect(onSessionChange).toHaveBeenCalled();
    });
  });

  describe('cross-modal selection (real drag start mirrors into the same selectedChoice state click uses)', () => {
    it('onDragStart mirrors the dragged item into selectedChoice', () => {
      instance.onDragStart({ active: { data: { current: choiceData } } });

      expect(instance.state.selectedChoice).toEqual(choiceData);
    });

    it('keyboard-select (onDragStart) then mouse-place (onPlacementClick) completes the placement', () => {
      instance.onDragStart({ active: { data: { current: choiceData } } });
      instance.onPlacementClick(targetData);

      expect(onSessionChange).toHaveBeenCalled();
      expect(instance.state.selectedChoice).toBeNull();
    });

    it('mouse-select (onChoiceClick) then keyboard-place (onDragEnd) completes the placement', () => {
      instance.onChoiceClick(choiceData);
      instance.onDragEnd({
        over: { data: { current: targetData } },
        active: { data: { current: choiceData } },
      });

      expect(onSessionChange).toHaveBeenCalled();
      expect(instance.state.selectedChoice).toBeNull();
    });

    it('onDragCancel clears the selection without touching the session', () => {
      instance.selectChoice(choiceData);
      instance.onDragCancel();

      expect(instance.state.selectedChoice).toBeNull();
      expect(onSessionChange).not.toHaveBeenCalled();
    });

    it('onDragEnd (a completed real drag) clears any mirrored selection', () => {
      instance.selectChoice(choiceData);
      instance.onDragEnd({ over: null, active: { data: { current: { type: 'choice' } } } });

      expect(instance.state.selectedChoice).toBeNull();
    });
  });
});
