
export const uid = {
  withUid: jest.fn(input => input),
  generateUid: jest.fn().mockReturnValue('1'),
  Provider: jest.fn(c => c)
};

export const PlaceHolder = props => (
  <div componentName="placeholder">{props.children}</div>
);

export const withDragContext = jest.fn(i => i);

export const swap = (input) => input
