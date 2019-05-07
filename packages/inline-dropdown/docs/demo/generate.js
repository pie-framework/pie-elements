const choice = (v, c) => ({ label: v, value: v, correct: !!c });

const markup = `<div>
  <img src="https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg"></img>
   <h5>Hey Diddle Diddle <i>by ?</i></h5>
 <p>1: Hey, diddle, diddle,</p>
 <p>2: The cat and the fiddle,</p>
 <p>3: The cow {{0}} over the moon;</p>
 <p>4: The little dog {{1}},</p>
 <p>5: To see such sport,</p>
 <p>6: And the dish ran away with the {{2}}.</p>
</div>`;

exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  markup: markup,
  choices: {
    0: [choice('Jumped', true), choice('Climbed'), choice('Flew')],
    1: [choice('Laughed', true), choice('Cried'), choice('Sang')],
    2: [choice('Spoon', true), choice('Fork'), choice('Knife')]
  },
  prompt: 'Use the dropdowns to complete the sentence'
});
