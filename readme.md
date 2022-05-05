PASOS PARA CORRER EL PROYECTO LOCALMENTE:
    1 - CLONAR EL REPOSITORIO
    2 - INSTALAR LAS DEPENDENCIAS DEL PROYECTO CON NPM
    3 - IMPORTAR LA BASE DE DATOS Y AGREGAR LAS CREDENCIALES DE SU MYSQL LOCAL
    4 - EJECUTAR  npm start  PARA CORRER EL PROYECTO
    5 - IR A localhost:8080

DOCUMENTACION DE LA REST API (RECOMIENDO TESTEARLA CON POSTMAN) 
    HEROKU : https://project-cambalache.herokuapp.com
    SE RECOMIENDA:
        1 - EMPEZAR CON EL ENDPOINT DE CREAR USUARIO NUEVO (LINEA 45 DE ESTE DOCUMENTO)

        2 - USAR EL ENDPOINT DE AUTH LOGIN QUE DEVUELVE EL JSONWEBTOKEN (LINEA 17 DE ESTE DOCUMENTO)

        3 - COPIAR EL TOKEN Y PEGARLO EN UN HEADER LLAMADO x-token 

        CREDENCIALES PARA CONECTARSE A LA BASE DE DATOS:
            host:'us-cdbr-east-05.cleardb.net'
            user:'b1ab3693220e6b'
            password:'dbad1e4f'
            database:'heroku_40673a1facac44b'




    ENDPOINTS :     
        '/api/auth'
            METODOS:
               EJEMPLO PETICION POST: 
                    RUTA '/api/auth/login' (DEVUELVE EL TOKEN)
                    {
                        "email":"example@mail.com",
                        "password:"123456"
                    } 
        '/api/repositories'
            METODOS:
                EJEMPLO PETICION POST: 
                    RUTA '/api/repositories' (TOKEN REQUERIDO)
                    {
                        "nombre_proyecto":"POO",
                        "lenguaje":"PHP",
                        "descripcion":"Programacion orientada a objetos con PHP"
                    }
                EJEMPLO PETICION PUT:
                    RUTA '/api/repositories/:id' (TOKEN REQUERIDO)
                    {
                        "nombre_proyecto":"POO",
                        "lenguaje":"PHP",
                        "descripcion":"Programacion orientada a objetos con PHP"
                    }
                EJEMPLO PETICION DELETE:
                    RUTA '/api/repositories/:id' (TOKEN REQUERIDO)
                EJEMPLOS GET: 
                    RUTA /api/repositories  (TODOS) (TOKEN REQUERIDO)
                         /api/repositories/:id  (UNO) (TOKEN REQUERIDO)
        '/api/users'  
             EJEMPLO PETICION POST: 
                    RUTA '/api/users' 
                    {
                        "nombre":"usuario",
                        "email":"usuario@mail.com",
                        "fecha_nacimiento":"1996-04-09",
                        "password":"123456"
                    }
                EJEMPLO PETICION PUT:
                    RUTA '/api/users/:id' (TOKEN REQUERIDO)
                    {
                        "nombre":"usuario",
                        "email":"usuario@mail.com",
                        "fecha_nacimiento":"1996-04-09",
                        "password":"123456"
                    }
                EJEMPLO PETICION DELETE:
                    RUTA '/api/users/:id' (TOKEN REQUERIDO)
                EJEMPLOS GET: 
                    RUTA /api/users  (TODOS) (TOKEN REQUERIDO)
                         /api/users/:id  (UNO) (TOKEN REQUERIDO)              
        '/api/records'
            EJEMPLO PETICION POST: 
                    RUTA '/api/records'  (TOKEN REQUERIDO)
                    {
                        "tipo":"admin",    
                        "usuarios_id_usuario":"24" (id referencial al usuario que se logeo)
                    }
                EJEMPLO PETICION PUT:
                    RUTA '/api/records/:id' (TOKEN REQUERIDO)
                    {
                       "tipo":"admin",            
                    }
                EJEMPLO PETICION DELETE:
                    RUTA '/api/records/:id' (TOKEN REQUERIDO)
                EJEMPLOS GET: 
                    RUTA /api/records  (TODOS) (TOKEN REQUERIDO)
                         /api/records/:id  (UNO) (TOKEN REQUERIDO)
