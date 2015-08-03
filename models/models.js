//Define como se construye todo el modelo

var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user    = (url[2]||null);
var pwd     = (url[3]||null);
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{	dialect:  protocol,
		 protocol: protocol,
		 port:     port,
		 host:     host,
		 storage:  storage, //solo SQlite (.env)
		 omitNull: true	//solo Postgres
	}
);


// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar la definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz); //un comentario pertenece a una pregunta
Quiz.hasMany(Comment); //una pregunta puede tener muchos comentarios

exports.Quiz = Quiz; //exportar la definición de la tabla Quiz
exports.Comment = Comment; //exporta la definición de la tabla Comment;


//sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0){    //la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema: 'Geografía'
			});
			Quiz.create({ pregunta: 'Capital de Alemania',
						  respuesta: 'Berlín',
						  tema: 'Geografía'
			});		
			Quiz.create({ pregunta: 'Capital de España',
						  respuesta: 'Madrid',
						  tema: 'Geografía'
			});		
			Quiz.create({ pregunta: 'Capital de Francia',
						  respuesta: 'París',
						  tema: 'Geografía'
			});		
			Quiz.create({ pregunta: 'Avión supersónico de pasajeros',
						  respuesta: 'Concorde',
						  tema: 'Tecnología'
			});	

			Quiz.create({ pregunta: 'Fabricante de teléfono móvil Nexus 5',
						  respuesta: 'LG',
						  tema: 'Tecnología'
			});

			Quiz.create({ pregunta: 'Nº de planetas del sistema solar',
						  respuesta: '8',
						  tema: 'Ciencia'
			});

			Quiz.create({ pregunta: 'Luna principal de Plutón',
						  respuesta: 'Caronte',
						  tema: 'Ciencia'
			});

			Quiz.create({ pregunta: 'Temporadas emitidas de Juego de Tronos',
						  respuesta: '5',
						  tema: 'Otro'
			});			

			Quiz.create({ pregunta: 'Año de la primera constitución española',
						  respuesta: '1812',
						  tema: 'Otro'
			});	

			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema: 'Geografía'

			}).then(function(){console.log('Base de datos inicializada')});
		};
	});
});