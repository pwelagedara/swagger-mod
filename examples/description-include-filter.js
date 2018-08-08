'use strict';

const swaggerMod= require("./../index.js");

const opts = {
    filters: {

        // Filter by description using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        description: {
            include: [
                '/This can only be done by the logged in user\./' // Case sensitive match
            ]
        }
    }
};

swaggerMod('https://petstore.swagger.io/v2/swagger.json', opts)
  .then(function(modifiedSchema) {
    console.log(modifiedSchema);
  })
  .catch(function(err) {
    console.error(err);
  });