'use strict';

const expect = require('chai').expect;
const swaggerMod= require("./../index.js");

// Swagger document location. I am using a downloaded copy.
// const url = 'https://petstore.swagger.io/v2/swagger.json';
const url = './swagger.json';

// Refer to Chai Documentation
// http://www.chaijs.com/api/bdd/
describe('swaggerMod()', () => {

    // Simple Include filters

    // HTTP include filters
    it('http include filter should work', async () => {

        const opts = {
            filters: {
    
                http: {
                    include: ['delete', 'put']
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/{petId}', '/store/order/{orderId}', '/user/{username}');

        // HTTP methods
        expect(result.paths['/pet']).to.not.have.any.keys('get', 'post');
        expect(result.paths['/pet/{petId}']).to.not.have.any.keys('get', 'post');
        expect(result.paths['/store/order/{orderId}']).to.not.have.any.keys('get', 'post');
        expect(result.paths['/user/{username}']).to.not.have.any.keys('get', 'post');
    });

    // Path include filters
    it('path include filter should work', async () => {

        const opts = {
            filters: {
    
                paths: {
                    include: [
                            '/^/pet/'
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.not.have.all.members(['user', 'store']);
    });

    // tag include filters
    it('tag include filter should work', async () => {

        const opts = {
            filters: {
    
                tags: {
                    include: [
                        '/^pet$/i',
                        '/store/i' 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage', '/store/inventory', '/store/order', '/store/order/{orderId}');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['pet', 'store']);
    });

    // summary include filters
    it('summary include filter should work', async () => {

        const opts = {
            filters: {
    
                summary: {
                    include: [
                        '/Add a new pet to the store/i', 
                        '/^Returns pet inventories by status$/' 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/store/inventory');

        // HTTP methods
        expect(result.paths['/pet']).to.have.all.keys('post');
        expect(result.paths['/store/inventory']).to.have.all.keys('get');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['pet', 'store']);
    });

    // description include filters
    it('description include filter should work', async () => {

        const opts = {
            filters: {
    
                description: {
                    include: [
                        '/Other values will generated exceptions/', 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/store/order/{orderId}');

        // HTTP methods
        expect(result.paths['/store/order/{orderId}']).to.have.all.keys('get');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.not.have.any.members(['pet', 'user']);
    });

    // Simple Exclude filters

    // HTTP exclude filters
    it('http exclude filter should work', async () => {

        const opts = {
            filters: {
    
                http: {
                    exclude: ['delete', 'get', 'post']
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/user/{username}');

        // HTTP methods
        expect(result.paths['/pet']).to.not.have.any.keys('delete', 'get', 'post');
        expect(result.paths['/user/{username}']).to.not.have.any.keys('delete', 'get', 'post');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.not.have.any.members(['store']);
    });

    // Path exclude filters
    it('path exclude filter should work', async () => {

        const opts = {
            filters: {
    
                paths: {
                    exclude: [
                            '/^/pet/'
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.not.have.any.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.not.have.any.members(['pet']);
    });

    // tag exclude filters
    it('tag exclude filter should work', async () => {

        const opts = {
            filters: {
    
                tags: {
                    exclude: [
                        '/^pet$/i',
                        '/store/i' 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.not.have.any.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage', '/store/inventory', '/store/order', '/store/order/{orderId}');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['user']);
    });

    // summary exclude filters
    it('summary exclude filter should work', async () => {

        const opts = {
            filters: {
    
                summary: {
                    exclude: [
                        '/Add a new pet to the store/i', 
                        '/Update an existing pet/',
                        '/^Returns pet inventories by status$/' 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.not.have.any.keys('/pet', '/store/inventory');
    });

    // description exclude filters
    it('description exclude filter should work', async () => {

        const opts = {
            filters: {
    
                description: {
                    exclude: [
                        '/Other values will generated exceptions/' 
                    ]
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths['/store/order/{orderId}']).to.not.have.any.keys('get');
    });

    // Chained filters

    // chained filters
    it('chained filter should work', async () => {

        const opts = {
            filters: {

                http: {
                    include: ['post']
                },

                paths: {
                    exclude: [
                            '/^/pet/'
                    ]
                },

                tags: {
                    exclude: [
                        '/^pet$/i',
                        '/store/i' 
                    ]
                },
    
                summary: {
                    exclude: [
                        '/Create user/'
                    ]
                },

                description: {
                    include: [
                        '/Create/'
                    ]
                }

            }
        };

        const result = await swaggerMod(url, opts);

        // Paths
        expect(result.paths).to.not.have.any.keys('/user', '/user/createWithArray', '/user/createWithList');
    });

    // Having both include and exclude filters

    // HTTP include and exclude filters
    it('http include and exclude filter should throw an error', async () => {

        const opts = {
            filters: {
    
                http: {
                    include: ['delete', 'put'],
                    exclude: ['post']
                }
            }
        };

        try {
            const result = await swaggerMod(url, opts);
            expect(1).to.equal(2); 
        } catch(err) {
            expect(err.message).to.equal('Include and exclude arrays cannot coexist. Specify only one');
        }
    });

    // path include and exclude filters
    it('path include and exclude filter should throw an error', async () => {

        const opts = {
            filters: {
    
                paths: {
                    exclude: [
                            '/^/pet/'
                    ],
                    include: [
                        '/^/store/'
                    ]
                }
            }
        };

        try {
            const result = await swaggerMod(url, opts);
            expect(1).to.equal(2); 
        } catch(err) {
            expect(err.message).to.equal('Include and exclude arrays cannot coexist. Specify only one');
        }
    });

    // tags include and exclude filters
    it('tag include and exclude filter should throw an error', async () => {

        const opts = {
            filters: {
    
                tags: {
                    exclude: [
                        '/^pet$/i',
                        '/store/i' 
                    ],
                    include: [
                        '/^user$/i'
                    ]
                }
            }
        };

        try {
            const result = await swaggerMod(url, opts);
            expect(1).to.equal(2); 
        } catch(err) {
            expect(err.message).to.equal('Include and exclude arrays cannot coexist. Specify only one');
        }
    });

    // summary include and exclude filters
    it('summary include and exclude filter should throw an error', async () => {

        const opts = {
            filters: {
    
                summary: {
                    include: [
                        '/Add a new pet to the store/i'
                    ],
                    exclude: [
                        '/^Returns pet inventories by status$/'
                    ]
                }
            }
        };

        try {
            const result = await swaggerMod(url, opts);
            expect(1).to.equal(2); 
        } catch(err) {
            expect(err.message).to.equal('Include and exclude arrays cannot coexist. Specify only one');
        }
    });

    // description include and exclude filters
    it('description include and exclude filter should throw an error', async () => {

        const opts = {
            filters: {
    
                description: {
                    exclude: [
                        '/Other values will generated exceptions/' 
                    ],
                    include: [
                        '/Other values will generated exceptions/' 
                    ]   
                }
            }
        };

        try {
            const result = await swaggerMod(url, opts);
            expect(1).to.equal(2); 
        } catch(err) {
            expect(err.message).to.equal('Include and exclude arrays cannot coexist. Specify only one');
        }
    });

    // Having no include and exclude filters

    // HTTP include and exclude filters
    it('no include and filter should work', async () => {

        const opts = {
            filters: {
    
                http: {
                }
            }
        };

        const result = await swaggerMod(url, opts);

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['store', 'pet', 'user']);
    });

    // Having default tag

    // Tags include filters
    it('default tag check for undefined in cleanup should work', async () => {

        const intermediateResult = await swaggerMod(url, {});
        intermediateResult.tags.push({ name: 'default', description: 'default tag' });
        delete intermediateResult.paths['/pet'].post.tags;

        const opts = {
            filters: {
    
                tags: {
                    include: [
                        '/^pet$/i',
                        '/^default$/'
                    ]
                }
            }
        };

        const result = await swaggerMod(intermediateResult, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['pet', 'default']);
    });

    // Tags include filters
    it('default tag check for empty array in cleanup should work', async () => {

        const intermediateResult = await swaggerMod(url, {});
        intermediateResult.tags.push({ name: 'default', description: 'default tag' });
        intermediateResult.paths['/pet'].post.tags = [];

        const opts = {
            filters: {
    
                tags: {
                    include: [
                        '/^pet$/i',
                        '/^default$/'
                    ]
                }
            }
        };

        const result = await swaggerMod(intermediateResult, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage');

        // Tags
        var tags = [];
        (result.tags).forEach(function(o){
            tags.push(o.name);
        });
        expect(tags).to.have.all.members(['pet', 'default']);
    });

    // Swagger with no tags

    // Delete tags
    it('swagger with no tags should work', async () => {

        const intermediateResult = await swaggerMod(url, {});
        delete intermediateResult.tags;

        const opts = {
            filters: {
    
                tags: {
                    include: [
                        '/^pet$/i',
                        '/store/i' 
                    ]
                }
            }
        };

        const result = await swaggerMod(intermediateResult, opts);

        // Paths
        expect(result.paths).to.have.all.keys('/pet', '/pet/findByStatus', '/pet/findByTags', '/pet/{petId}', '/pet/{petId}/uploadImage', '/store/inventory', '/store/order', '/store/order/{orderId}');
    });

});