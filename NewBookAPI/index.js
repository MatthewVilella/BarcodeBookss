// Import the 'app' module
const app = require("./app");
const config = require('./types/env.d');

// Start the server and make it listen on a specified port
app.listen(process.env.PORT || config.ROUTE_PORT, () => {
  // Print a message to the console when the server starts
  console.log("server starting on port ");
});