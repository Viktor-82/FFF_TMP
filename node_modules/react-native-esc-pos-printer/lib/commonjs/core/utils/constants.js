"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remapConstants = remapConstants;
function remapConstants(constants) {
  return Object.keys(constants).reduce((acc, key) => {
    const value = constants[key];
    acc[String(value)] = key;
    return acc;
  }, {});
}
//# sourceMappingURL=constants.js.map