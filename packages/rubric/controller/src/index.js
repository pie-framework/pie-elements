import defaults from './defaults';

const normalize = (model) => ({ ...defaults, ...model });

export function model(model, session, env) {
  return new Promise((resolve) => {
    const modelResult = normalize(model || {});

    resolve(env && env.role && env.role === 'instructor' ? modelResult : {});
  });
}

function markupToText(s) {
  return (s || '').replace(/(<([^>]+)>)/gi, '');
}

// IMPORTANT! If you make any changes to this function, please make sure you also update complex-rubric/controller/validateSimpleRubric function!“.
export function validate(model) {
  const { points } = model;
  const errors = {};
  const pointsDescriptorsErrors = {};

  (points || []).forEach((point, index) => {

    if (!point || point === '<div></div>') {
      pointsDescriptorsErrors[index] = 'Points descriptors cannot be empty.';
    } else {
      const identicalPointDescr = points.slice(index + 1).some((p) => markupToText(p) === markupToText(point));

      if (identicalPointDescr) {
        pointsDescriptorsErrors[index] = 'Points descriptors should be unique.';
      }
    }
  });

  if (Object.keys(pointsDescriptorsErrors).length > 0) {
    errors.pointsDescriptorsErrors = pointsDescriptorsErrors;
  }

  return errors;
}
