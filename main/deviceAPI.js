// Imports
const express = require("express");
const app = express();

app.get('/', function (req, res) {});

/**
 * @param {Number} port 
 * @param {Function} callback 
 */
function listen(port, callback) {
  app.listen();
}

module.exports = {
  listen
}