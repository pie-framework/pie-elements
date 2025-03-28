exports.model = (id, element) => ({
  id,
  element,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  rationale: null,
  prompt: '<p>Drag and drop the correct array into the box next to the matching word problem.</p>',
  lockChoiceOrder: true,
  choicesPosition: 'below',
  partialScoring: true,
  "choices": [
    {
      "id": "0",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/3817d829-a0c5-4766-b988-1fce3037984b\" width=\"90\">"
    },
    {
      "id": "1",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/121861da-2305-43df-8924-a186f007c3e1\" width=\"90\">"
    },
    {
      "id": "2",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/57d28f55-3645-45c5-9aae-762557fc750b\" width=\"90\">"
    },
    {
      "id": "3",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/ab2b1ec9-eb97-47de-bf6e-c8ecc9f5f2f6\" width=\"90\">"
    },
    {
      "id": "4",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/73c7a0e7-bb98-4fc5-8f1b-b4df579bdefd\" width=\"90\">"
    },
    {
      "id": "5",
      "value": "<img height=\"90\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/b6257bb1-4fd6-4e7a-954b-f2674c4e14af\" width=\"90\">"
    }
  ],
  "correctResponse": {
    "0": "3",
    "1": "0",
    "2": "5"
  },
  "markup": "<table class=\"table table-condensed lrn_width_auto role= table-no-border\" presentation=\"\"><tbody><tr><td>&nbsp; &nbsp; <img height=\"183\" src=\"https://assets.pie-api.com/assets/06bd55a0-f5f9-429a-a5d4-4fe9764598a2/image/svg xml/8936006b-59af-4fd1-b987-54f98507b7b8\" width=\"342\">&nbsp; &nbsp;&nbsp;</td><td>{{0}}</td><td>{{1}}</td><td>{{2}}</td></tr></tbody></table>",  duplicates: false,
  feedback: {},
  mode: 'gather',
  disabled: false,
  teacherInstructions: null,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
  "emptyResponseAreaHeight": "110px",
  "emptyResponseAreaWidth": "110px",
});
