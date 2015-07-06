//definición cómo es la tabla Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
	{ pregunta:  DataTypes.STRING,
	  respuesta: DataTypes.STRING
	});
}