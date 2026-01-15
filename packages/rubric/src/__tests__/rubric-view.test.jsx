import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Rubric from '../main';

describe('rubric viewer', () => {
    const wrapper = (extras) => {
        const props = {
            value: {
                points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
                sampleAnswers: [null, 'just right', 'not left', null],
                excludeZero: false,
                ...extras,
            },
        };

        return render(<Rubric {...props} />);
    };

    describe('snapshot', () => {
        it('renders', () => {
            const { container } = wrapper();
            expect(container).toMatchSnapshot();
        });
    });

    describe('expanded snapshot', () => {
        it('renders', async () => {
            const { container } = wrapper();
            const toggle = container.querySelector('#rubric-toggle');
            await userEvent.click(toggle);
            expect(container).toMatchSnapshot();
        });
    });

    describe('exclude zeros', () => {
        it('renders correctly with excluded zeroes', async () => {
            let result = wrapper({
                excludeZero: true,
                points: ['a teeny bit right', 'mostly right', 'bingo'],
                sampleAnswers: ['just right', 'not left', null]
            });
            let toggle = result.container.querySelector('#rubric-toggle');
            await userEvent.click(toggle);
            expect(result.container.querySelectorAll('li').length).toEqual(5);

            result = wrapper({excludeZero: false});
            toggle = result.container.querySelector('#rubric-toggle');
            await userEvent.click(toggle);
            expect(result.container.querySelectorAll('li').length).toEqual(6);
        });
    });
});
