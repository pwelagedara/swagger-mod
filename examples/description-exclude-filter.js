'use strict';

const swaggerMod= require("./../index.js");

const opts = {
    filters: {

        // Filter by description using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        description: {
            exclude: [
                '/For valid response try integer IDs with positive integer value\. Negative or non-integer values will generate API errors/' // Case sensitive match
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