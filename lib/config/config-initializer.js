"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const util = require("util"),
      inquirer = require("inquirer"),
      ConfigFile = require("./config-file"),
      ConfigOps = require("./config-ops"),
      log = require("../logging");


//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

// Process user's answers and create config object
function processAnswers(answers) {
  let config = { format: "",
                rules: {},
                content: {
                  global: {},
                  serve: {},
                  lint: {
                    rules: [],
                    skip: []
                  }
                }
              };

  config.format = answers.format;
  config.content.global.jsonSchema = answers.globalJsonSchema;
  config.content.serve.port = answers.servePort;
  config.content.lint.jsonSchema = answers.lintJsonSchema;
  if (answers.lintRulesFileLocation) { config.content.lint.rules.push(answers.lintRulesFileLocation); }
  if (answers.lintRulesStrict) { config.content.lint.rules.push(answers.lintRulesStrict); }
  config.content.lint.skip.push(answers.lintSkip);

  ConfigOps.normalizeToStrings(config)
  return config
}

// Create .speccy file in the current working directory
function writeFile(config) {

  // default is .yml
  let extName = ".yml";

  if (config.format === "json") {
    extName = ".json"
  }

  ConfigFile.write(config, `./.speccy${extName}`);
  log.info(`Successfully created .speccy${extName} file in ${process.cwd()}`);

}

function promptUser() {

  return inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "What format would you like your Speccy config file to be in?",
      default: "YAML",
      choices: [
        { name: "YAML", value: "yaml" },
        { name: "JSON", value: "json" }
      ]
    },
    {
      type: "confirm",
      name: "globalJsonSchema",
      message: "Enable JSON Schema globally?",
      default: true
    },
    {
      type: "input",
      name: "servePort",
      message: "What is the serve port number?",
      default: 8000
    },
    {
      type: "confirm",
      name: "lintJsonSchema",
      message: "Enable JSON Schema for linting?",
      default: true
    },
    {
      type: "confirm",
      name: "lintRulesStrict",
      message: "Enable strict for lint?",
      default: true
    },
    {
      type: "input",
      name: "lintRulesFileLocation",
      message: "Enter lint rules file location",
      default: "./config/foo-rules.json"
    },
    {
      type: "input",
      name: "lintSkip",
      message: "What shall the linter skip?",
      default: "info-contact"
    }
  ]).then(answers => {
    if (answers.lintRulesStrict) {
      answers.lintRulesStrict = "strict";
    } else {
      delete answers.lintRulesStrict
    }
    const totalAnswers = Object.assign({}, answers);
    const config = processAnswers(totalAnswers);

    return writeFile(config);
  });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

const init = {
  processAnswers,
  initializeConfig() {
    return promptUser();
  }
};

module.exports = init;
