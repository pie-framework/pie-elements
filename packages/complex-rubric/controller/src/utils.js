export const markupToText = (s) => {
    return (s || '').replace(/(<([^>]+)>)/ig, '');
};
