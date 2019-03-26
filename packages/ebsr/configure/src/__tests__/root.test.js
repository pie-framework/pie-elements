describe('Root', () => {
  let ebsr;

  beforeEach(function () {
    document.getElementById('ebsr-fixture').create();
    ebsr = document.querySelector('ebsr-element');
  });

  // just for testing purposes
  it('exists', () => {
    expect(ebsr.toString().length).to.equal(20);
  });

  // other tests goes here
});
