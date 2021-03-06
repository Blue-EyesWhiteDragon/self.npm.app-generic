/** Generic App module for Blue-EyesWhiteDragon
 *  (X) Jack Andrew Loudon, 2016.
 *  Licensed under the MIT License.
 */

"use strict"; // Allow ES6 stuff: const, let, () => {}, etc...

/* Imports */

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const httpRequest = require("request-promise-native");
const styleMe = require("styleme");

  /////////////
 //   App   //
/////////////

/** App
 *  @public, class
 *  @return App
 */

module.exports = (function ( grabPluginFrom ) {
    
    /** App.constructor
     *  @public, constructor
     *  @return {App}
     */
    
    let constructor = function App ( configurationObject ) {
        
        // extend the defaultObject with the configurationObject
        
        let defaultObject = extend({
            
            id : this.generateUUID(),
            logging : false,
            // Mute this line to, may use callbacks in future.
            // callbacks : { success : function () {}, error : function (err) { if (err) console.error(err); } },
            workingDirectory : path.join("../../", __dirname),
            plugins : {},
            pluginPath : path.join("../../", __dirname, "./plugins"),
            pluginOptions : {
                path : null,
                autoEnable : false
            },
            promises : []
            
        }, configurationObject, true);
        
        // log the creation of the object if defaultObject.logging is true
        
        this.__creationLog(defaultObject);
        
        // scan and activate plugins
        
        this.__scanPlugins(defaultObject);
        
        // extend the object with the newly extended defaultObject (do not overwrite, as it will mess with the internal functions and props)
        
        extend(this, defaultObject, false);
        
        this.__importantLogger("Successful initialization of App!");
        
        return this;
    };
    
    /* Logging */
    
    /** App.logger
     *  @param {String}
     */
    
    constructor.prototype.logger =
    constructor.prototype.__importantLogger = function () {
        return this.messages ? this.messages.push(convertArgs(arguments).join(" ")) : this.messages = ([]).push(convertArgs(arguments).join(" "));
    };
    
    /** App.__creationLog
     *  @param {Boolean}
     *  @private
     */
    
    constructor.prototype.__creationLog = (function ( c ) {
        
        return function ( defaultObject ) {
            
            if ( defaultObject.logging === true ) {
                
                let style = styleMe.style;
            
                this.logger = function ( string ) {
                    
                    let String = ( arguments.length > 1 ) ? convertArgs(arguments).join(" ") : string;
                    
                    let
                        matches = [],
                        matchObj = function ( regex, color ) { return { match : String.match(regex), color : color }; },
                        prefab = style("[App id=", "blu,bri") + style(this.id || defaultObject.id, "mag,bri") + style("]", "blu,bri"),
                        newString = String
                    ;
                    
                    if ( typeof String !== "string" ) return c(prefab, String);
                    
                    matches.push(matchObj(/((\w+|\.)?(\/\w+|\w+\/|\.\w+)+)|(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/g, "yel")); // Directories, hyperlinks and filepaths
                    
                    for ( let j = 0; j < matches.length; j++ ) {
                        let matchObj = matches[j];
                        if ( matchObj.match !== null ) {
                            for ( let i = 0; i < matchObj.match.length; i++ ) {
                                newString = newString.replace(new RegExp(matchObj.match[i], "gmi"), styleMe.style(matchObj.match[i], matchObj.color));
                            }
                        }
                    }
                    
                    return c(prefab, newString);
                    
                };
                
                this.__importantLogger = function () {
                    this.logger.call(this, style(convertArgs(arguments).join(" "), "bri"));
                };
                
                this.__importantLogger("Logging has been enabled, App will now log processes");
            }
            
        };
        
    }(console.log));
    
    /* get and post functions */
    /* TODO: write generic get function that .get and .getJSONFrom can derive from and extend */
    
    /** App.getJSONFrom
     *  @param {Array||String}
     *  @param {Array||Object}
     *  @param {Boolean}
     *  @public, method
     *  @return {Array||App}
     */ 
    
    constructor.prototype.getJSONFrom = function ( hrefs, headers, transformationFunction, returnSelf ) {
        
        let localPromises = [];
        
        hrefs.constructor.name.indexOf("Array") > -1 || (hrefs = [hrefs]);
        
        for ( let j = 0; j < hrefs.length; j++ ) {
            let transformer;
            if ( typeof transformationFunction !== "undefined" ) {
                if ( transformationFunction.constructor.name.indexOf("Function") > -1 ) transformer = transformationFunction;
                else transformer = transformationFunction[j];
            }
            this.logger("Getting JSON from " + hrefs[j] + "...");
            let promise = httpRequest({
                url : hrefs[j],
                headers : ( headers.constructor.name.indexOf("Array") > -1 ) ? headers[j] : headers
            }).then(body => {
                let json = JSON.parse(body);
                if ( typeof json !== "undefined" ) {
                    this.logger("JSON from " + hrefs[j] + " is valid");
                    return ({
                        url : hrefs[j],
                        json : json,
                        body : body
                    });
                }
            });
            if ( typeof transformer !== "undefined" ) {
                try {
                    promise = promise.then(responseRaw => {
                        let retData = transformer.call(this, responseRaw);
                        return typeof retData !== "object" ? responseRaw : retData;
                    });
                } catch (e) { this.logger(e) }
            }
            localPromises.push(promise);
            this.promises.push(promise);
        }
        
        return returnSelf ? this : (localPromises.length === 1 ? localPromises[0] : Promise.all(localPromises));
        
    };
    
    /* Plugins */
    
    /** App.__scanPlugins
     *  Scans for plugins
     *  @param {Object}
     *  @private, method
     */
    
    constructor.prototype.__scanPlugins = function ( defaultObject ) {
        
        for ( let key in defaultObject.plugins ) {
            let path = ( defaultObject.pluginOptions.path || defaultObject.pluginPath ) + "/" + key + ".js";
            let version = defaultObject.plugins[key] || "1.0.0";
            let plugin = grabPluginFrom(path);
            this.logger("Checking " + path + " is a valid plugin...");
            if ( plugin.err ) this.logger(path + " is not a valid plugin...");
            else if ( plugin.version === version ) {
                this.logger(path + " is a valid plugin...");
                this.plugins.list[key] = plugin;
                if ( defaultObject.pluginOptions.autoEnable ) {
                    this.enablePlugin(plugin);
                }
            }
            else console.log("Cannot find " + path + " version " + version);
        }
        
    };
    
    /** App.enablePlugin
     *  Enables a Plugin.
     *  @param {String}
     *  @public, method
     *  TODO removde disabled plugins from disabled array
     */
    
    constructor.prototype.enablePlugin = function ( nameOrPlugin, callback ) {
        
        try {
            let name = typeof nameOrPlugin === "string" ? nameOrPlugin : nameOrPlugin.name;
            let plugin = typeof nameOrPlugin === "string" ? this.plugins.list[name] : nameOrPlugin;
            this.logger("Enabling '" + name + "'");
            if ( typeof plugin === "undefined" ) throw new Error("Plugin '" + name + "' is undefined");
            
            /*let object = {};
            for ( let prop in plugin["_"].prototype ) {
                object[prop] = plugin["_"].prototype[prop];
                plugin["_"].prototype[prop] = function () {
                    this.plugins.active[name] = plugin;
                    let ret = object[prop].call(this);
                    for ( let funct in this ) {
                        this[funct] = object[prop];
                    }
                    return ret;
                };
            }*/
            
            let toExtend = {
                "super" : this,
            };
            
            if ( typeof plugin.requires === "object" ) {
                for ( let _import in plugin.requires ) {
                    
                    let required = this.plugins.list[_import];
                    
                    if ( typeof required !== "undefined") {
                        if ( required.enabled === false ) {
                            this.logger(plugin.name + " is enabling " + _import );
                            this.enablePlugin(_import, function () {
                                let o = {};
                                    o[_import] = this;
                                extend(toExtend, o);
                            });
                        } else {
                            let o = {};
                                o[_import] = required["_"];
                            extend(toExtend, o);
                        }
                    }
                    
                }
            }
            
            plugin["_"].imports = plugin["_"].prototype.imports = toExtend;
            
            edPlug.apply(this, ["enable", name, toExtend, callback]);
        } catch ( e ) {
            console.log("PluginError in App.enablePlugin\n", e);
        }
        
        return this;
        
    };
    
    /** App.disablePlugin
     *  @param {String}
     *  @public, method
     *  TODO remove enabled plugins from enabled array
     */
    
    constructor.prototype.disablePlugin = function ( name, callback ) {
        
        if ( typeof edPlug.apply(this, ["disable", name]) === "undefined" ) throw new Error("Plugin '" + name + "' is undefined");
        
        return this;
        
    };
    
    /** App.plugins
     *  @public {Object}
     *  @children {4} => list {Object}, active {Object}, enabled {Object}, disabled {Object}
     */
    
    constructor.prototype.plugins = {
        list : {},
        active : {},
        enabled : {},
        disabled : {}
    };
    
    /** App.plugin
     *  @public {Object}, reference
     *  @parent App.plugins
     */
    
    constructor.prototype.plugin = constructor.prototype.plugins.enabled;
    
    /* Handling */
    
    /**
     * 
     */
    
    constructor.prototype.promise =
    constructor.prototype.defer =
    constructor.prototype.try = function ( funct ) {
        let self = this;
        return new Promise ((resolve, reject) => {
            let retData;
            try { retData = funct.call(self); } catch (e) { return reject(e); }
            resolve(retData);
        });
    };
    
    /* Processing */
    
    /**
     * 
     */
    
    constructor.prototype.parallel = function () {
        
        let promises = [];
        
        for ( let key in arguments ) {
            if ( typeof arguments[key] === "function" ) promises.push(this.try(arguments[key]));
        }
        
        return Promise.all(promises);
        
    };
    
    /* Server */
    
    /** App.startServer
     *  Allows you create your own defined express server, with or without basic setup predefined.
     *  use init, middleware and next functions in your callback to use predefined setups.
     *  @public, method
     */
    
    constructor.prototype.startServer = function ( setUpFunction, usesSockets ) {
        
        this.logger("Starting Express server...");
        usesSockets && this.logger("Creating Sockets compatible server...");
        
        let server = express();
        let self = this;
        
        /* Catch errors */
        
        let _get = server.get,
            _post = server.post,
            _all = server.all;
        
        server.get = function () {
            
            return tryCatch(_get, server, arguments);
            
        };
        
        server.post = function () {
            
            return tryCatch(_post, server, arguments);
            
        };
        
        server.all = function () {
            
            return tryCatch(_all, server, arguments);
            
        };
        
        function tryCatch ( funct, functSuper, args ) {
            let returnValue;
            try {
                returnValue = funct.apply(functSuper, args);
            } catch (e) {
                console.log(e);
                returnValue = functSuper;
            }
            return returnValue;
        }
        
        /* Predefined setups */
        
        function init () {
            // port
            server.set("port", (process.env.PORT || 5000));
            
            // views is directory for all template files
            server.set("views", self.workingDirectory + "/views");
            server.set("view engine", "ejs");
        }
        
        function middleware () {
            server.use(express.static(self.workingDirectory + "/public"));
            server.use(bodyParser.json()); // support json encoded bodies
            server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        }
        
        function start () {
            server.listen(server.get("port"), () => {
                self.__importantLogger("Server initialized! Running on port", server.get("port"));
            });
        }
        
        // futher setup can be manually programmed
        if ( typeof setUpFunction !== "undefined" ) {
            try {
                this.logger("Running custom setup function(s)...");
                setUpFunction.apply(this, [server, express, init, middleware, start]);
            }
            catch (err) { this.logger(err); }
        }
        else {
            init();
            middleware();
            start();
        }
        
        this.server = server;
        
        return this;
    };
    
    /* Generation functions */
    
    /** App.generateID, App.regenerateID
     *  Regenerates an App's ID string with App.generateUUID => (32, false)
     *  @return {App}
     */
    
    constructor.prototype.generateID =
    constructor.prototype.regenerateID = function () {
        
        return (this.id = this.generateUUID()) && this;
        
    };
    
    /** App.generateUUID
     *  Generates a random UUID that is safe to process.
     *  @link https://gist.githubusercontent.com/LeverOne/1308368/raw/dd5e6568c10118f4d8303b59cef184549fb6eafb/index.js
     *  @return {String}
     */
    
    constructor.prototype.generateUUID = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b};
    
    /* Utils */
    
    constructor.prototype.utils = { extend : extend, convertArgs : convertArgs };
    
    /** extend
     *  Extends an object with any given object. Existing properties can be overwritten by passing `true` as a parameter.
     *  @note `__` denotes privacy
     *  @param {Object ... Boolean}
     *  @private, static, method
     *  @return {Object}
     */
    
    function extend () {
        
        let args = convertArgs(arguments);
        
        let endObject = {};
        
        let overwrite;
        
        for ( let j = 0; j < args.length; j++ ) { if ( typeof args[j] === "boolean" ) { overwrite = args[j]; break; } }
        
        for ( let j = 0; j < args.length; j++ ) {
            
            if ( typeof args[j] === "object" && typeof args[j+1] === "object" ) {
                let newObject = extendObject(args[j], args[j+1], overwrite);
                    endObject = extendObject(endObject, newObject, overwrite);
            }
            
        }
        
        function extendObject ( object, toMerge, overwrite ) {
            
            for ( let key in toMerge) {
                if ( (object.hasOwnProperty(key) && overwrite === true) || (object.hasOwnProperty(key) === false) ) {
                    object[key] = toMerge[key];
                }
            }
            
            return object;
            
        }
        
        return endObject;
        
    }
    
    /** edPlug
     *  Disables or enables a plugin; DRY function
     *  @param {String} The String that determines what functions to run and where to push plugin references to.
     *  @param {String}
     *  @static, private, function
     */
    
    function edPlug ( ed, name, imports, callback ) {
        
        let edd = ed + "d";
        
        let plugin = this.plugins.list[name];
        
        if ( typeof plugin === "undefined" ) return undefined;
        
        plugin[edd] = true;
        
        this.plugins[edd][name] = plugin[ed](imports);
        
        if ( typeof callback !== "undefined" ) {
            callback.call(plugin);
        }
        
        return plugin;
        
    }
    
    /** convertArgs
     *  Converts the Arguments object to an array.
     *  @link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
     *  @note See `@link` for initial source
     *  @note `__` denotes privacy
     *  @param {Arguments} The Arguments object to convert to an Array
     *  @private, static
     *  @return {Array}
     */
    
    function convertArgs ( args ) {
        return args.length === 1 ? [args[0]] : Array.apply(null, args);
    }
    
    return constructor;
    
}(require));