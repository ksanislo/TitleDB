'use strict';

/*global describe,it,expect,beforeEach*/
describe('ListLayoutController', function () {
    var getCurrentSearchParam = require('../../../../ng-admin/Crud/list/ListLayoutController').getCurrentSearchParam;

    describe('getCurrentSearchParam', function () {
        it('should return search url parameter mapped by filter', function () {
            var location = {
                search: function search() {
                    return { search: JSON.stringify({ name: 'doe' }) };
                }
            };

            var filters = [{ pinned: function pinned() {
                    return false;
                }, name: function name() {
                    return 'name';
                }, getMappedValue: function getMappedValue(value) {
                    return 'mapped name for ' + value;
                } }, { pinned: function pinned() {
                    return false;
                }, name: function name() {
                    return 'firstname';
                }, getMappedValue: function getMappedValue(value) {
                    return 'mapped firstname for ' + value;
                } }];

            expect(getCurrentSearchParam(location, filters)).toEqual({ name: 'mapped name for doe' });
        });

        it('should add pinned filter defaultValue if not already set', function () {
            var location = {
                search: function search() {
                    return { search: JSON.stringify({ name: 'doe' }) };
                }
            };

            var filters = [{
                pinned: function pinned() {
                    return false;
                },
                name: function name() {
                    return 'name';
                },
                getMappedValue: function getMappedValue(value) {
                    return 'mapped name for ' + value;
                }
            }, {
                pinned: function pinned() {
                    return true;
                },
                name: function name() {
                    return 'firstname';
                },
                getMappedValue: function getMappedValue(value) {
                    return 'mapped firstname for ' + value;
                },
                defaultValue: function defaultValue(value) {
                    return 'default value for firstname';
                }
            }];

            expect(getCurrentSearchParam(location, filters)).toEqual({ name: 'mapped name for doe', firstname: 'mapped firstname for default value for firstname' });
        });

        it('should ignore pinned filter if location search has already a corresponding value', function () {
            var location = {
                search: function search() {
                    return { search: JSON.stringify({ name: 'doe', firstname: 'john' }) };
                }
            };

            var filters = [{
                pinned: function pinned() {
                    return false;
                },
                name: function name() {
                    return 'name';
                },
                getMappedValue: function getMappedValue(value) {
                    return 'mapped name for ' + value;
                }
            }, {
                pinned: function pinned() {
                    return true;
                },
                name: function name() {
                    return 'firstname';
                },
                getMappedValue: function getMappedValue(value) {
                    return 'mapped firstname for ' + value;
                },
                defaultValue: function defaultValue(value) {
                    return 'mapped firstname for default value for firstname';
                }
            }];

            expect(getCurrentSearchParam(location, filters)).toEqual({ name: 'mapped name for doe', firstname: 'mapped firstname for john' });
        });
    });
});
//# sourceMappingURL=ListLayoutControllerSpec.js.map