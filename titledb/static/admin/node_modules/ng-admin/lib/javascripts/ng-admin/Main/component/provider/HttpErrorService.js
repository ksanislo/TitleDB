'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var HttpErrorService = function HttpErrorService($state, $translate, notification) {
    return {
        handleError: function handleError(event, toState, toParams, fromState, fromParams, error) {
            switch (error.status) {
                case 404:
                    this.handle404Error(event, error);
                    break;
                case 403:
                    this.handle403Error(error);
                    break;
                default:
                    this.handleDefaultError(error);
                    break;
            }
        },

        handle404Error: function handle404Error(event) {
            event.preventDefault();
            $state.go('ma-404');
        },

        handle403Error: function handle403Error(error) {
            $translate('STATE_FORBIDDEN_ERROR', { message: error.data.message }).then(this.displayError);
            throw error;
        },

        handleDefaultError: function handleDefaultError(error) {
            $translate('STATE_CHANGE_ERROR', { message: error.data.message }).then(this.displayError);
            throw error;
        },

        displayError: function displayError(text) {
            return notification.log(text, { addnCls: 'humane-flatty-error' });
        }
    };
};

HttpErrorService.$inject = ['$state', '$translate', 'notification'];

exports.default = { $get: HttpErrorService };
module.exports = exports['default'];
//# sourceMappingURL=HttpErrorService.js.map