const express = require('express');
const logger = require('morgan');
const testes = require('./api/routes/testes');
const users = require('./api/routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./api/config/database'); //database configuration
var jwt = require('jsonwebtoken');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
//var swaggerDocument = require('./swagger.json');
app.set('secretKey', 'Y{ca%n75U!_>,@c'); // jwt secret token

const options = {
	// line 27
	swaggerDefinition: {
		info: {
			title: 'swagger-express-jsdoc', // Title (required)
			version: '1.0.1', // Version (required)
		},
		host: 'localhost:3000',
		basePath: '/',
	},
	apis: ['./users'], // Path to the API docs
};
const swaggerSpec = swaggerJSDoc(options);

// connection to mongodb
mongoose.connection.on(
	'error',
	console.error.bind(console, 'MongoDB connection error:')
);
app.use(logger('dev'));
app.get('/api-docs.json', function (req, res) {
	// line 41
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
	res.json({ estado: 'ok' });
});
// public route
app.use('/users', users);
// private route
app.use('/testes', validateUser, testes);
app.get('/favicon.ico', function (req, res) {
	res.sendStatus(204);
});
function validateUser(req, res, next) {
	jwt.verify(
		req.headers['x-access-token'],
		req.app.get('secretKey'),
		function (err, decoded) {
			if (err) {
				res.json({ status: 'error', message: err.message, data: null });
			} else {
				// add user id to request
				req.body.userId = decoded.id;
				next();
			}
		}
	);
}
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// handle errors
app.use(function (err, req, res, next) {
	console.log(err);

	if (err.status === 404) res.status(404).json({ message: 'Not found' });
	else res.status(500).json({ message: 'Something looks wrong :( !!!' });
});
app.listen(3000, function () {
	console.log('Node server listening on port 3000');
});

// connection to mongodb