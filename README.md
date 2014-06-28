
## HTML to Markdown 

This is a work in progress does not yet support:

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




