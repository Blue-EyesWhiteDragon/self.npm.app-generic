/** Utility functions for all modules for Blue-EyesWhiteDragon.generic.webapp
 *  v.2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

"use strict";

 modules.export = ( function () {

    function createPropertiesFromObject ( objectToExtend, objectContainingProperties ) {
        for ( let Property in objectContainingProperties ) {
            objectToExtend[Property] = objectContainingProperties[Property];
        }
        return 0;
    }

    function extendObject ( objectToExtend, objectContainingExtendingProperties ) {
        let Private_Fails = 0;
        for ( let Property in objectContainingProperties ) {
            let PropertyPlacementData = objectContainingExtendingProperties[Property]
            if ( typeof objectToExtend[Property] === "undefined" ) {
                objectToExtend[Property] = PropertyPlacementData;
            } else { PrivateFails += 1; }
        }
        return Private_Fails >= 1 ? 1 : 0;
    }

    // function

    let Console = new (require("console/console.js"));

    let Generator = function GeneratorConstructor ( toExecute ) {
        let FailCounts = 0;
        Console.log("Generating something great...");
        let Private_Callback = toExecute.bind(this, FailCounts);
        let Private_Errors = Private_Callback.FailCounts;
        if ( Private_Errors >= 1 ) {
            Console.error("Counted " + Private_Errors + " in Generator Function...")
        } else {
            Console.success("Generated something spectacular!")
        }
        return Private_Callback;
    };

    let GeneratorArray = {};
        GeneratorArray.Random = new Generator ( FailCounts => {
            Return
            return extendObject(this, { FailCounts : FailCounts });
        });
        GeneratorArray.UUID = new Generator ( FailCounts => {
            return extendObject(this, { FailCounts : FailCounts });
        });

    return {
        createPropertiesFromObject : createPropertiesFromObject,
        extendObject : extendObject,
        console : Console,
        generate : GeneratorArray
    };

 }) ();