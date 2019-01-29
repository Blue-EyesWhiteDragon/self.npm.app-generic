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
    Utils.createSuperObject(this);
    return this;
};

    Core.console = Utils.console;
    Core.id =
    Core.sessionID =
    Core.UUID = Utils.generate.UUID();
    Core.plugin = {
        load : function PluginManager () {
            
        }
    };

    Core.utils = Utils;

    Core.prototype.Plugin = require("../plugin/plugin.js");
    Core.prototype.Server = require("../server/server.js");

return Core;

}) ();