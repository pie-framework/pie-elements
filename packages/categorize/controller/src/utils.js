// used in configure too, for consistency modify it there too
export const multiplePlacements = { enabled: 'Yes', disabled: 'No', perChoice: 'Set Per Choice' };

// used to validate the config
export const isCorrectResponseDuplicated = (choices,alternate) => {
    const stringChoices =  JSON.stringify(choices.sort());
    const stringAlternate = alternate.filter(alternate => alternate.length > 0).map((alternate) => JSON.stringify(alternate.sort()));
    const foundIndexDuplicate = stringAlternate.findIndex(alternate => alternate.length &&  alternate === stringChoices);
    return foundIndexDuplicate;
};

export const isAlternateDuplicated = (alternate) => {
    const elementSet = new Set();
    const stringAlternate = alternate.filter(alternate=>alternate.length > 0).map((alternate) => JSON.stringify(alternate.sort()));
    for (let i = 0; i < stringAlternate.length; i++) {
        if (elementSet.has(stringAlternate[i]) && stringAlternate[i]) {
            return i;
        }
        elementSet.add(stringAlternate[i]);
    }

    return -1;
};
