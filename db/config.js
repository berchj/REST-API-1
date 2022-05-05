const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'',
    user:'',
    password:'',
    database:'',
    connectionLimit:10,
    connectTimeout:10,
    multipleStatements:true,
    enableKeepAlive:true
})
module.exports = pool