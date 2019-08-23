import { model } from '../index';

const choice = (l, v) => ({ label: l, value: v });

const d = {
  prompt: '',
  teacherInstructions: true,
  studentInstructions: false,
  choices: {
    0: [choice('A', '0'), choice('B', '1'), ],
  },
  markup:
    '<p>\n  <strong>Esta cuadrícula de coordenadas representa el diseño del salón de matemáticas de Valerie. Cada unidad en la cuadricula representa 1 pie cuadrado.&nbsp;</strong>\n</p>\n<p>\n  <strong>* El escritorio de Valeria se encuentra en (-3,-4)</strong>\n</p>\n<p>\n  <strong>* El escritorio de la maestra se encuentra en (5,-4)</strong>\n</p>\n<p>\n  <strong>* El cuarto de materiales se encuentra&nbsp; en (-3,-7)</strong>\n</p>\n<p>\n  <strong><img src="https://storage.googleapis.com/pie-staging-221718-assets/image/180d28b2-0376-428e-b415-de96e158b7e7" alt=""></strong>\n</p>\n<p>\n  &nbsp;\n</p>\n<p>\n  <strong>Anota la distancia, en pies, desde el escritorio de Valerie al cuarto de materiales.</strong>\n</p>\n<p>\n  {{0}} <strong>pies</strong>\n</p>',
  id: '2422330',
  rubric: '',
  element: 'explicit-constructed-response-element',
  autoScoring: 'partial',
  rationale: ''
};

describe('edge cases', () => {
  it('does not throw an error if the session has no value', async () => {
    const result = model(d, {}, { mode: 'evaluate' });
    expect(result).toBeDefined();
  });

  describe('model - with updateSession', () => {
    it('calls updateSession', async () => {
      const session = { id: '1', element: 'explicit-constructed-response' };
      const env = { mode: 'gather' };
      const updateSession = jest.fn().mockResolvedValue();
      await model(d, session, env, updateSession);
      expect(updateSession).toHaveBeenCalledWith('1', 'explicit-constructed-response', {
        shuffledValues: expect.arrayContaining(['A', 'B'])
      });
    });
  });
});
