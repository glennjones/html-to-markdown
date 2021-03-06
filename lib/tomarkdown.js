
'use strict';
var urlParser   = require('url'),
    cheerio     = require('cheerio'),
    request     = require('request'),
    entities    = require('entities'),
    utils       = require('../lib/utilities.js');


var httpHeaders = {
  'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language':'en-GB,en-US;q=0.8,en;q=0.6',
  'Cache-Control':'no-cache',
  'Connection':'keep-alive',
  'Pragma':'no-cache',
  'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
}



module.exports = {


   parseUrl: function(options, callback){
    var context = this,
        requestOptions = {
          url: options.url,
          headers: (options.headers)? options.headers : httpHeaders
        }

    request(requestOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        options.html = body;
        context.parseHtml(options, callback)
      }else{
        callback('error:' + error, null);
      }
    })
  },

  parseHtml: function(options, callback){
    var context = this,
        dom = cheerio.load(options.html),
        root = dom.root(),
        node = (options.select)? dom(options.select) : root,
        text = "not parsed";

      if(options.remove){
        node = node.remove( options.remove )
      }

      if(node){
        text = context.parseDom(dom, node, options);
      }
      callback(null, text);
  },

  parseDom: function(dom, node, options){
    var text = new Text(options);
    return text.parse(dom, node);
  }

}


function Text(options){

    this.options = (options)? options : {};
    this.baseUrl = '';
    this.excludeTags = ['noframe', 'noscript', 'script', 'style', 'frames', 'frameset'];

    if(options.baseUrl){
      this.baseUrl = options.baseUrl;
    }
    options.collapsesLines = (options.collapsesLines !== undefined)? options.collapsesLines: true; 


    // if we given no base URL then use the page URL if we have one
    if((options.baseUrl === undefined || utils.trim(options.baseUrl) === '') 
      && (options.url !== undefined && utils.trim(options.url) !== '')){
      var u = urlParser.parse(options.url);
      this.baseUrl = u.protocol + '//' + u.host + u.path;
    }




    this.elements = [
    {
      tagNames: ['p','div','ul','ol'],  // create blocks with blank lines above and below
      start: function(node) {
        return '\n\n';
      },
      end: function(node) {
        return '\n\n';
      }
    },{
      tagNames: ['br'],
      replacement: function(node) {
        return '\n';
      }
    },{
      tagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      start: function(node) {
        var hLevel = parseInt(node.name.replace('h',''),10),
            hPrefix = '';
        for(var i = 0; i < hLevel; i++) {
          hPrefix += '#';
        }
        return '\n\n' + hPrefix + ' ';
      },
      end: function(node) {
        return '\n';
      }
    },
    {
      tagNames: ['hr'],
      replacement: function(node) {
        return '\n\n* * *\n';
      }
    },
    {
      tagNames: ['a'],
      replacement: function(node, innerText, context) {
        var href = node.attribs['href'],
            title = utils.trim(node.attribs['title']);

        href = context.resolveUrls(href);
        return href ? '[' + utils.trim(innerText) + ']' + '(' + href + (title && title ? ' "' + title + '"' : '') + ')' : utils.trim(innerText)
      }
    },
    {
      tagNames: ['b', 'strong'],
      replacement: function(node, innerText) {
        return innerText ? '**' + innerText + '**' : '';
      }
    },
    {
      tagNames: ['i', 'em'],
      replacement: function(node, innerText) {
        return innerText ? '_' + innerText + '_' : '';
      }
    },
    {
      tagNames: ['code'],
      replacement: function(node, innerText) {
        return innerText ? '`' + innerText + '`' : '';
      }
    },
    {
      tagNames: ['img'],
      type: 'void',
      replacement: function(node, innerText, context) {
        var src = node.attribs['src'],
            alt = node.attribs['alt'],
            title = node.attribs['title'];

        src = context.resolveUrls(src);
        return '![' + (alt && alt ? alt : '') + ']' + '(' + src + (title && title ? ' "' + title + '"' : '') + ')';
      }
    }, {
      tagNames: ['li'],
      type: 'void',
      replacement: function(node, innerText, context) {
        var parentTag = context.findParent( node, ['ul', 'ol'] )
        if(parentTag && parentTag === 'ul'){
          return '* ' + utils.trim(innerText) + '\n';
        }else if(parentTag && parentTag === 'ol'){
          return '1. ' + utils.trim(innerText) + '\n'; // numbers do not need to increase for markdown parser but kit maybe nice for humans
        }else{
          return innerText
        }
      }
    }
  ];
} 


