//===========================    
//----------PUERTO-----------
//===========================

process.env.PORT = process.env.PORT || 3000;

//===========================    
//----------ENTORNO----------
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//===========================    
//-------Token Expires-------
//===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDA_TOKEN = 60 * 60 * 24 * 30;


//===========================    
//--------Token seed---------
//===========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


//===========================    
//--------BaseDatos----------
//===========================

let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===========================    
//-----Google client id------
//===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1065752748065-ei3e0h80f3bdb523hgvk7t65plc99avu.apps.googleusercontent.com'