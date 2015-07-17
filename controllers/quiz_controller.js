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
		var busqueda="";
	}else{
		busqueda = req.query.search.toLowerCase().replace(/[ ]+/g,'%');
	}
	if(req.query.categ){
		var tema = req.query.categ;
		models.Quiz.findAll({where: ["lower(tema) like ?", '%'+tema+'%'], order: 'tema asc'}).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
		}).catch(function(error){ next(error);})	
	}else{
		models.Quiz.findAll({where: ["lower(pregunta) like ?", '%'+busqueda+'%'], order: 'pregunta asc'}).then(function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes, errors:[], search: req.query.search});
		}).catch(function(error){ next(error);})
	}
};

//GET /quizes/:id
exports.show = function(req, res){
		res.render('quizes/show', {quiz:req.quiz, errors:[]});

};

exports.answer= function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto!'
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

exports.new = function(req, res){
	var quiz = models.Quiz.build( //crea objeto quiz
			{pregunta: "inserte pregunta", respuesta: "inserte respuesta"}
		);
	res.render('quizes/new', {quiz: quiz, errors:[]}); //renderiza la vista quizes/new con el objeto quiz que hemos construido
};

exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else{
			// guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
				res.redirect('/quizes');  //Redirecciona HTTP (URL relativo) Lista de preguntas
			})
		}
	})
};

exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors:[]});
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors})
		}else{
			req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){  //guarda los datos en Base de Datos
				res.redirect('/quizes'); //redirecciona al listado de preguntas
			});
		}
	});
};

exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

//GET /author
exports.author = function(req, res){
	res.render('author', {autor: 'Mario Rodríguez Vicente', errors:[]} );
};