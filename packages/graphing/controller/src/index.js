import debug from 'debug';

import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
const log = debug('@pie-element:graphing:controller');

export function model(question, session, env) {
  return new Promise(resolve => {
    const {
      backgroundMarks,
      answers,
      domain,
      prompt,
      range,
      rationale,
      title,
      xAxisLabel,
      yAxisLabel,
      displayedTools
    } = question;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      backgroundMarks,
      domain,
      prompt,
      range,
      rationale,
      title,
      xAxisLabel,
      yAxisLabel,
      displayedTools,
    };

    const out = Object.assign(base, {
      correctResponse: env.mode === 'evaluate' ? answers : undefined
    });
    let correctnessMarks = {};


    if (env.mode === 'evaluate') {
      Object.keys(question.answers).map(answer => {
        const response = question.answers[answer];
        const marks = response.marks;
        correctnessMarks[answer] = [];

        session.answers.forEach(sessAnswer => {
          let index;

          switch (sessAnswer.type) {
            case 'point':
              index = marks.find(mark => isEqual(mark.x, sessAnswer.x) && isEqual(mark.y, sessAnswer.y));
              break;
            case 'segment':
            case 'line':
              index = marks.find(mark => ((isEqual(mark.from, sessAnswer.from) && isEqual(mark.to, sessAnswer.to)) || ((isEqual(mark.to, sessAnswer.from) && isEqual(mark.from, sessAnswer.to)))))
              break;
            case 'ray':
            case 'vector':
              index = marks.find(mark => ((isEqual(mark.from, sessAnswer.from) && isEqual(mark.to, sessAnswer.to))));
              break;
            case 'polygon':
              const polygons = marks.filter(mark => mark.type === 'polygon');

              polygons.forEach(poly => {
                const sessAnswerPoints = lodash.uniqWith(sessAnswer.points, isEqual);
                const withoutDuplicates = lodash.uniqWith(poly.points, isEqual);
                const sB = lodash.orderBy(sessAnswerPoints, 'x');
                const sD = lodash.orderBy(withoutDuplicates, 'x');

                index = isEqual(sD, sB);
              });
              break;
            case 'circle':
              index = marks.filter(mark => {
                const equalRootAndEdge = isEqual(mark.edge, sessAnswer.edge) && isEqual(mark.root, sessAnswer.root);
                const equalRAndRoot = isEqual(mark.root, sessAnswer.root) && isEqual(Math.abs(mark.edge.x - mark.root.x), Math.abs(sessAnswer.edge.x - sessAnswer.root.x));

                if (equalRootAndEdge || equalRAndRoot) {
                    return mark;
                } else {
                  return null;
                }
              });
              break;
            case 'sine':
            case 'parabola':
              index = marks.find(mark => ((isEqual(mark.edge, sessAnswer.edge) && isEqual(mark.root, sessAnswer.root))));
              break;
            default: break;
          }

          if (index) {
            correctnessMarks[answer].push({ ...sessAnswer, correctness: 'correct' });
          } else {
            correctnessMarks[answer].push({ ...sessAnswer, correctness: 'incorrect' });
          }
        });
      });

      console.log(correctnessMarks);
      out.correctMarks = correctnessMarks;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = question.rationale;
    } else {
      out.rationale = null;
    }

    log('out: ', out);
    resolve(out);
  });
}
