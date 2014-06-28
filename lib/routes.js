'use strict';
var hapi        = require('hapi'),
	joi 		= require('joi'),
	handlers    = require('../lib/handlers.js'),
	routes;


// adds the routes and validation for api
routes = [{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	},  {
		method: 'GET',
		path: '/images/{file*}',
		handler:{
		    directory:{
				path:'./node_modules/hapi-swagger/public/swaggerui/images'
		    }
		}
	},{
		method: 'GET',
		path: '/markdown/fromurl',
		config: {
			handler: handlers.fromUrl,
			description: 'Status',
			notes: 'Turns a HTML at url to Markdown',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					url: joi.string()
						.required()
						.description('the url of html to convert to markdown'),

					select: joi.string()
						.optional()
						.description('css selector for node to parse from'),

					remove: joi.string()
						.optional()
						.description('css selector for node to remove from parse'),
				}
			}
		}
	},{
		method: 'POST',
		path: '/markdown/fromhtml',
		config: {
			handler: handlers.fromHtml,
			description: 'Status',
			notes: 'Turns a HTML at url to Markdown',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					html: joi.string()
						.required()
						.description('a html string to convert to markdown'),

					select: joi.string()
						.optional()
						.description('css selector for node to parse from'),

					remove: joi.string()
						.optional()
						.description('css selector for nodes to remove from parse'),
				}
			}
		}
	},{
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: __dirname.replace('/lib','') + '/public',
				listing: false,
				index: true
			}
		}
	}];


exports.routes = routes;