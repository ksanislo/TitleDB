'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = loader;
/**
 * Display loader on each route change
 *
 * @param {$rootScope}  $rootScope
 * @param {$window}     $window
 * @param {progression} progression
 */
function loader($rootScope, $window, progression) {
    $rootScope.$on('$stateChangeStart', function () {
        progression.start();
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        progression.done();
        $window.scrollTo(0, 0);
    });

    $rootScope.$on("$stateChangeError", function () {
        progression.done();
    });
}

loader.$inject = ['$rootScope', '$window', 'progression'];
module.exports = exports['default'];
//# sourceMappingURL=Loader.js.map