'use strict';

const swaggerMod= require("./../index.js");

const opts = {
    filters: {

        // Filter by summary using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        summary: {
            exclude: [
                '/Delete purchase order by ID/i', // Match ignoring case
                '/^Deletes a pet$/', // Exact match
                '/Delete user/' // Case sensitive match
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