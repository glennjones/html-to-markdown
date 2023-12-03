
## HTML to Markdown 

This is a 9-year-old historical project - It is left up as an archive.


Support the conversion of:

1. Headings `<h1>` `<h2>` etc
2. Block level `<p>` and `<div>`
3. Lists `<ul>` and `<ol>`
4. Links `<a>`
5. Images `<img>`
6. Inline tags `<strong>` `<b>` `<em>` and `<i>`
7. Line `<hr/>`
8. Break line `<br/>`

Does not yet support:

1. Blockquotes
2. Passthrough Html
3. Backslash escapes
4. Internal links

See test for current support


Idea from [https://github.com/domchristie/to-markdown](https://github.com/domchristie/to-markdown)


## Errors

The error format can have any combination of 4 properties; code, error, message and validation. The fourth property validation, is added if a input value is in the incorrect format. 
    
    {
      "statusCode": 400,
  		"error": "Bad Request",
  		"message": "the value of b must be a number",
  		"validation": {
    		"source": "path",
    		"keys": [
      		"b"
    		]
  		}
	}



## Mocha integration test
The project has a number integration and unit tests. To run the test, `cd` to project directory type the following command

    $ mocha --reporter list




