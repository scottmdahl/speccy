"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const RULE_SEVERITY_STRINGS = ["off", "warn", "error"],
      RULE_SEVERITY = RULE_SEVERITY_STRINGS.reduce((map, value, index) => {
        map[value] = index;
        return map;
      }, {}),
      VALID_SEVERITIES = [0, 1, 2, "off", "warn", "error"];

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {

  // Converts old-style serverity settings (0, 1, 2) into new-style
  // severity strings (off, warn, error) for all rules. Assumption is that severity
  // values have already been validated as correct.
  normalizeToStrings(config) {

    if (config.rules) {
      Object.keys(config.rules).forEach(ruleId => {
        const ruleConfig = config.rules[ruleId];

        if (typeof ruleConfig === "number") {
          config.rules[ruleId] = RULE_SEVERITY_STRINGS[ruleConfig] || RULE_SEVERITY_STRINGS[0];
        } else if (Array.isArray(ruleConfig) && typeof ruleConfig[0] === "number") {
          ruleConfig[0] = RULE_SEVERITY_STRINGS[ruleConfig[0]] || RULE_SEVERITY_STRINGS[0];
        }
      });
    }
  }
}
