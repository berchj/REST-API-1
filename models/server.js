require('dotenv').config()
const express = require('express')
const cors = require('cors')
//class with methods and properties to run the server
class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        //paths
        this.repositoriesPath = '/api/repositories'
        this.usersPath = '/api/users'        
        this.authPath = '/api/auth'
        this.recordsPath = '/api/records'
        //middlewares
        this.middlewares()
        //routes
        this.routes()        
    }    
    middlewares() {
        //public dir
        this.app.use(express.static('public'))
        //cors
        this.app.use(cors())
        //json body
        this.app.use(express.json())
    }
    routes() {
       //users routes
       this.app.use(this.usersPath,require('../routes/users'))
       //auth routes
       this.app.use(this.authPath,require('../routes/auth'))
       //records routes
       this.app.use(this.recordsPath,require('../routes/records'))
       //repositories routes
       this.app.use(this.repositoriesPath,require('../routes/repositories'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`server running on port ${this.port}`)
        })
    }

}
module.exports = Server