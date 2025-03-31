export const  haveSameValuesButDifferentOrder = ( arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const normalize = arr =>
        [...arr]
            .map(item => JSON.stringify(item))
            .sort();

    const sorted1 = normalize(arr1);
    const sorted2 = normalize(arr2);

    const sameValues = sorted1.every((val, i) => val === sorted2[i]);
    const sameOrder = arr1.every((item, i) =>
        item.id === arr2[i]?.id && item.name === arr2[i]?.name
    );

    return sameValues && !sameOrder;
};
