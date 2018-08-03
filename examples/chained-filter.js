const swaggerMod= require("./../index.js");

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
        },

        // Filter by tags using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        tags: {
            exclude: [
                '/^default$/i',
                '/Store/i'
            ]
        },

        // Filter by summary using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        summary: {
            include: [
                '/Find pet by ID/',
                '/Deletes a pet/'
            ]
        },

        // Filter by description using regular expressions
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        description: {
            include: [
                '/Returns a single pet/'
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