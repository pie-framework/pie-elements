// used in configure too, for consistency modify it there too
export const multiplePlacements = { enabled: 'Yes', disabled: 'No', perChoice: 'Set Per Choice' };

// used to validate the config
export const isCorrectResponseDuplicated = (choices,alternate) => {
    if (choices.length < 1 || alternate.length < 1){
        return -1;
    }
    const stringChoices =  JSON.stringify(choices.sort());
    const stringAlternate = alternate.reduce((total, current) => current.length > 0 ? [...total, JSON.stringify(current.sort())] : total, []);
    const foundIndexDuplicate = stringAlternate.findIndex(alternate => alternate.length &&  alternate === stringChoices);
    return foundIndexDuplicate;
};

export const isAlternateDuplicated = (alternate) => {
    if (alternate.length <= 1){
        return -1;
    }
    const elementSet = new Set();
    const stringAlternate = alternate.reduce((total, current) => current.length > 0 ? [...total, JSON.stringify(current.sort())] : total, []);
    for (let i = 0; i < stringAlternate.length; i++) {
        if (elementSet.has(stringAlternate[i]) && stringAlternate[i]) {
            return i;
        }
        elementSet.add(stringAlternate[i]);
    }

    return -1;
};
