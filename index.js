'use strict';

const SwaggerParser = require("swagger-parser");
const _ = require('lodash');

const config = require("./config");

module.exports = function(schemaDoc, opts) {

    return new Promise(function(resolve, reject) {
        
        // Validate the Swagger Document first
        SwaggerParser.validate(schemaDoc)
            .then(function(schema) {
                delete schema.definitions;

                // Run the Swagger Document through the filters
                return filter(schema, opts);
            }).then(function(filteredSchema) {

                return cleanup(filteredSchema);
            }).then(function(cleanedUpSchema) {
                return resolve(cleanedUpSchema);
            }).catch(function(err) {
                return reject(err);
            });
    });
}

// Main filter function
function filter(schema, opts) {
    
    // Apply filters
    return new Promise(function(resolve, reject) {

        // Check if filters are defined
        if(!opts.filters) return resolve(schema);

        // Http includes and excludes
        processHttp(schema, opts)
            .then(function(httpFilteredSchema) {

                // Path includes and excludes
                return processPaths(httpFilteredSchema, opts);
            }).then(function(pathFilteredSchema) {

                // Tag includes and excludes
                return processTags(pathFilteredSchema, opts);
            }).then(function(tagFilteredSchema) {

                // Summary
                return processSummaryOrDescription(tagFilteredSchema, opts, 'summary');
            }).then(function(summaryFilteredSchema) {

                // Description
                return processSummaryOrDescription(summaryFilteredSchema, opts, 'description');
            }).then(function(filteredSchema) {
                return resolve(filteredSchema);
            }).catch(function(err) {
                return reject(err);
            }); 
    });
}

// Remove unused tags etc
function cleanup(schema) {
    
    return new Promise(function(resolve, reject) {
        if(schema.tags) {
            schema.tags = _.remove(schema.tags, function(o) {
                var keep = false;
                _.forEach(schema.paths, function(value, key) {
                    _.forEach(value, function(value1, key1) {
                        if(!value1.tags){
                            keep = _.isEqual('default', o.name);
                        } else {
                            keep = _.includes(value1.tags, o.name);
                        }  
                        return !keep;
                    });
                    return !keep;
                });
                return keep; // Returning false removes the element
            });
        }
        return resolve(schema);
    });
}

// Process http includes and excludes
function processHttp(schema, opts) {

    return new Promise(function(resolve, reject) {

        // Check if http filters are defined with includes or excludes
        if(!isFilterAvailable('http', opts)) return resolve(schema);

        // Both include and exclude should not be there
        if(!checkIncludeExcludeValidity('http', opts)) return reject(getErrorDto(config.ERROR_INCLUDE_EXCLUDE));

        // Includes
        schema = filterHttp(opts.filters.http.include, schema, true);

        // Excludes
        filterHttp(opts.filters.http.exclude, schema, false);

        return resolve(schema);
    });
}

function filterHttp(arr, schema, includes){
    if(arr && arr.length > 0) {
        var methodParams = arr;
        schema.paths  = _.pickBy(_.mapValues(schema.paths, (o) => {
            return _.pickBy(o, (value, key) => {
                var keep = !includes;
                methodParams.every(function(httpMethod, index) {
                    keep =includes? (_.isEqual(_.toUpper(key), _.toUpper(httpMethod))): (!(_.isEqual(_.toUpper(key), _.toUpper(httpMethod))));
                    return includes? (!keep): keep;
                });
                return keep;
            }); 
        }), (value, key ) => {
            return !_.isEmpty(value)
        });
    }
    return schema;
}

// Process path includes and excludes
function processPaths(schema, opts) {

    return new Promise(function(resolve, reject) {

        // Check if http filters are defined with includes or excludes
        if(!isFilterAvailable('paths', opts)) return resolve(schema);

        // Both include and exclude should not be there
        if(!checkIncludeExcludeValidity('paths', opts)) return reject(getErrorDto(config.ERROR_INCLUDE_EXCLUDE));

        // Includes
        schema = filterPaths(opts.filters.paths.include, schema, true);

        // Excludes
        schema = filterPaths(opts.filters.paths.exclude, schema, false);    

        return resolve(schema);
    });
}

