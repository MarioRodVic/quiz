//IMPORTAR PAQUETES CON MIDDLEWARE QUE HEMOS INSTALADO CON NPM INSTALL
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');

var methodOverride = require('method-override');

var session = require('express-session');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz MRV'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));//este ya viene de serie con Express

//Herlpers dinámicos
app.use(function(req, res, next){
    //guarda path de la solicitud en session.redir para después de login vuelva a la página en la que estaba el cliente
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }
    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//MW para controlar expiración de sesión por inactividad

//tiempo de sesion
 app.use(function(req, res, next) {
    res.locals.aviso = "";
     if(req.session.user){//si existe una sesión de usuario
         if(!req.session.iniciaTiempo){//y no existe la variable iniciaTiempo la crea con la hora actual
             req.session.iniciaTiempo=Date.now()
        }else{//si existe la variable iniciaTiempo y esta se creó hace mas de dos minutos, entonces borra la sesión
            if(Date.now()-req.session.iniciaTiempo > 120000){
                res.locals.aviso = "Su sesión ha expirado por inactividad";
                delete req.session.user;  
                req.session.iniciaTiempo=null;//"borramos" la variable iniciaTiempo también al destrui la sesión en session_controller.js
            }else{
                req.session.iniciaTiempo=Date.now(); //si no se destruye la sesión se actualiza el tiempo en la variable iniciaTiempo
            }
        }
    }
    next();
});

app.use(partials());
app.use(methodOverride('_method'));

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
            error: err,
            errors:[] //print
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
        error: {},
        errors:[]
    });
});


module.exports = app;
