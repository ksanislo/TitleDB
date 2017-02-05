'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = PromisesResolver;
function PromisesResolver(AdminDescription) {
    return AdminDescription.getPromisesResolver();
}

PromisesResolver.$inject = ['AdminDescription'];
module.exports = exports['default'];
//# sourceMappingURL=PromisesResolver.js.map