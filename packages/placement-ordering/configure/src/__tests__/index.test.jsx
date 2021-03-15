import { addWeightToCorrectResponse } from '../index';

jest.mock('@pie-lib/config-ui', () => ({
    FeedbackConfig: props => (<div />),
    FormSection: props => (<div />),
    InputContainer: props => (<div />),
    layout: {
        ConfigLayout: props => <div>{props.children}</div>
    },
    settings: {
        Panel: props => <div onChange={props.onChange} />,
        toggle: jest.fn(),
        radio: jest.fn()
    }
}));

describe('addWeightToCorrectResponse', () => {
    it('should return an array of objects { id, weight} if correctResponse is an array of strings', () => {
        const correctResponse = ['c1', 'c2', 'c3', 'c4'];
        const result = [{ id: 'c1', weight: 0 }, { id: 'c2', weight: 0 }, { id: 'c3', weight: 0 }, { id: 'c4', weight: 0 }];

        expect(addWeightToCorrectResponse(correctResponse)).toEqual(expect.arrayContaining(result));
    });

    it('should keep the array of objects { id, weight} if correctResponse is an array of objects', () => {
        const correctResponse = [{ id: 'c1', weight: 3 }, { id: 'c2', weight: 3 }, { id: 'c3', weight: 3 }, { id: 'c4', weight: 3 }];
        const result = [{ id: 'c1', weight: 3 }, { id: 'c2', weight: 3 }, { id: 'c3', weight: 3 }, { id: 'c4', weight: 3 }];

        expect(addWeightToCorrectResponse(correctResponse)).toEqual(expect.arrayContaining(result));
    });

    it('should return empty array for undefined correctResponse', () => {
        const correctResponse = undefined;
        const result = [];

        expect(addWeightToCorrectResponse(correctResponse)).toEqual(expect.arrayContaining(result));
    });
    it('should return empty array for null correctResponse', () => {
        const correctResponse = null;
        const result = []

        expect(addWeightToCorrectResponse(correctResponse)).toEqual(expect.arrayContaining(result));
    });
});
