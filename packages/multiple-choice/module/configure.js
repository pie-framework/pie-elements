import {_dll_react, _dll_prop_types, _dll_material_ui__core_styles, _dll_material_ui__core, _dll_lodash, _dll_react_dom} from "https://unpkg.com/@pie-ui/shared-lib@2.5.0/module/index.js";
import {_dll_pie_lib__editable_html, _dll_pie_lib__config_ui, _dll_pie_framework__pie_configure_events} from "../../shared-config@1.2.0/module/index.js";
function createCommonjsModule(fn, module) {
  return (module = {
    exports: {}
  }, fn(module, module.exports), module.exports);
}
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
var ms = function (val, options) {
  options = options || ({});
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = (/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i).exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}
function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}
function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}
function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  createDebug.instances = [];
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  function selectColor(namespace) {
    var hash = 0;
    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0;
    }
    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;
  function createDebug(namespace) {
    var prevTime;
    function debug() {
      if (!debug.enabled) {
        return;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var self = debug;
      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      if (typeof args[0] !== 'string') {
        args.unshift('%O');
      }
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        if (match === '%%') {
          return match;
        }
        index++;
        var formatter = createDebug.formatters[format];
        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }
    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend;
    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }
    createDebug.instances.push(debug);
    return debug;
  }
  function destroy() {
    var index = createDebug.instances.indexOf(this);
    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }
    return false;
  }
  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;
    for (i = 0; i < len; i++) {
      if (!split[i]) {
        continue;
      }
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  function disable() {
    createDebug.enable('');
  }
  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }
    var i;
    var len;
    for ((i = 0, len = createDebug.skips.length); i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }
    for ((i = 0, len = createDebug.names.length); i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }
  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }
    return val;
  }
  createDebug.enable(createDebug.load());
  return createDebug;
}
var common = setup;
var browser = createCommonjsModule(function (module, exports) {
  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
    return _typeof(obj);
  }
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
  function useColors() {
    if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function (match) {
      if (match === '%%') {
        return;
      }
      index++;
      if (match === '%c') {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  function log() {
    var _console;
    return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
  }
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem('debug', namespaces);
      } else {
        exports.storage.removeItem('debug');
      }
    } catch (error) {}
  }
  function load() {
    var r;
    try {
      r = exports.storage.getItem('debug');
    } catch (error) {}
    if (!r && typeof process !== 'undefined' && ('env' in process)) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {}
  }
  module.exports = common(exports);
  var formatters = module.exports.formatters;
  formatters.j = function (v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return '[UnexpectedJSONParseError]: ' + error.message;
    }
  };
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;
const React = _dll_react;
const PropTypes = _dll_prop_types;
const {withStyles: withStyles} = _dll_material_ui__core_styles;
const {Button: Button} = _dll_material_ui__core;
const {merge: merge} = _dll_lodash;
const EditableHtml = _dll_pie_lib__editable_html;
const {InputContainer: InputContainer} = _dll_pie_lib__config_ui;
const {ChoiceConfiguration: ChoiceConfiguration} = _dll_pie_lib__config_ui;
const {settings: settings} = _dll_pie_lib__config_ui;
const {layout: layout} = _dll_pie_lib__config_ui;
const {choiceUtils: utils} = _dll_pie_lib__config_ui;
const _jsxFileName = "/home/ede/dev/github/pie-framework/pie-elements/packages/multiple-choice/configure/src/main.jsx";
const {Panel, toggle, radio} = settings;
const styles = theme => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  rationaleHolder: {
    width: '70%'
  },
  rationale: {
    paddingTop: theme.spacing.unit * 2
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfigurationHolder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  choiceConfiguration: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  },
  addButton: {
    float: 'right'
  }
});
const Design = withStyles(styles)(props => {
  const {classes, model, configuration, onPromptChanged, onChoiceChanged, onRemoveChoice, onAddChoice, imageSupport, onChangeModel, onConfigurationChanged, onTeacherInstructionsChanged} = props;
  const {prompt = {}, addChoiceButton = {}, feedback = {}, deleteChoice = {}, choiceMode = {}, choicePrefix = {}, partialScoring = {}, lockChoiceOrder = {}, teacherInstructions = {}, studentInstructions = {}, rationale = {}, scoringType = {}, sequentialChoiceLabels = {}, settingsPanelDisabled} = configuration || ({});
  const {teacherInstructionsEnabled, rationaleEnabled, feedbackEnabled, promptEnabled} = model || ({});
  const Content = React.createElement('div', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    }
  }, teacherInstructionsEnabled && React.createElement(InputContainer, {
    label: teacherInstructions.label,
    className: classes.promptHolder,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    }
  }, React.createElement(EditableHtml, {
    className: classes.prompt,
    markup: model.teacherInstructions || '',
    onChange: onTeacherInstructionsChanged,
    imageSupport: imageSupport,
    nonEmpty: false,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 99
    }
  })), promptEnabled && React.createElement(InputContainer, {
    label: prompt.label,
    className: classes.promptHolder,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 110
    }
  }, React.createElement(EditableHtml, {
    className: classes.prompt,
    markup: model.prompt,
    onChange: onPromptChanged,
    imageSupport: imageSupport,
    nonEmpty: !prompt.settings,
    disableUnderline: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 111
    }
  })), model.choices.map((choice, index) => React.createElement('div', {
    key: `choice-${index}`,
    className: classes.choiceConfigurationHolder,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 122
    }
  }, React.createElement(ChoiceConfiguration, {
    key: index,
    index: index + 1,
    useLetterOrdering: model.choicePrefix === 'letters',
    className: classes.choiceConfiguration,
    mode: model.choiceMode,
    data: choice,
    defaultFeedback: {},
    imageSupport: imageSupport,
    onDelete: () => onRemoveChoice(index),
    onChange: c => onChoiceChanged(index, c),
    allowFeedBack: feedbackEnabled,
    allowDelete: deleteChoice.settings,
    noLabels: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 126
    }
  }), rationaleEnabled && React.createElement(InputContainer, {
    key: `rationale-${index}`,
    label: rationale.label,
    className: classes.rationaleHolder,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    }
  }, React.createElement(EditableHtml, {
    className: classes.rationale,
    markup: choice.rationale || '',
    onChange: c => onChoiceChanged(index, {
      ...choice,
      rationale: c
    }),
    imageSupport: imageSupport,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 147
    }
  })))), React.createElement('br', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 162
    }
  }), addChoiceButton.settings && React.createElement(Button, {
    className: classes.addButton,
    variant: "contained",
    color: "primary",
    onClick: onAddChoice,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 164
    }
  }, addChoiceButton.label));
  return React.createElement('div', {
    className: classes.design,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 177
    }
  }, settingsPanelDisabled ? Content : React.createElement(layout.ConfigLayout, {
    settings: React.createElement(Panel, {
      model: model,
      onChangeModel: onChangeModel,
      configuration: configuration,
      onChangeConfiguration: onConfigurationChanged,
      groups: {
        Settings: {
          choiceMode: choiceMode.settings && radio(choiceMode.label, ['checkbox', 'radio']),
          'sequentialChoiceLabels.enabled': sequentialChoiceLabels.settings && toggle(sequentialChoiceLabels.label, true),
          choicePrefix: choicePrefix.settings && radio(choicePrefix.label, ['numbers', 'letters']),
          partialScoring: partialScoring.settings && toggle(partialScoring.label),
          lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
          feedbackEnabled: feedback.settings && toggle(feedback.label)
        },
        Properties: {
          teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
          studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
          promptEnabled: prompt.settings && toggle(prompt.label),
          rationaleEnabled: rationale.settings && toggle(rationale.label),
          scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric'])
        }
      },
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 183
      }
    }),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 181
    }
  }, Content));
});
class Main extends React.Component {
  constructor(...args) {
    super(...args);
    Main.prototype.__init.call(this);
    Main.prototype.__init2.call(this);
    Main.prototype.__init3.call(this);
    Main.prototype.__init4.call(this);
    Main.prototype.__init5.call(this);
    Main.prototype.__init6.call(this);
  }
  static __initStatic() {
    this.propTypes = {
      model: PropTypes.object.isRequired,
      disableSidePanel: PropTypes.bool,
      onModelChanged: PropTypes.func.isRequired,
      onConfigurationChanged: PropTypes.func.isRequired,
      classes: PropTypes.object.isRequired,
      imageSupport: PropTypes.shape({
        add: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired
      })
    };
  }
  __init() {
    this.onRemoveChoice = index => {
      const {model} = this.props;
      model.choices.splice(index, 1);
      this.props.onModelChanged(model);
    };
  }
  __init2() {
    this.onAddChoice = () => {
      const {model} = this.props;
      model.choices.push({
        label: '',
        value: utils.firstAvailableIndex(model.choices.map(c => c.value), 0),
        feedback: {
          type: 'none'
        }
      });
      this.props.onModelChanged(model);
    };
  }
  __init3() {
    this.onChoiceChanged = (index, choice) => {
      const {model} = this.props;
      if (choice.correct && model.choiceMode === 'radio') {
        model.choices = model.choices.map(c => {
          return merge({}, c, {
            correct: false
          });
        });
      }
      model.choices.splice(index, 1, choice);
      this.props.onModelChanged(model);
    };
  }
  __init4() {
    this.onPromptChanged = prompt => {
      this.props.onModelChanged({
        ...this.props.model,
        prompt
      });
    };
  }
  __init5() {
    this.onTeacherInstructionsChanged = teacherInstructions => {
      this.props.onModelChanged({
        ...this.props.model,
        teacherInstructions
      });
    };
  }
  __init6() {
    this.onModelChanged = (model, key) => {
      const {onModelChanged} = this.props;
      switch (key) {
        case 'choiceMode':
          {
            let value = model.choiceMode;
            if (value === 'radio') {
              let correctFound = false;
              model.choices = model.choices.map(c => {
                if (correctFound) {
                  c.correct = false;
                  return c;
                }
                if (c.correct) {
                  correctFound = true;
                }
                return c;
              });
            }
            onModelChanged(model, true);
            break;
          }
        default:
          onModelChanged(model);
          break;
      }
    };
  }
  render() {
    return React.createElement(Design, {
      ...this.props,
      onChangeModel: this.onModelChanged,
      onRemoveChoice: this.onRemoveChoice,
      onChoiceChanged: this.onChoiceChanged,
      onAddChoice: this.onAddChoice,
      onPromptChanged: this.onPromptChanged,
      onTeacherInstructionsChanged: this.onTeacherInstructionsChanged,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 323
      }
    });
  }
}
Main.__initStatic();
const Styled = withStyles(styles)(Main);
var sensibleDefaults = {
  model: {
    choiceMode: 'checkbox',
    choicePrefix: 'numbers',
    choices: [],
    prompt: 'Question Prompt goes here',
    lockChoiceOrder: true,
    partialScoring: true,
    scoringType: 'auto',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    answerChoiceCount: 0,
    addChoiceButton: {
      settings: true,
      label: 'Add a Choice'
    },
    choiceMode: {
      settings: true,
      label: 'Response Type'
    },
    choicePrefix: {
      settings: true,
      label: 'Choice Labels'
    },
    deleteChoice: {
      settings: true
    },
    feedback: {
      settings: true,
      label: 'Feedback'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type'
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    }
  }
};
const React$1 = _dll_react;
const ReactDOM = _dll_react_dom;
const {defaults: defaults} = _dll_lodash;
const {DeleteImageEvent: DeleteImageEvent} = _dll_pie_framework__pie_configure_events;
const {InsertImageEvent: InsertImageEvent} = _dll_pie_framework__pie_configure_events;
const {ModelUpdatedEvent: ModelUpdatedEvent} = _dll_pie_framework__pie_configure_events;
const {choiceUtils: utils$1} = _dll_pie_lib__config_ui;
const log = browser('multiple-choice:configure');
const generateFormattedChoices = (choices, choiceCount = 0) => {
  if (!choices || choices.length === 0) {
    let formattedChoices = [];
    for (let i = 0; i < choiceCount; i++) {
      formattedChoices.push({
        value: `${i}`,
        label: '',
        feedback: {
          type: 'none',
          value: ''
        }
      });
    }
    return formattedChoices;
  }
  return choices;
};
const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);
  return {
    configuration,
    model: {
      ...model,
      choices: generateFormattedChoices(model && model.choices || [], configuration && configuration.answerChoiceCount)
    }
  };
};
class MultipleChoice extends HTMLElement {
  static __initStatic() {
    this.createDefaultModel = (model = {}) => utils$1.normalizeChoices({
      ...sensibleDefaults.model,
      ...model,
      choices: generateFormattedChoices(model && model.choices || [])
    });
  }
  constructor() {
    super();
    this._model = MultipleChoice.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }
  set model(s) {
    this._model = MultipleChoice.createDefaultModel(s);
    this._render();
  }
  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);
    this.onModelChanged(info.model);
    this._configuration = info.configuration;
    this._render();
  }
  set disableSidePanel(s) {
    this._disableSidePanel = s;
    this._render();
  }
  dispatchModelUpdated(reset) {
    const resetValue = !!reset;
    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }
  onModelChanged(m, reset) {
    this._model = m;
    this._render();
    this.dispatchModelUpdated(reset);
  }
  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;
    if (this._model) {
      this.onModelChanged(this._model);
    }
    this._render();
  }
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }
  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }
  _render() {
    log('_render');
    let element = React$1.createElement(Styled, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      disableSidePanel: this._disableSidePanel,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(element, this);
  }
}
MultipleChoice.__initStatic();
export default MultipleChoice;
