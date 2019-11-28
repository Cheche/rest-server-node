/**
 * Config file...
 * Remember, process is global
 */

 
/**
 * Application port
 * Default port 3000
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Enviroment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * DataBase Mongo 
 * urlDB has the connection string for mongodb. 
 * 
 * Warning: It has user and password...
 */
let urlDB = '';
// check enviroment
if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://node_db_mongo_1:27017/cafe';
} else {
    urlDB = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-r2jiv.mongodb.net/cafe`
}

process.env.URLDB = urlDB;  //set url connection

