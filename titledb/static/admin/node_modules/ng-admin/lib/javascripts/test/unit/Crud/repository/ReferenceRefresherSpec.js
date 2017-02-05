'use strict';

var assert = require('chai').assert;
var mixins = require('../../../mock/mixins');
var ReferenceField = require('admin-config/lib/Field/ReferenceField');
var ReadQueries = require('admin-config/lib/Queries/ReadQueries');
var ReferenceRefresher = require('../../../../ng-admin/Crud/repository/ReferenceRefresher');

describe('ReferenceRefresher', function () {
    var fakeEntity, fakeField;
    beforeEach(function () {
        fakeEntity = {
            name: function name() {
                return 'fooEntity';
            },
            identifier: function identifier() {
                return {
                    name: function name() {
                        return 'id';
                    }
                };
            }
        };

        fakeField = {
            name: function name() {
                return 'post';
            },
            targetEntity: function targetEntity() {
                return fakeEntity;
            },
            targetField: function targetField() {
                return {
                    name: function name() {
                        return 'title';
                    },
                    flattenable: function flattenable() {
                        return false;
                    },
                    getMappedValue: function getMappedValue(v) {
                        return v;
                    }
                };
            },
            type: function type() {
                return 'reference';
            }
        };
    });

    describe('refresh', function () {
        it('should call remote API with given search parameter', function () {
            var readQueries = new ReadQueries();
            var spy = spyOn(readQueries, 'getAllReferencedData');
            spy.and.returnValue(mixins.buildPromise({ 'post': [] }));

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null, 'foo');

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'foo');
        });

        it('should format correctly returned results', function (done) {
            var readQueries = new ReadQueries();
            var spy = spyOn(readQueries, 'getAllReferencedData');
            spy.and.returnValue(mixins.buildPromise({
                post: [{ id: 1, title: 'Discover some awesome stuff' }, { id: 2, title: 'Another great post' }]
            }));

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null, 'foo').then(function (results) {
                expect(results).toEqual([{ value: 1, label: 'Discover some awesome stuff' }, { value: 2, label: 'Another great post' }]);
                done();
            });
        });

        describe('Choice deduplication (to fix some UI-Select duplicated options)', function () {
            var refresher;
            beforeEach(function () {
                var readQueries = new ReadQueries();
                var spy = spyOn(readQueries, 'getAllReferencedData');
                spy.and.returnValue(mixins.buildPromise({
                    post: [{ id: 1, title: 'Discover some awesome stuff' }, { id: 2, title: 'Another great post' }]
                }));

                refresher = new ReferenceRefresher(readQueries);
            });

            it('should remove already selected values from result list in case of multiple choices component', function (done) {
                fakeField.type = function () {
                    return 'reference_many';
                };

                refresher.refresh(fakeField, [1], 'foo').then(function (results) {
                    expect(results).toEqual([{ value: 2, label: 'Another great post' }]);
                    done();
                });
            });

            it('should not de-duplicate simple choice in case of single choice component', function (done) {
                fakeField.type = function () {
                    return 'reference';
                };

                refresher.refresh(fakeField, [1], 'foo').then(function (results) {
                    expect(results).toEqual([{ value: 1, label: 'Discover some awesome stuff' }, { value: 2, label: 'Another great post' }]);
                    done();
                });
            });
        });

        it('should return value transformed by `maps` field functions', function (done) {
            var readQueries = new ReadQueries();
            var spy = spyOn(readQueries, 'getAllReferencedData');
            spy.and.returnValue(mixins.buildPromise({
                post: [{ id: 1, title: 'Discover some awesome stuff' }, { id: 2, title: 'Another great post' }]
            }));

            fakeField = {
                name: function name() {
                    return 'post';
                },
                targetEntity: function targetEntity() {
                    return fakeEntity;
                },
                targetField: function targetField() {
                    return {
                        name: function name() {
                            return 'title';
                        },
                        flattenable: function flattenable() {
                            return false;
                        },
                        getMappedValue: function getMappedValue(v, e) {
                            return e.title + ' (#' + e.id + ')';
                        }
                    };
                },
                type: function type() {
                    return 'reference';
                }
            };

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null).then(function (results) {
                expect(results).toEqual([{ value: 1, label: 'Discover some awesome stuff (#1)' }, { value: 2, label: 'Another great post (#2)' }]);
                done();
            });
        });
    });
});
//# sourceMappingURL=ReferenceRefresherSpec.js.map