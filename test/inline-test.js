'use strict';

var chai		= require('chai'),
	assert		= chai.assert,
	tomarkdown       = require('../lib/tomarkdown');

// units tests math.js 

describe('inline', function(){


	it('should add italic prefix/surfix', function(done){
		var options = {
			html: '<i>test text</i>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '_test text_', 'convert with italic prefix/surfix');
			assert.equal(error, null, 'convert with italic prefix/surfix without error');
			done();
		});
	});

	it('should add italic prefix/surfix', function(done){
		var options = {
			html: '<em>test text</em>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '_test text_', 'convert with italic prefix/surfix');
			assert.equal(error, null, 'convert with italic prefix/surfix without error');
			done();
		});
	});


	it('should add strong prefix/surfix', function(done){
		var options = {
			html: '<strong>test text</strong>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '**test text**', 'convert with strong prefix/surfix');
			assert.equal(error, null, 'convert with strong prefix/surfix without error');
			done();
		});
	});

	it('should add strong prefix/surfix', function(done){
		var options = {
			html: '<b>test text</b>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '**test text**', 'convert with strong prefix/surfix');
			assert.equal(error, null, 'convert with strong prefix/surfix without error');
			done();
		});
	});


	it('should add code prefix/surfix', function(done){
		var options = {
			html: '<code>name=test</code>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '`name=test`', 'convert with code prefix/surfix');
			assert.equal(error, null, 'convert with code prefix/surfix without error');
			done();
		});
	});


	it('should add link structure', function(done){
		var options = {
			html: '<a href="http://example.com">test link</a>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '[test link](http://example.com)', 'convert with link structure');
			assert.equal(error, null, 'convert with link structure without error');
			done();
		});
	});


	it('should add link structure with title', function(done){
		var options = {
			html: '<a href="http://example.com" title="title">test link</a>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '[test link](http://example.com "title")', 'convert with link structure with alt');
			assert.equal(error, null, 'convert with link structure without error');
			done();
		});
	});


	it('should add link structure without attr', function(done){
		var options = {
			html: '<a>test link</a>'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, 'test link', 'should return just text');
			assert.equal(error, null, 'should return just text without error');
			done();
		});
	});


	it('should add link structure making links absolute', function(done){
		var options = {
			html: '<a href="../test/page" title="title">test link</a>',
			baseUrl: 'http://example.com/lib/'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '[test link](http://example.com/test/page "title")', 'should return absolute link');
			assert.equal(error, null, 'should return absolute link without error');
			done();
		});
	});


	it('should add image structure', function(done){
		var options = {
			html: '<img src="http://example.com/photo.png" />'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '![](http://example.com/photo.png)', 'should return image structure ');
			assert.equal(error, null, 'should return image structure  without error');
			done();
		});
	});

	it('should add image structure with alt', function(done){
		var options = {
			html: '<img src="http://example.com/photo.png" alt="my photo" />'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '![my photo](http://example.com/photo.png)', 'should return image structure ');
			assert.equal(error, null, 'should return image structure  without error');
			done();
		});
	});

	it('should add image structure with alt and title', function(done){
		var options = {
			html: '<img src="http://example.com/photo.png" alt="my photo" title="picture of me" />'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '![my photo](http://example.com/photo.png "picture of me")', 'should return image structure ');
			assert.equal(error, null, 'should return image structure  without error');
			done();
		});
	});


	it('should add image structure', function(done){
		var options = {
			html: '<img src="/images/photo.png" />',
			baseUrl: 'http://example.com/'
		};
		tomarkdown.parseHtml(options, function(error, result){
			assert.equal(result, '![](http://example.com/images/photo.png)', 'should return absolute link in src');
			assert.equal(error, null, 'should return absolute link in src without error');
			done();
		});
	});



});