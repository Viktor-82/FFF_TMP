"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrinterDiscoveryError = void 0;
class PrinterDiscoveryError extends Error {
  message = '';
  name = 'PrinterDiscoveryError';
  timestamp = 0;
  status = '';
  methodName = '';
  constructor(params) {
    super(params.message);
    Object.assign(this, params);
  }
}
exports.PrinterDiscoveryError = PrinterDiscoveryError;
PrinterDiscoveryError.prototype.name = 'PrinterDiscoveryError';
//# sourceMappingURL=PrinterDiscoveryError.js.map