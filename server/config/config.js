/**
 * Config file...
 * Remember, process is global
 */
let dotenv = require('dotenv');
dotenv.config();

/**
 * Application port
 * Default port 3000
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Enviroment
 * Default 'dev'
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


/**
 * Token settings...
 * time-to-expire default 30 days [seconds]
 * secret-hash default
 */
process.env.JWT_TTE =  process.env.JWT_TTE || (60*60*24*30);
process.env.JWT_SH = process.env.JWT_SH || 'AsSIknasdliUjasfi87';

if ( process.env.NODE_ENV === 'dev') {
    console.log( "\n\n\n*****************************************");
    console.log("In on Docker console:");
    console.log("docker exec -it node_app_node_1 sh --color=auto");
    console.log("\nExit Docker console:");
    console.log("docker exec -it node_app_node_1 sh --color=auto");
    console.log( "\n\n\n*****************************************");
    console.log( "ENVIROMENT");
    console.log( process.env);
    console.log( "*****************************************\n\n\n");
}