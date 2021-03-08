export const assertProp = (getEl, name, expected) => {
  it(`sets ${name} to ${expected}`, () => {
    let el = getEl();
    // console.log('el: ', el.debug());
    expect(el.prop(name)).toEqual(expected);
  });
};

const xScale = jest.fn(function(n) {
  return n;
});
xScale.invert = jest.fn(function(n) {
  return n;
});

export const stubContext = {
  xScale: xScale,
  snapValue: jest.fn(function(n) {
    return n;
  })
};
