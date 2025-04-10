export const haveSameValuesButDifferentOrder = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;

    const toSortedJson = (arr) =>
        arr
            .map((item) => JSON.stringify(item))
            .sort();

    const sortedArr1 = toSortedJson(arr1);
    const sortedArr2 = toSortedJson(arr2);

    const hasSameValues = sortedArr1.every((val, i) => val === sortedArr2[i]);
    const hasSameOrder = arr1.every((item, i) =>
        JSON.stringify(item) === JSON.stringify(arr2[i])
    );

    return hasSameValues && !hasSameOrder;
};
