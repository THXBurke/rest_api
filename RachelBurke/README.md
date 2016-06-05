# Two resource REST API with wine and cheese party. 4/22/16

Added Angular1 directives 5/22/16
Added Auth 6/4/16

## How to use:
  * First type npm i into your command line to install all packages.
  * Run gulp build in the terminal to build the file content needed.
  * Run server by entering node server.js into the terminal.
  * Run client server with node client_server.js
  * To add wine enter localhost:5000/api/wine
  * To add cheese enter localhost:5000/api/cheese
  * To see how they go together enter localhost:5000/api/pairing
  * To run unit tests for client-side enter karma start

## How to use with auth:

1.) Open a mongod connection in a terminal window.
2.) In a different terminal window enter "export APP_SECRET='appsecret'"
3.) Launch node server.js in a separate terminal window.
4.) In another terminal window run GET POST etc. from command line.

### /wine routes

example using Httpie: http POST localhost:5000/api/wine wineName=Merlot year='2001' http GET localhost:5000/api/wine
