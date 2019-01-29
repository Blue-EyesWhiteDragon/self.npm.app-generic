/** DEMO Example File for Generic App module for Blue-EyesWhiteDragon
 *  Version 2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

 "use strict";

 let App = require("./index.js");
 let App = new App({
    name : "DEMO",
    id : App.Utils.generate.UUID({
      tag : "DEMO",
      seed : App.Utils
    }),
    port : 80
 });

    App.Server.Start();
    App.Server.Listen("demoTree", "./demoTree.html", function () {
        
    });