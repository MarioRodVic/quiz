//IMPORTAR PAQUETES CON MIDDLEWARE QUE HEMOS INSTALADO CON NPM INSTALL
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');

//importamos los dos enrutadores
var routes = require('./routes/index');
//var users = require('./routes/users'); comentamos porque no la vamos a usar

//creamos la aplicación
var app = express();

// view engine setup
//instala generador de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//Instala los middlewares que anteriormente se han importado
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//este ya viene de serie con Express
app.use(partials());

//instala enrutadores
app.use('/', routes);
//app.use('/users', users); no lo vamos a usar

// catch 404 and forward to error handler
//para el resto de rutas que no sean la de los enrutadores
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err //print
        });
    });
}

// production error handler
// no stacktraces leaked to user
//gestión de errores de producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
