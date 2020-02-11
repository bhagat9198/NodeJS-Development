const path = require('path');

// "dirname" : Return the directory name of a path
//              so, we have to find out for which dirfile, we have to get the name
// "process" : its a global variable, present in all the files
//              it contains the mainModule property
// "mainModule" : tells the main module which started our application
// "filename": to get the filename where main module file started the application

// "(process.mainModule.filename)" it gives us the name of main application which started all the process ie "app.js"

// dirname(process.mainModule.filename) : it will gives the path of "app.js" file where it is located.

module.exports = path.dirname(process.mainModule.filename)