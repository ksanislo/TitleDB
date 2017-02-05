'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HttpErrorHandler;
function HttpErrorHandler($rootScope, HttpErrorService) {
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        HttpErrorService.handleError(event, toState, toParams, fromState, fromParams, error);
    });
}

HttpErrorHandler.$inject = ['$rootScope', 'HttpErrorService'];
module.exports = exports['default'];
//# sourceMappingURL=HttpErrorHandler.js.map