Text.prototype = {

    // gets the text from dom node 
    parse: function(dom, node){
      var out;
      // only take nodes not nodeLists
      if(node.length){
          node = node[0];
      }

      this.dom = dom;

      // find base tag to set baseUrl
      var baseTag = dom('base');
      if(baseTag.length > 0) {
        href = this.getAttribute(dom, baseTag, 'href');
        if(href){
          this.baseUrl = href;
        }
      }


      out = this.walkTreeForText( node );

      if(out !== undefined){
          out = out.replace( /&nbsp;/g, ' ');
          out = out.replace( '–', '-' ); 
          out = entities.decode( out, 2 );
          out = this.removeStartingWhitespace( out );
          if(this.options.collapsesLines){
            out = this.removeEmtpyLines(out);
          }
          out = utils.trim( out );
          return out;
      }else{
          return undefined;
      }
     
    },



    // extracts the text nodes in the tree
    walkTreeForText: function( node ) {
        var out = '',
            replacement = '',
            j = 0;

        // contents of some tags should not be used
        if(this.excludeTags.indexOf( node.name ) > -1){
            return out;
        }

        // if node is a text node get its text
        if(node.type && node.type === 'text'){
            out += this.getElementText( node );
        }

        // if node is a tag look for start or replacement functions
        if(node.type && node.type === 'tag'){
           out += this.getTagStartEnd( node, 'start' ); 
           replacement += this.getTagReplacement( node ); 
        }

        // if we have not replace the node and children then loop on children
        if(!replacement ||  replacement === ''){
            // get the text of the child nodes
            if(node.children && node.children.length > 0){
                for (j = 0; j < node.children.length; j++) {
                    var text = this.walkTreeForText( node.children[j] );
                    if(text !== undefined){
                        out += text;
                    }
                }
            }
        }else{
            out += replacement; 
        }
    
        // if node is a tag look for end functions
        if(node.type && node.type === 'tag'){
           out += this.getTagStartEnd( node, 'end' );
        }
        
        return (out === '')? undefined : out ;
    },  



    getTagStartEnd: function( node, point ) {
        var i = this.elements.length;
        while (i--) {
            if(this.elements[i].tagNames.indexOf( node.name ) > -1){
                if(this.elements[i][point]){
                    return this.elements[i][point](node)
                }
            }
        }
        return '';
    }, 


    getTagReplacement: function( node ) {
        var i = this.elements.length;
        while (i--) {
            if(this.elements[i].tagNames.indexOf( node.name ) > -1){
                if(this.elements[i].replacement){
                    // get innerText as its need to build string
                    var innerText = ''
                    if(node.children && node.children.length > 0){
                        for (var j = 0; j < node.children.length; j++) {
                            var text = this.walkTreeForText( node.children[j] );
                            if(text !== undefined){
                                innerText += text;
                            }
                        }
                    }
                    return this.elements[i].replacement(node, innerText, this)
                }
            }
        }
        return '';
    },


    // get the text from a node in the dom
    getElementText: function( node ){
        if(node.data){
            return this.cleanText(node.data);
        }else{
            return '';
        }
    },

    // get the text from a node in the dom
    cleanText: function( text ){
      if( text && text !== ''){
        // remove line returns, removes tabs and collapses whitespace
        return text.replace(/[\n\r]/g, '').replace(/\t/g, '').replace(/ +(?= )/g,'');
      }
      return text;
    },
      

    // look up full tree for a parent of a child
    findParent: function( node, tags ){
        if(node.type && node.type === 'tag' && node.parent){
          if(tags.indexOf(node.parent.name) > -1){
            return node.parent.name;
          }else{
            return this.findParent( node, tags )
          }
        }
        return null;
    },



    // replace all relative links with absolute ones where it can
    resolveUrls: function(currentUrl){
      var out = currentUrl
      if(this.baseUrl && utils.trim(this.baseUrl) !== ''){
        out = urlParser.resolve(this.baseUrl, currentUrl)
      }
      return out
    },


/*    // return an array of elements that match an attribute/value
    getNodesByAttribute: function(dom, node, name) {
      var selector = '[' + name + ']';
      //return dom(selector, node);
      return dom(node).find(selector);
    },

    // returns the string value of an attribute
    getAttribute: function(dom, node, attributeName) {
      return dom(node).attr(attributeName);
    },

    // sets value of an attribute
    setAttribute: function(dom, node, attributeName, value) {
      return dom(node).attr(attributeName, value);
    },

*/


    // collapses whitespace at start of lines
    removeStartingWhitespace: function( text ){ 
      var out = '',
          lines = text.split('\n'),
          i = lines.length,
          x = 0;
      while (x < i) {
          out += utils.ltrim( lines[x] ) + '\n';
          x++;
      }
      return out;
    },


    // remove unneeded emtpy line markdown text
    removeEmtpyLines: function( text ){ 
      var out = '',
          lines = text.split('\n'),
          i = lines.length,
          x = 0,
          hasStarted = false;
      while (x < i) {

          if(lines[x] !== ''){
            hasStarted = true;
            out += lines[x] + '\n';
          }

          if(lines[x] === '' && hasStarted){
            if(x > 0 && lines[x-1] !== ''){
              out += '\n';
            }
          }

          x++;
      }
      return out;
    }

};