/** Plugin module for Blue-EyesWhiteDragon.generic.webapp
 *  v.2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

"use strict";

/* Import utils */

let Utils = require("./utils/Utils.js");

/* Container for modules */

module.exports = ( function () {

let Plugin = function ( configObject ) {
    this.sessionID = Utils.generator.UUID( Utils.Random().Seed );
    return this;
};

return Plugin;

}) ();

/* DEMO |

    new Plugin ( {
        name : "demo",
        source : "file-uri-to-javascript-file.js",
        [namespace] : "demo.workspace.name",
        [workspace] : "demo.workspace.name",
        [author] : "demo author",
    } )

*/