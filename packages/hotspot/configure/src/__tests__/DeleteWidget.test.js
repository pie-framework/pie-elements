import React from 'react';
import { render } from '@testing-library/react';
import DeleteWidget from '../DeleteWidget';

describe('DeleteWidget', () => {
    it('computes positionX and positionY correctly without points', () => {
        const mockHandleWidgetClick = jest.fn();

        const props = {
            id: 'someId',
            x: 5,
            y: 10,
            width: 30,
            height: 40,
            outlineColor: 'blue',
            handleWidgetClick: mockHandleWidgetClick,
        };

        const { container } = render(<DeleteWidget {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('computes positionX and positionY correctly with points', () => {
        const props = {
            id: 'someId',
            x: 5,
            y: 10,
            points: [
                {
                    "y": 151,
                    "x": 141
                },
                {
                    "y": 289,
                    "x": 205
                },
                {
                    "x": 269,
                    "y": 151
                }
            ],
            width: 30,
            height: 40,
            outlineColor: 'blue',
        };

        const { container } = render(<DeleteWidget {...props} />);
        expect(container).toMatchSnapshot();
    });
});
