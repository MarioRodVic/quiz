var models = require('../models/models.js')

//autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId = ' + quizId));
			}
		}).catch(function(error){next(error);});
};

exports.index = function(req, res){
	if(typeof(req.query.search) == "undefined"){  //comprobamos si la carga de index es a través de url preguntas o búsqueda. si existe req.query.search, entonces es que index se ha cargado a través del botón buscar
		req.query.search="";
	}
	
	models.Quiz.findAll({where: ["pregunta like ?", '%'+req.query.search+'%']}).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes, search: req.query.search});
	}).catch(function(error){ next(error);})
};

//GET /quizes/:id
exports.show = function(req, res){
		res.render('quizes/show', {quiz:req.quiz});

};

exports.answer= function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto!'
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};


//GET /author
exports.author = function(req, res){
	res.render('author');
};