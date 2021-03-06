# swagger-mod

[![Build Status](https://travis-ci.org/pwelagedara/swagger-mod.svg?branch=master)](https://travis-ci.org/pwelagedara/swagger-mod)
[![Coverage Status](https://coveralls.io/repos/github/pwelagedara/swagger-mod/badge.svg?branch=master)](https://coveralls.io/github/pwelagedara/swagger-mod?branch=master)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/swagger-mod.svg)](https://www.npmjs.com/package/swagger-mod)
[![npm](https://img.shields.io/npm/dw/swagger-mod.svg)](https://www.npmjs.com/package/swagger-mod)
[![GitHub last commit](https://img.shields.io/github/last-commit/pwelagedara/swagger-mod.svg)](https://github.com/pwelagedara/swagger-mod)

Modifies an existing swagger document using filters. Many examples can be found in `examples` directory in the [source code repository][source]. 

## How to use the library
Install the library.

```bash
npm install swagger-mod --save
```

Use the Promises syntax to modify your swagger document. 

The code snippet below filters an existing swagger document by HTTP methods. The resultant swagger will only contain `GET`, `PUT` and `DELETE` methods. To exclude an HTTP method simply use the `exclude` tag inside `http` tag. Note that you cannot use `include` and `exclude` both at once. 

```js
const swaggerMod= require("swagger-mod");

const opts = {
    filters: {

        // Filter by HTTP methods
        // Do not use regular expressions here
        http: {
            include: ['get', 'put', 'post']
        }
    }
};

swaggerMod('https://petstore.swagger.io/v2/swagger.json', opts)
  .then(function(modifiedSchema) {
    console.log(modifiedSchema); 
  }).catch(function(err) {
    console.error(err);
  });
```

Given below is an example for filtering by tags. Use [regular expressions][regex] to do the filtering.

```js
const swaggerMod= require("swagger-mod");

const opts = {
    filters: {

        // Filter by tags using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        tags: {
            exclude: [
                '/^pet$/i', // Exact match( case insensitive)
                '/store/i' // Ignores case
            ]
        }
    }
};

swaggerMod('https://petstore.swagger.io/v2/swagger.json', opts)
  .then(function(modifiedSchema) {
    console.log(modifiedSchema);     
  }).catch(function(err) {
    console.error(err);
  });
```

You can chain your filters like this.

```js
const opts = {
    filters: {

        // Filter by HTTP methods
        http: {
            include: ['get', 'delete']
        },

        // Filter by paths using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        paths: {
             exclude: [
                '//pet/findByStatus/'
             ]
        }
    }
};
```

## Available filters

- `http`
- `paths`
- `tags`
- `summary`
- `description`

## Other examples

The `examples` directory in the [source code repository][source] has many examples.

## A demo application 

A demo express app using `swagger-mod` can be found [here][demo].

## Writing regular expressions

A regular expression is is a pattern enclosed within two slashes. 

```js
/Store/
```
`^` matches the beginning of input and `$` matches end of input. Therefore the regular expression below matches `Store`.

```js
/^Store$/
```
To make this case insensitive add `i` flag. The regular expression below matches `Store`, `store`, `STORE` etc.

```js
/^Store$/i
```

For more ways to write regular expressions refer to the [documentation][regex].

## License 

The Project is under [MIT][mit] License. Internet is free. Use the code anyway you like. 

Sample swagger document `swagger.json` is under [Apache 2.0 License][apache2].

[source]: https://github.com/pwelagedara/swagger-mod
[regex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
[demo]: https://github.com/pwelagedara/swagger-mod-demo
[apache2]: http://www.apache.org/licenses/LICENSE-2.0.html
[mit]: https://opensource.org/licenses/MIT
