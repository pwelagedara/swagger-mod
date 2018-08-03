const swaggerMod= require("./../index.js");

const opts = {
    filters: {

        // Filter by HTTP methods
        http: {
            exclude: ['delete', 'put', 'post']
        }
    }
};

swaggerMod('https://petstore.swagger.io/v2/swagger.json', opts)
  .then(function(modifiedSchema) {
    console.log(modifiedSchema); 
  }).catch(function(err) {
    console.error(err);
  });