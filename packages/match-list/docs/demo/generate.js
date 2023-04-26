const twoZeroOne = (id, element) => ({
  id,
  element,
  answers: [
    {
      title:  "<img alt=\"\" src=\"https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d\"/>",
      id: 0,
    },
    {
      id: 1,
      title:  "<img alt=\"\" src=\"https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d\"/>",
    },
    {
      id: 2,
      title:  "<img alt=\"\" src=\"https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d\"/>",
    },
    {
      id: 3,
      title:  "<img alt=\"\" src=\"https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d\"/>",
    },
    {
      title: "<img alt=\"\" src=\"https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d\"/>",
      id: 4,
    },
  ],
  prompt:
    '<p>Look at the shapes below.</p><p><img alt="image 8c7d142a9af94abf80b021426879a815" id="8c7d142a9af94abf80b021426879a815" src="https://storage.googleapis.com/pie-staging-221718-assets/image/4ec622c1-51d0-4c4b-8282-cd9b7eb9ca22"></p><p></p><p>Each property describes one of the shapes. Drag and drop the property&nbsp;to its shape.</p>',
  shuffled: false,
  prompts: [
    {
      id: 0,
      title: 'Shape A',
      relatedAnswer: 3,
    },
    {
      id: 1,
      title: 'Shape B',
      relatedAnswer: 2,
    },
    {
      id: 2,
      title: 'Shape C',
      relatedAnswer: 1,
    },
    {
      id: 3,
      title: 'Shape D',
      relatedAnswer: 4,
    },
    {
      id: 4,
      title: 'Shape E',
      relatedAnswer: 0,
    },
  ],
});

exports.model = twoZeroOne;
