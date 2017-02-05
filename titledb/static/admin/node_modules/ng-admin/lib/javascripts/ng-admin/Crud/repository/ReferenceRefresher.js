'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entry = require('admin-config/lib/Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReferenceRefresher = function () {
    function ReferenceRefresher(ReadQueries) {
        _classCallCheck(this, ReferenceRefresher);

        this.ReadQueries = ReadQueries;
    }

    _createClass(ReferenceRefresher, [{
        key: 'refresh',
        value: function refresh(field, currentValue, search) {
            var _this = this;

            var referenceFields = {};
            referenceFields[field.name()] = field;

            var promise = this.ReadQueries.getAllReferencedData(referenceFields, search).then(function (r) {
                return r[field.name()];
            }).then(function (results) {
                return _this._transformRecords(field, results);
            });

            if (field.type() === 'reference_many' || field.type() === 'choices') {
                promise = promise.then(function (formattedResults) {
                    return _this._removeDuplicates(formattedResults, currentValue);
                });
            }

            return promise;
        }
    }, {
        key: '_removeDuplicates',
        value: function _removeDuplicates(results, currentValue) {
            // remove already assigned values: ui-select still return them if multiple
            if (!currentValue) {
                return results;
            }

            if (!Array.isArray(currentValue)) {
                currentValue = [currentValue];
            }

            return results.filter(function (fr) {
                return currentValue.indexOf(fr.value) === -1;
            });
        }
    }, {
        key: '_transformRecords',
        value: function _transformRecords(field, records) {
            var targetEntity = field.targetEntity();
            var targetField = field.targetField();
            var valueFieldName = targetEntity.identifier().name();
            var labelFieldName = targetField.name();
            return _Entry2.default.createArrayFromRest(records, [targetField], targetEntity.name(), valueFieldName).map(function (r) {
                return {
                    value: r.values[valueFieldName],
                    label: r.values[labelFieldName]
                };
            });
        }
    }]);

    return ReferenceRefresher;
}();

exports.default = ReferenceRefresher;


ReferenceRefresher.$inject = ['ReadQueries'];
module.exports = exports['default'];
//# sourceMappingURL=ReferenceRefresher.js.map