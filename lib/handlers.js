
'use strict';
var fs				= require('fs'),
	path            = require('path'),
	hapi            = require('hapi'),
	config          = require('../config.js'),
	pack            = require('../package'),
	tomarkdown      = require('../lib/tomarkdown.js'),
	utils           = require('../lib/utilities.js');
	

// refines configure using server context
config = utils.processConfig( config )


function index(request, reply) {
	utils.getMarkDownHTML(__dirname.replace('/lib','') + '/README.md', function(err, data){
		reply.view('swagger.html', {
			title: pack.name,
			basepath: (config.server.basepath)? config.server.basepath + '/' : '/',
			markdown: data
		});
	});
}

function fromUrl (request, reply) { 
	var options = {
			url: request.query.url
		}
	addOptions(request, options)

	tomarkdown.parseUrl( options, function( err, result ){
		if(!err){
			reply(result).type('text/x-markdown')
		}else{
			reply(err).type('text/x-markdown').statusCode(500)
		}
	}); 
}




// render json out to http stream
function fromHtml(request, reply){
	var options = {
			html: request.query.html
		}
	addOptions(request, options)	

	tomarkdown.parseHtml( options, function( err, result ){
		if(!err){
			reply(result).type('text/x-markdown')
		}else{
			reply(err).type('text/x-markdown').statusCode(500)
		}
	}); 
}


function addOptions(request, options){
	if(request.query.select){
		options.select = request.query.select
	}

	if(request.query.remove){
		options.remove = request.query.remove
	}
}


exports.index = index;
exports.fromHtml = fromHtml;
exports.fromUrl = fromUrl;







