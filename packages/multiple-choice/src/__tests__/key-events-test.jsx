import MultipleChoice from '../multiple-choice';

describe('MultipleChoice', () => {
  let instance;

  beforeEach(() => {
    instance = new MultipleChoice();
    instance._model = {
      choices: [
        { value: '1' },
        { value: '2' },
        { value: '3' },
      ],
      choiceMode: 'checkbox',
    };
    instance._session = { value: [] };
    instance._onChange = jest.fn();
  });

  describe('handleKeyDown', () => {
    const simulateKeyDown = (key) => {
      const event = new KeyboardEvent('keydown', { key });
      instance.handleKeyDown(event);
    };

    it('selects a choice on valid numeric key (checkbox)', () => {
      simulateKeyDown('1');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '1',
        selected: true,
      });
    });

    it('toggles a choice on valid numeric key (checkbox)', () => {
      instance._session.value = ['1'];
      simulateKeyDown('1');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '1',
        selected: false,
      });
    });

    it('selects a choice on valid alphabetic key (checkbox)', () => {
      simulateKeyDown('a');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '1',
        selected: true,
      });
    });

    it('does nothing on invalid key', () => {
      simulateKeyDown('z');
      expect(instance._onChange).not.toHaveBeenCalled();
    });

    it('selects a choice in radio mode', () => {
      instance._model.choiceMode = 'radio';
      simulateKeyDown('2');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '2',
        selected: true,
      });
    });

    it('replaces the selected choice in radio mode', () => {
      instance._model.choiceMode = 'radio';
      instance._session.value = ['1'];
      simulateKeyDown('3');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '3',
        selected: true,
      });
    });

    it('does not toggle the same choice in radio mode', () => {
      instance._model.choiceMode = 'radio';
      instance._session.value = ['1'];
      simulateKeyDown('1');
      expect(instance._onChange).toHaveBeenCalledWith({
        value: '1',
        selected: true,
      });
    });

    it('does nothing if model is missing', () => {
      instance._model = null;
      simulateKeyDown('1');
      expect(instance._onChange).not.toHaveBeenCalled();
    });

    it('does nothing if session is missing', () => {
      instance._session = null;
      simulateKeyDown('1');
      expect(instance._onChange).not.toHaveBeenCalled();
    });
  });
});
