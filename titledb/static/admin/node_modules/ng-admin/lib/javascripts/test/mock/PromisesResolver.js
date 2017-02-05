'use strict';

/*global jasmine,define*/

define('mock/PromisesResolver', ['mixins'], function (mixins) {
    "use strict";

    return {
        allEvenFailed: function allEvenFailed() {
            return mixins.buildPromise([]);
        }
    };
});
//# sourceMappingURL=PromisesResolver.js.map