function filterPaths(arr, schema, includes) {
    if(arr && arr.length > 0) {
        var pathParams = arr;
        schema.paths = _.pickBy(schema.paths, (value, key) => {
            var keep = !includes;
            pathParams.every(function(path, index) {
                var regEx = stringToRegEx(path);
                keep = includes? (regEx.test(key)): (!regEx.test(key));
                return includes? (!keep): keep;
            });
            return keep;
        });
    }
    return schema;   
}

// Process tag includes and excludes
function processTags(schema, opts) {

    return new Promise(function(resolve, reject) {

        // Check if http filters are defined with includes or excludes
        if(!isFilterAvailable('tags', opts)) return resolve(schema);

        // Both include and exclude should not be there
        if(!checkIncludeExcludeValidity('tags', opts)) return reject(getErrorDto(config.ERROR_INCLUDE_EXCLUDE));

        // Includes
        schema = filterTags(opts.filters.tags.include, schema, true);

        // Excludes
        schema = filterTags(opts.filters.tags.exclude, schema, false);

        return resolve(schema);
    });
}

function filterTags(arr, schema, includes) {
    if(arr && arr.length > 0) {
        var tags = arr;
        schema.paths = _.pickBy(_.mapValues(schema.paths, (o) => {
            return _.pickBy(o, (value, key) => {
                var keep = !includes;

                tags.every(function(tag, index) {
 
                    // Handling default tag
                    if(!value.tags ) {
                        value.tags = ['default'];
                    } 

                    if (value.tags && value.tags.length == 0){
                        value.tags = ['default'];
                    }

                    var tagAvailable = _.findIndex(value.tags, function(o1) { 
                        var regEx = stringToRegEx(tag);
                        return regEx.test(o1);
                    });

                    if (value.tags[0] == 'default') delete value.tags;

                    keep = includes? ((tagAvailable > -1)? true: false): ((tagAvailable > -1)? false: true);
                    return includes? (!keep): keep;
                });
                return keep;
            });
          }), (value, key) => {
            return !_.isEmpty(value);
          });
    }
    return schema;
}

// Filter by summary or description
function processSummaryOrDescription(schema, opts, summaryOrDescription, includes) {

    return new Promise(function(resolve, reject) {

        // Check if http filters are defined with includes or excludes
        if(!isFilterAvailable(summaryOrDescription, opts)) return resolve(schema);

        // Both include and exclude should not be there
        if(!checkIncludeExcludeValidity(summaryOrDescription, opts)) return reject(getErrorDto(config.ERROR_INCLUDE_EXCLUDE));
   
        // Includes
        schema = filterSummaryOrDescription(opts.filters[summaryOrDescription].include, schema, summaryOrDescription, true);

        // Excludes
        schema = filterSummaryOrDescription(opts.filters[summaryOrDescription].exclude, schema, summaryOrDescription, false);

        return resolve(schema);
    });
}

function filterSummaryOrDescription(arr, schema, summaryOrDescription, includes) {
    if(arr && arr.length > 0) {
        var summaryOrDescriptionArr = arr;
        schema.paths = _.pickBy(_.mapValues(schema.paths, (o) => {
            return _.pickBy(o, (value, key) => {
                var keep = !includes;
                summaryOrDescriptionArr.every(function(str, index) {

                    // Summary and description are optional
                    if(!value[summaryOrDescription]) {
                        keep = !includes;
                        return false;
                    } else{
                        var regEx = stringToRegEx(str);
                        keep = includes? (regEx.test(value[summaryOrDescription])): (!regEx.test(value[summaryOrDescription]));
                    }
                    return includes? (!keep): keep;
                });
                return keep;
            });
          }), (value, key) => {
            return !_.isEmpty(value);
          });
    }
    return schema;
}

function stringToRegEx(str){
    var partials = /\/(.*)\/(.*)/.exec(str);
    return new RegExp(partials[1], partials[2]);
}

function isFilterAvailable(filterName, opts) {
    if(!(opts.filters[filterName])) return false;
    if((!opts.filters[filterName].include) && (!opts.filters[filterName].exclude)) return false;
    return true;
}

function checkIncludeExcludeValidity(filterName, opts) {
    if (opts.filters[filterName].include && opts.filters[filterName].exclude) {
        return false;
    }
    return true;
}

function getErrorDto(message) {
    return {
        message: message
    }
}