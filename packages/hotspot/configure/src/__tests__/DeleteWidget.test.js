import React from 'react';
import { shallow } from 'enzyme';
import DeleteWidget from '../DeleteWidget'; // Adjust the import path as needed
import { ImageComponent } from '@pie-lib/pie-toolbox/icons';

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

        const wrapper = shallow(<DeleteWidget {...props} />);

        // Assert that the computed positionX and positionY match the expected values
        expect(wrapper.find(ImageComponent).prop('x')).toEqual(15);
        expect(wrapper.find(ImageComponent).prop('y')).toEqual(30);

        // Simulate a click event on the Group element
        wrapper.find('Group').simulate('click');

        // Assert that the handleWidgetClick function is called with the correct arguments
        expect(mockHandleWidgetClick).toHaveBeenCalledWith('someId');
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

        const wrapper = shallow(<DeleteWidget {...props} />);

        // Assert that the computed positionX and positionY match the expected values
        expect(wrapper.find(ImageComponent).prop('x')).toEqual(239);
        expect(wrapper.find(ImageComponent).prop('y')).toEqual(194);

    });
});
