var config = {};

// server details
config.server = {};
config.server.port=3700;

// database details
config.db = {};

config.db.port=27017; 
config.db.type = 'mongodb';
config.db.charset = 'utf8'; 
config.db.username = 'ankush';
config.db.password = 'ankush';
config.db.host = 'localhost';
config.db.dbname = 'EmployeeDB'; // DB name
config.db.testdbname = 'EmployeeDB';
 
config.db.employee = 'Employee'; // collection name name


// export
module.exports = config;