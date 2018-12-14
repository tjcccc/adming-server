const dbConfig = {

  // MySQL
  mysql: {
    host: 'localhost',
    port: 3306,
    user: '',
    password: '',
    database: 'adming'
  },

  // MongoDB
  mongodb: {
    host: 'localhost:27017',
    user: '',
    password: '!',
    database: 'adming'
  },

  // PostgreSQL
  pgsql: {
    host: 'localhost:5432',
    user: '',
    password: '!',
    database: 'adming'
  }
}

module.exports = dbConfig;
