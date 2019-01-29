/** Generic App module for Blue-EyesWhiteDragon
 *  Version 2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

"use strict";

let App = ( function ( core ) {
    let self = function App () {
        return this;
    };
    self.constructor = core.constructor;
    self.prototype = core.prototype;
    self.constructor.name = "App";
}) (new (require("modules/core/core.js")));

module.exports = App;