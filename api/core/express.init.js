const compression = require('compression');
const express = require('express');
const session = require('express-session');
// const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const swig = require('swig');
const helmet = require('helmet');
const aqp = require('api-query-params');
const cors = require('cors');

const config = require('../config');
var ContentStore = require('../bin/contentStore');

var { ValidationError } = require('express-json-validator-middleware');
var HandlerException = require('../bin/exceptionBlock');

const app = express();
const server = require('http').Server(app);

app.use(compression());
const mongoose = require('mongoose');
mongoose.connect(config.db, {
  useCreateIndex: true,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

// var whitelist = ['http://localhost:8080', 'http://localhost:3000'];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   optionsSuccessStatus: 200,
//   credentials: true
// }));

// Proteger la aplicación de algunas vulnerabilidades web
app.use(helmet());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.locals.title = 'Georuta';
app.locals.email = 'georuta@gmail.com';

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// View Engine
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');
app.set('view cache', true);
swig.setDefaults({ cache: false });

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// use sessions for tracking logins
app.use(session({
  secret: 'mugiwara',
  resave: true,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  var source = { request_time: req._startTime };
  req.contentStore = new ContentStore(source);
  req.contentStore.links = { self: req.originalUrl };
  return next();
});

app.use((req, res, next) => {
  req.query = aqp(req.query);
  next();
});

// Router documentacion
app.use('', require('../apps'));

app.use(function (req, res, next) {
  req.contentStore
    .addError(new HandlerException(HandlerException.URL_NOT_FOUND));
  return res
    .status(req.contentStore.status)
    .json(req.contentStore.beauty());
});

app.use(function (err, req, res, next) {
  console.log(err)
  if (err instanceof ValidationError) {
    // At this point you can execute your error handling code
    err.message = 'Se ha presentado un error en la validaciòn de los datos enviados al servidor';
  }
  req.contentStore
    .addError(new HandlerException(err));
  return res
    .status(req.contentStore.status)
    .json(req.contentStore.beauty());
});

server.listen(config.port);
