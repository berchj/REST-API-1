const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'us-cdbr-east-05.cleardb.net',
    user:'b1ab3693220e6b', 
    password:'dbad1e4f',
    database:'heroku_40673a1facac44b',
    connectionLimit:10,
    connectTimeout:10,
    multipleStatements:true,
    enableKeepAlive:true
})
module.exports = pool