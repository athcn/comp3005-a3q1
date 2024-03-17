/* Using Postgres.js library from https://github.com/porsager/postgres */
const postgres = require('postgres');

/* Change these contents to reroute the postgres connection*/
const postgresUrl = {
  host                 : 'localhost',             // Postgres ip address[es] or domain name[s]
  port                 : 5432,                    // Postgres server port[s]
  database             : '',                      // Name of database to connect to
  username             : 'postgres',              // Username of database user
  password             : '',                      // Password of database user 
}


const sql = postgres(`postgres://${postgresUrl.username}:${postgresUrl.password}@${postgresUrl.host}:${postgresUrl.port}/${postgresUrl.database}`);

module.exports = sql;