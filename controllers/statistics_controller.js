var models = require('../models/models.js');

exports.index = function(req, res){
	var nPreguntas;
	var nComentarios;
	var cPorP;
	var pregConComent;
	var pregSinComent
	//connection.query('SELECT * FROM Preguntas', function(resultado));
	models.Quiz.count().then(function(count){
		nPreguntas = count;
	});

	models.Comment.count().then(function(count){
		nComentarios = count;
		CporP = (nComentarios/nPreguntas).toFixed(2);
		//res.render('quizes/statistics', {pcount: nPreguntas,ccount:nComentarios,cPorP:CporP, errors:[]});
	});

	models.Comment.count({group:["QuizId"]}).then(function(result) {
    	pregConComent = result.length;
    	pregSinComent = nPreguntas - pregConComent;
    	res.render('quizes/statistics', {pcount: nPreguntas,ccount:nComentarios,cPorP:CporP,pregSinComent:pregSinComent,pregConComent:pregConComent, errors:[]});
  });




};