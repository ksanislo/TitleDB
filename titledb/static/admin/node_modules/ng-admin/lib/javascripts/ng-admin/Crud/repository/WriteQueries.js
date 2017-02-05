'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WriteQueries;
/**
 * @param {RestWrapper} RestWrapper
 * @param {Configuration} Configuration
 * @param {AdminDescription} AdminDescription
 * @param {PromisesResolver} PromisesResolver
 *
 * @returns {ReadQueries}
 * @constructor
 */
function WriteQueries(RestWrapper, Configuration, AdminDescription, PromisesResolver) {
  return AdminDescription.getWriteQueries(RestWrapper, PromisesResolver, Configuration());
}

WriteQueries.$inject = ['RestWrapper', 'NgAdminConfiguration', 'AdminDescription', 'PromisesResolver'];
module.exports = exports['default'];
//# sourceMappingURL=WriteQueries.js.map