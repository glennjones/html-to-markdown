
'use strict';
const fs = require('fs');
const path = require('path');
let config = require('../config.js');
const pack = require('../package');
const tomarkdown = require('../lib/tomarkdown.js');
const utils = require('../lib/utilities.js');
	

// refines configure using server context
config = utils.processConfig( config )


async function index(request, h) {
    const data = await utils.getMarkDownHTML(__dirname.replace('/lib', '') + '/README.md');
    return h.view('swagger.html', {
        title: pack.name,
        basepath: (config.server.basepath) ? config.server.basepath + '/' : '/',
        markdown: data
    });
}

async function fromUrl(request, h) {
    const options = {
        url: request.query.url
    };
    addOptions(request, options);

    try {
        const result = await tomarkdown.parseUrl(options);
        return h.response(result).type('text/x-markdown');
    } catch (err) {
        return h.response(err).type('text/x-markdown').code(500);
    }
}




// render json out to http stream
async function fromHtml(request, h) {
    const options = {
        html: request.query.html
    };
    addOptions(request, options);

    try {
        const result = await tomarkdown.parseHtml(options);
        return h.response(result).type('text/x-markdown');
    } catch (err) {
        return h.response(err).type('text/x-markdown').code(500);
    }
}


function addOptions(request, options){
	if(request.query.select){
		options.select = request.query.select
	}

	if(request.query.remove){
		options.remove = request.query.remove
	}

	if(request.query.baseurl){
		options.baseUrl = request.query.baseurl
	}
}


exports.index = index;
exports.fromHtml = fromHtml;
exports.fromUrl = fromUrl;







