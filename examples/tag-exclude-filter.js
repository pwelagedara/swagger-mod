const swaggerMod= require("./../index.js");

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