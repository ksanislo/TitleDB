'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntryFormatter = function () {
    function EntryFormatter($filter) {
        _classCallCheck(this, EntryFormatter);

        this.formatDate = function (format) {
            return function (date) {
                return $filter('date')(date, format);
            };
        };
        this.formatNumber = function (format) {
            return function (number) {
                return $filter('numeraljs')(number, format);
            };
        };
    }

    _createClass(EntryFormatter, [{
        key: 'formatField',
        value: function formatField(field) {
            var label = field.label() || field.name();
            var type = field.type();
            switch (type) {
                case 'boolean':
                case 'choice':
                case 'choices':
                case 'string':
                case 'text':
                case 'wysiwyg':
                case 'email':
                case 'json':
                case 'file':
                    return function (entry) {
                        return {
                            name: label,
                            value: entry.values[field.name()]
                        };
                    };
                case 'template':
                    return function (entry) {
                        return {
                            name: label,
                            value: field.getTemplateValue(entry)
                        };
                    };
                case 'number':
                case 'float':
                    var formatNumber = this.formatNumber(field.format());
                    return function (entry) {
                        return {
                            name: label,
                            value: formatNumber(entry.values[field.name()])
                        };
                    };
                case 'date':
                case 'datetime':
                    var format = field.format();
                    if (!format) {
                        format = type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
                    }

                    var formatDate = this.formatDate(format);
                    return function (entry) {
                        return {
                            name: label,
                            value: formatDate(entry.values[field.name()])
                        };
                    };
                case 'reference':
                    return function (entry) {
                        return {
                            name: label,
                            value: entry.listValues[field.name()]
                        };
                    };
                case 'reference_many':
                    return function (entry) {
                        return {
                            name: label,
                            value: entry.listValues[field.name()].join(', ')
                        };
                    };
                case 'referenced_list':
                    return; //ignored
            }
        }
    }, {
        key: 'getFormatter',
        value: function getFormatter(fields) {
            var fieldsFormatters = fields.map(this.formatField.bind(this));

            return function formatEntry(entry) {
                var result = {};
                fieldsFormatters.map(function (formatter) {
                    if (!formatter) {
                        return;
                    }
                    return formatter(entry);
                }).forEach(function (field) {
                    if (!field) {
                        return;
                    }
                    result[field.name] = field.value;
                });

                return result;
            };
        }
    }]);

    return EntryFormatter;
}();

exports.default = EntryFormatter;


EntryFormatter.$inject = ['$filter'];
module.exports = exports['default'];
//# sourceMappingURL=EntryFormatter.js.map