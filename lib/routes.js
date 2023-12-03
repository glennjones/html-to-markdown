'use strict';
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const handlers = require('../lib/handlers.js');
let routes;


// adds the routes and validation for api
routes = [{
		method: 'GET',
		path: '/',
		handler: handlers.index,
		options: {}
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
		path: '/parse/url',
		handler: handlers.fromUrl,
		options: {
			description: 'Parses Markdown from a URL',
			notes: ['Turns a HTML at URL into Markdown',				
				'Error status codes',
				'400, bad request',
				'500, internal server error'],
			tags: ['api'],
			validate: { 
				query: Joi.object({
					url: Joi.string()
						.required()
						.description('the url of html to convert to markdown'),

					select: Joi.string()
						.optional()
						.description('css selector of node to parse from'),

					remove: Joi.string()
						.optional()
						.description('css selector of nodes to remove from parse'),
				})
			}
		}
	},{
		method: 'GET',
		path: '/parse/html',
		handler: handlers.fromHtml,
		options: {
			description: 'Parses Markdown from HTML',
			notes: ['Turns a HTML string into Markdown',				
				'Error status codes',
				'400, bad request',
				'404, not found',
				'500, internal server error'],
			tags: ['api'],
			validate: { 
				query: Joi.object({
					html: Joi.string()
						.required()
						.description('a html string to convert to markdown'),

					baseurl: Joi.string()
						.optional()
						.description('a url used to make links absolute'),

					select: Joi.string()
						.optional()
						.description('css selector of node to parse from'),

					remove: Joi.string()
						.optional()
						.description('css selector of nodes to remove from parse'),
				})
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