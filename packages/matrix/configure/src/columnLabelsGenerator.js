export const AGREEMENT_3 = ['Disagree', 'Unsure', 'Agree'];
const AGREEMENT_5 = ['Strongly Disagree', ...AGREEMENT_3, 'Strongly Agree'];
const AGREEMENT_7 = ['Extremely Disagree', ...AGREEMENT_5, 'Extremely Agree'];
const FREQUENCY_3 = ['Infrequently', 'Unsure', 'Frequently'];
const FREQUENCY_5 = ['Very Infrequently', ...FREQUENCY_3, 'Very Frequently'];
const FREQUENCY_7 = ['Never', ...FREQUENCY_5, 'Always'];
const YES_NO_3 = ['No', 'Unsure', 'Yes'];
const YES_NO_5 = ['No', 'Not really', 'Unsure', 'Sometimes', 'Yes'];
const YES_NO_7 = ['No', 'Rarely', 'Not really', 'Unsure', 'Sometimes', 'Very Often', 'Always'];
const LIKELIHOOD_3 = ['Not Likely', 'Unsure', 'Likely'];
const LIKELIHOOD_5 = ['Very Unlikely', ...LIKELIHOOD_3, 'Very Likely'];
const LIKELIHOOD_7 = ['Extremely Unlikely', ...LIKELIHOOD_5, 'Extremely Likely'];
const IMPORTANCE_3 = ['Not Important', 'Unsure', 'Important'];
const IMPORTANCE_5 = ['Very Not Important', ...IMPORTANCE_3, 'Very Important'];
const IMPORTANCE_7 = ['Extremely Not Important', ...IMPORTANCE_5, 'Extremely Important'];
const LIKE_3 = ['Dislike', 'Unsure', 'Like'];
const LIKE_5 = ['Really Dislike', ...LIKE_3, 'Really Like'];
const LIKE_7 = ['Extremely Dislike', ...LIKE_5, 'Extremely Like'];

const config = {
  agreement_3: AGREEMENT_3,
  agreement_5: AGREEMENT_5,
  agreement_7: AGREEMENT_7,
  frequency_3: FREQUENCY_3,
  frequency_5: FREQUENCY_5,
  frequency_7: FREQUENCY_7,
  yesNo_3: YES_NO_3,
  yesNo_5: YES_NO_5,
  yesNo_7: YES_NO_7,
  likelihood_3: LIKELIHOOD_3,
  likelihood_5: LIKELIHOOD_5,
  likelihood_7: LIKELIHOOD_7,
  importance_3: IMPORTANCE_3,
  importance_5: IMPORTANCE_5,
  importance_7: IMPORTANCE_7,
  like_3: LIKE_3,
  like_5: LIKE_5,
  like_7: LIKE_7,
};

const generateColumnLabels = (labelType, size) => {
  return config[`${labelType}_${size}`];
};

export default generateColumnLabels;
