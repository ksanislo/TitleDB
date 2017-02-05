'use strict';

describe('DeleteController', function () {
    'use strict';

    var DeleteController = require('../../../../ng-admin/Crud/delete/DeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    var $scope, $window, $q;
    beforeEach(inject(function ($controller, $rootScope, _$window_, _$q_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        $q = _$q_;
    }));

    describe('deleteOne', function () {
        var $translate = function $translate(text) {
            return text;
        };
        var Configuration = function Configuration() {
            return {
                getErrorMessageFor: function getErrorMessageFor() {
                    return '';
                }
            };
        };
        var $state = {
            go: jasmine.createSpy('$state.go'),
            get: jasmine.createSpy('$state.get'),
            params: {}
        };
        var writeQueries = {
            deleteOne: jasmine.createSpy('writeQueries.deleteOne').and.callFake(function () {
                return $q.when();
            })
        };
        var progression = {
            start: function start() {
                return true;
            },
            done: function done() {
                return true;
            }
        };
        var notification = humane;
        var params = {
            id: 3,
            entity: new Entity('post')
        };
        var view = {
            title: function title() {
                return 'My view';
            },
            description: function description() {
                return 'Description';
            },
            actions: function actions() {
                return [];
            },
            getEntity: function getEntity() {
                return new Entity('post');
            }
        };
        var entry = {};
        describe('on success', function () {
            it('should delete given entity', function (done) {
                // assume we are on post #3 deletion page
                var entity = new Entity('post');
                var deletedId = 3;
                var view = {
                    title: function title() {
                        return 'Deleting a post';
                    },
                    description: function description() {
                        return 'Remove a post';
                    },
                    actions: function actions() {
                        return [];
                    },
                    getEntity: function getEntity() {
                        return entity;
                    }
                };

                var deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function () {
                    expect(writeQueries.deleteOne).toHaveBeenCalled();
                    done();
                }, done);

                var fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });

            it('should redirect to entity list view if previous page is specific to deleted entity', function (done) {
                // assume we are on post #3 deletion page
                var entity = new Entity('post');
                var deletedId = 3;
                var view = {
                    title: function title() {
                        return 'Deleting a post';
                    },
                    description: function description() {
                        return 'Remove a post';
                    },
                    actions: function actions() {
                        return [];
                    },
                    getEntity: function getEntity() {
                        return entity;
                    }
                };

                var deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function () {
                    expect($state.get.calls.argsFor(0)[0]).toBe('list');
                    expect($state.go.calls.argsFor(0)[1]).toEqual({
                        entity: 'post'
                    });
                    done();
                }, done);

                // assume we come from post #3 page
                var fromStateParams = { entity: 'post', id: deletedId };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });

            it('should redirect to previous page if not specific to deleted entity', function (done) {
                // assume we are on comment #7 deletion page
                var commentId = 7;
                var view = {
                    title: function title() {
                        return 'Deleting a comment';
                    },
                    description: function description() {
                        return 'Remove a comment';
                    },
                    actions: function actions() {
                        return [];
                    },
                    getEntity: function getEntity() {
                        return new Entity('comment');
                    }
                };

                var $window = { history: { back: jasmine.createSpy('$window.history.back') } };
                var deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: commentId,
                    entity: 'comment'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function () {
                    expect($window.history.back).toHaveBeenCalled();
                    done();
                }, done);

                // assume we come from post #3 page
                var fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });
        });
    });
});
//# sourceMappingURL=DeleteControllerSpec.js.map