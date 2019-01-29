/** DEMO Example File for Generic App module for Blue-EyesWhiteDragon
 *  Version 2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

 "use strict";

 let App = new require("./index.js")({
    name : "DEMO",
    id : App.Utils.generate.UUID("DEMO"),
    port : 80
 });

    App.Server.Start();
    App.Server.Listen("demoTree", "./demoTree.html", function () {
        
    });