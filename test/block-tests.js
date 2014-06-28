'use strict';

var chai		= require('chai'),
	assert		= chai.assert,
	tomarkdown       = require('../lib/tomarkdown');

// units tests math.js 

describe('block', function(){


	it('should add h1 heading prefix', function(done){
		var options = {
			html: '<h1>test heading</h1>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n# test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});

	it('should add h2 heading prefix', function(done){
		var options = {
			html: '<h2>test heading</h2>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n## test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});

	it('should add h3 heading prefix', function(done){
		var options = {
			html: '<h3>test heading</h3>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n### test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});

	it('should add h4 heading prefix', function(done){
		var options = {
			html: '<h4>test heading</h4>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n#### test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});

	it('should add h5 heading prefix', function(done){
		var options = {
			html: '<h5>test heading</h4>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n##### test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});

	it('should add h6 heading prefix', function(done){
		var options = {
			html: '<h6>test heading</h4>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n###### test heading\n', 'convert with heading prefix');
			assert.equal(error, null, 'convert with heading prefix without error');
			done();
		});
	});


	it('should add spacing for p', function(done){
		var options = {
			html: '<p>test text</p>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\ntest text\n', 'convert p to spacing either side');
			assert.equal(error, null, 'convert p to spacing either side without error');
			done();
		});
	});

	it('should add spacing for div', function(done){
		var options = {
			html: '<div>test text</div>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\ntest text\n', 'convert div to spacing either side');
			assert.equal(error, null, 'convert div to spacing either side without error');
			done();
		});
	});

	it('should add return for br', function(done){
		var options = {
			html: '<br />'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n', 'convert br into return');
			assert.equal(error, null, 'convert br into return without error');
			done();
		});
	});

	it('should add hr structure', function(done){
		var options = {
			html: '<hr/>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n* * *\n', 'convert hr into structure');
			assert.equal(error, null, 'convert into hr structure without error');
			done();
		});
	});

	it('should add list structure', function(done){
		var options = {
			html: '<ul><li>list item one</li><li>list item two</li></ul>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n* list item one\n* list item two\n\n', 'convert hr into structure');
			assert.equal(error, null, 'convert into hr structure without error');
			done();
		});
	});

	it('should add list structure', function(done){
		var options = {
			html: '<ol><li>list item one</li><li>list item two</li></ol>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '\n\n1. list item one\n1. list item two\n\n', 'convert hr into structure');
			assert.equal(error, null, 'convert into hr structure without error');
			done();
		});
	});



});