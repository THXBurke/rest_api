if (!process.env.APP_SECRET) throw new Error('Please set the APP_SECRET');
var PORT = process.env.PORT || 3000;
var app = require(__dirname + '/_server.js');
app.listen(PORT, 'mongodb://localhost/db', () => console.log('server happy at' + PORT));
