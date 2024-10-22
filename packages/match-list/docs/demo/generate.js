exports.model = (id, element) => ({
  id,
  element,
  lockChoiceOrder: true,
  answers: [
    {
      id: 2,
      title: 'Battle of Lexington and Concord'
    },
    {
      id: 3,
      title: 'Declaration of Independence'
    },
    {
      id: 1,
      title: 'Boston Tea Party'
    },
    {
      id: 0,
      title: 'French and Indian War'
    },
    {
      id: 4,
      title: 'Constitutional Convention'
    }
  ],
  prompt: '<p>Match each year to the corresponding historical event. Drag and drop the events.</p>',
  prompts: [          {
    id: 1,
    title: '1754',
    relatedAnswer: 0
  },
    {
      id: 2,
      title: '1773',
      relatedAnswer: 1
    },
    {
      id: 3,
      title: '1775',
      relatedAnswer: 2
    },
    {
      id: 4,
      title: '1776',
      relatedAnswer: 3
    },
    {
      id: 5,
      title: '1787',
      relatedAnswer: 4
    }
  ],
});
