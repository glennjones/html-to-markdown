
'use strict';


if(require.main === module) { 
	// if they want the app
    var app = require('../bin/to-microformats');
}else{ 
	// if they want a module interface
	var routes = require('../lib/routes'),
		twitter = require('../lib/twitter.js');

	module.exports = {
		'routes': routes.routes,
		'getStatus': twitter.getStatus,
		'getProfile': twitter.getProfile
	}
}