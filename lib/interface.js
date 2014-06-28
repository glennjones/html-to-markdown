
'use strict';


if(require.main === module) { 
	// if they want the app
    var app = require('../bin/html-to-markdown');
}else{ 
	// if they want a module interface
	var routes = require('../lib/routes'),
		tomarkdown = require('../lib/tomarkdown.js');

	module.exports = {
		'routes': routes.routes,
		'parseUrl': tomarkdown.parseUrl,
		'parseHtml': tomarkdown.parseHtml
	}
}