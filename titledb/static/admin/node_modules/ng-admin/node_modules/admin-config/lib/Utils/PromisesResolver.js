'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PromisesResolver = (function () {
    function PromisesResolver() {
        _classCallCheck(this, PromisesResolver);
    }

    _createClass(PromisesResolver, null, [{
        key: 'empty',
        value: function empty(value) {
            return new Promise(function (resolve) {
                resolve(value);
            });
        }
    }, {
        key: 'allEvenFailed',
        value: function allEvenFailed(promises) {
            if (!Array.isArray(promises)) {
                throw Error('allEvenFailed can only handle an array of promises');
            }

            return new Promise(function (resolve, reject) {
                if (promises.length === 0) {
                    return resolve([]);
                }

                var states = [],
                    results = [];

                promises.forEach(function (promise, key) {
                    states[key] = false; // promises are not resolved by default
                });

                promises.forEach(function (promise, key) {
                    function resolveState(result) {
                        states[key] = true;
                        results[key] = result; // result may be an error
                        for (var i in states) {
                            if (!states[i]) {
                                return;
                            }
                        }

                        resolve(results);
                    }

                    function resolveSuccess(result) {
                        return resolveState({ status: 'success', result: result });
                    }

                    function resolveError(result) {
                        return resolveState({ status: 'error', error: result });
                    }

                    // whether the promise ends with success or error, consider it done
                    promise.then(resolveSuccess, resolveError);
                });
            });
        }
    }]);

    return PromisesResolver;
})();

exports['default'] = PromisesResolver;
module.exports = exports['default'];
//# sourceMappingURL=PromisesResolver.js.map