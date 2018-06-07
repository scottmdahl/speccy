"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
      path = require("path"),
      stringify = require("json-stable-stringify-without-jsonify"),
      log = require("../logging");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Determines sort order for object keys for json-stable-stringify
function sortByKey(a, b) {
    return a.key > b.key ? 1 : -1;
}

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

// Writes a configuration file
function write(config, filePath) {
  switch (path.extname(filePath)) {
    case ".json":
      writeJSONConfigFile(config, filePath);
      break;

    case ".yaml":
    case ".yml":
      writeYAMLConfigFile(config, filePath);
      break;

    default:
      throw new Error("Can't write to unknown file type.");
  }
}

//
function writeJSONConfigFile(config, filePath) {
  const content = stringify(config.content, { cmp: sortByKey, space: 4 });

  fs.writeFileSync(filePath, content, "utf8");
}

//
function writeYAMLConfigFile(config, filePath) {
  const yaml = require("js-yaml");

  const content = yaml.safeDump(config.content, { sortKeys: true });

  fs.writeFileSync(filePath, content, "utf8");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
  write
};
