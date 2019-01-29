/** Core module for Blue-EyesWhiteDragon.generic.webapp
 *  v.2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

"use strict";

/* Import utils */

let Utils = require("./utils/Utils.js");

/* Container for modules */

module.exports = ( function () {

let Core = function Core () {
    return this;
};

// Core = super; \\

for ( let Property in Core.prototype ) {
    Core.prototype[Property]["super"] = Core;
}

for ( let Property in Core ) {
    Core[Property]["super"] = Core;
}

    Core.prototype.Server = new require ("../server/server.js");

    Core.plugin = {
        load : function () {

        }
    };

return Core;

}) ();