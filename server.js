// Modules
var logger = require('./utils/logger.js')()
var fs = require('fs');
if (fs.existsSync('newrelic.js')) {
  logger.info("Using newrelic")
  require('newrelic');
}
var express = require('express')
var morgan = require('morgan')
var constants = require('./utils/constants.js')
const path = require('path')
// App
var app = express()
app.use(morgan('dev'))
app.use(constants.API_PREFIX + '/templates', express.static('templates'))
app.use(express.static('public'))
app.use('/', require('./api'))
app.use(express.static('./client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});
// app.get('*', function (req, res) {
//   res.render('index.html.ejs')
// })

// Server
var server = app.listen(process.env.DEFAULT_PORT || 3000, function () {
  logger.info('Server is listening on port %d'+ server.address().port)
})

/**
 * @see {https://jira.corp.adobe.com/browse/EON-6340}
 * @see {https://nodejs.org/docs/latest-v10.x/api/http.html#http_server_keepalivetimeout}
 * @see {https://github.com/envoyproxy/envoy/issues/1979}
 */
server.keepAliveTimeout = 0;
