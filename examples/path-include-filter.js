'use strict';

const swaggerMod= require("./../index.js");

const opts = {
    filters: {

        // Filter by paths using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        paths: {
            include: [
                    '/^/user/', // Starts with /user 
                    '/INVENTORY$/i' // Ends with INVVENTORY( ignoring case)
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