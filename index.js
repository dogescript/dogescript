var System = require('es6-module-loader').System;

System.import('./src/dogescript').then(function(index) {
    // Pass along the current directory,
    // as well as the program arguments
    index.main(__dirname, process.argv);
}).catch(function(err){
    console.log('err', err);
});
