<p><h3 align="center">Personal Generic NodeJS Express Server App</h3></p>
<p><h5 align="center">poorly written and in its infancy, not intended for use by anyone except me</h5></p>

	App {
	    id : {String(32)}, // An unique id string, can be set otherwise it will be generated automatically
	    logging : {Boolean}, // should the app log internal processes?
	    workingDirectory : {String}, // where the app works from
	    plugins : {
	        {String} : {String} //plugin_name : plugin_version
	    },
	    pluginOptions : {
	        path : {String}, // the path where plugins are stored
	        autoEnable : {Boolean} // auto enable plugins as they are found?
	    },
	    {Internal}Messages : {Array} // logged messages can be accessed here if logging is set to false
	}

### Starting a server

    const App = require("blue-eyeswhitedragon-app-generic");
    
    let app = new App({
        logging : true,
        workingDirectory : __dirname
    }).startServer(server => {
        server.get("/", (req, res) => {
            res.render("pages/index");
        });
    });