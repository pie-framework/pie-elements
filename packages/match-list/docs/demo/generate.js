const prompt = (id, relatedAnswer) => ({
  id,
  title: `Prompt ${id}`,
  relatedAnswer
});

const answer = (id) => ({
  id,
  title: `Answer ${id}`
});

exports.model = (id, element) => ({
  id,
  element,
  prompt: 'Your prompt goes here',
  prompts: [prompt(1, 1), prompt(3, 3), prompt(4, 4), prompt(2, 2)],
  answers: [answer(1), answer(2), answer(3), answer(4), answer(5), answer(6)],
  shuffled: false,
  feedback: {
    correct: {
      type: 'default',
      default: 'Correct'
    },
    partial: {
      type: 'default',
      default: 'Nearly'
    },
    incorrect: {
      type: 'default',
      default: 'Incorrect'
    }
  },
});
