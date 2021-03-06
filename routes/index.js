var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',  errors:[] });
});

//Autoload de comandos con :quizId
//quizController.load() se instala para que se ejecute antes de que lo necesiten las rutas show y answer y solo en el caso de que path contenga :quizId, referenciando un recurso en la tabla Quiz de la base de datos que 
//deba ser procesado por el controlador. Sí quizId existe en la ruta entonces llama a load
router.param('quizId', quizController.load); //autoload :quizId

router.param('commentId', commentController.load); //autoload: commentId

//Definición de rutas de sesión
router.get('/login', sessionController.new);       //formulario login
router.post('/login', sessionController.create);   //crear sesión
router.get('/logout', sessionController.destroy);  //destruir sesión

//Definición de rutas de quizes
router.get('/quizes',                        quizController.index);
router.get('/quizes/:quizId(\\d+)',          quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);
router.get('/author',                        quizController.author);

//Estadísticas
router.get('/quizes/statistics',             statisticsController.index);

//para primitivas que solo puedan usarse para usuarios autenticados
router.get('/quizes/new',                    sessionController.loginRequired, quizController.new);
router.post('/quizes/create',                sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',     sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',          sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',       sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);
router.delete('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/', sessionController.loginRequired, commentController.destroy);

module.exports = router;
