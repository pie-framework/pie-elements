export const buildCategories = (categories, choices, correctResponse) => {
  return categories.map(category => {
    const cr = correctResponse.find(cr => cr.category === category.id);

    if (cr) {
      category.choices = (cr.choices || []).map(choiceId => {
        const choice = choices.find(h => h.id === choiceId);
        return Object.assign({}, { id: choice.id, content: choice.content });
      });
    }
    return category;
  });
};
