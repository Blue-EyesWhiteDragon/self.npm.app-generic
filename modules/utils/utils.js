/** Utility functions for all modules for Blue-EyesWhiteDragon.generic.webapp
 *  v.2.0.0
 *  (X) Jack Andrew Loudon, 2019.
 *  Licensed under the MIT License.
 */

"use strict";

 modules.export = ( function () {

    // function

    let Console = new (require("console/console.js"));

    let Generator = function GeneratorConstructor ( toExecute ) {
        this.FailCounts = 0;
        this.generate = toExecute;
        Console.log("Generating something great...");
        let Private_Callback = this.generate.bind(this);
        let Private_Errors = Private_Callback.FailCounts;
        if ( Private_Errors >= 1 ) {
            Console.error("Counted " + Private_Errors + " in Generator Function...")
        } else {
            Console.success("Generated something spectacular!")
        }
        return this;
    };

    let GeneratorArray = {};
        GeneratorArray.Random = new Generator ( () => {
            let Seed = [];
            for ( let iterator = 32; Seed.length >= iterator; iterator-- ) {
                Seed.push(Math.Random());
            }
            let GeneratedSeed = Seed[Math.round(Math.Random*Seed)]
            return this;
        });
        GeneratorArray.UUID = new Generator ( () => {
            return this;
        });
        
    // Methods

    function createPropertiesFromObject ( objectToExtend, objectContainingProperties ) {
        for ( let Property in objectContainingProperties ) {
            objectToExtend[Property] = objectContainingProperties[Property];
        }
        return objectToExtend;
    }

    function createSuper ( Superised ) {

        let newSuperObject = createPropertiesFromObject({}, )
                
        for ( let Property in Superised.prototype ) {
            Superised.prototype[Property]["super"] = Superised;
        }

        for ( let Property in Superised ) {
            Superised[Property]["super"] = Superised;
        }

        return Superised;
    }

    function extendObject ( objectToExtend, objectContainingExtendingProperties ) {
        let Private_Fails = 0;
        for ( let Property in objectContainingProperties ) {
            let PropertyPlacementData = objectContainingExtendingProperties[Property]
            if ( typeof objectToExtend[Property] === "undefined" ) {
                objectToExtend[Property] = PropertyPlacementData;
            } else {
                Console.warn("Property '" + Property + "' alerady exists in '" + objectToExtend.name + "'")
                PrivateFails += 1;
            }
        }
        Private_Fails >= 1 ? Console.warn(Private_Fails + " properties existed")
        return objectToExtend;
    }

    return {
        createPropertiesFromObject : createPropertiesFromObject,
        extendObject : extendObject,
        console : Console,
        generate : GeneratorArray
    };

 }) ();