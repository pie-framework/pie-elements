exports.model = (id, element) => ({
  "correctResponse": [
    { "type": "point", "pointType": "full", "domainPosition": 0 }
  ],
  "feedback": {
    "correct": { "type": "default", "default": "Correct" },
    "partial": { "type": "default", "default": "Nearly" },
    "incorrect": { "type": "default", "default": "Incorrect" }
  },
  "prompt": "",
  "widthEnabled": true,
  "graph": {
    "title": "",
    "arrows": { "left": true, "right": true },
    "width": 500,
    "domain": { "min": -5, "max": 5 },
    "ticks": { "minor": 1, "major": 2, "tickIntervalType": 'Integer' },
    "initialElements": [],
    "maxNumberOfPoints": 30,
    "showMinorTicks": true,
    "snapPerTick": 1,
    "tickLabelOverrides": [],
    "initialType": "PF",
    "exhibitOnly": false,
    "availableTypes": {
      "PF": true,
      "LFF": true,
      "LEF": true,
      "LFE": true,
      "LEE": true,
      "RFN": true,
      "RFP": true,
      "REN": true,
      "REP": true
    }
  },
  id,
  element,
});