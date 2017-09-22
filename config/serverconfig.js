//local files
var config = require('./config');

var env=process.env.NODE_ENV||'devlopment';
console.log("ENV**************",env);

if(env==='devlopment'){  
    process.env.MONGODB_URI=`${config.db.type}://${config.db.host}:${config.db.port}/${config.db.dbname}`;
}else if(env==='test'){    
  process.env.MONGODB_URI=`${config.db.type}://${config.db.host}:${config.db.port}/${config.db.testdbname}`;
}

// export
module.exports = config;