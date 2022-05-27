import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { dbCreateConnection } from './orm/dbCreateConnection';
import rolesRouter from './routes/roles.routes';
import usersRouter from './routes/users.routes';
import orderRouter from './routes/order.routes';
import authRouter from './routes/auth.routes';
import dashboardRouter from './routes/dashboard.routes'
import { createData } from './orm/database/seed';

const router: Express = express();

// Call midlewares
router.use(cors());
router.use(helmet());
router.use(bodyParser.json());

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});

// 
// Routes
router.use('/', rolesRouter);
router.use('/', usersRouter); 
router.use('/', orderRouter);
router.use('/', authRouter);
router.use('/', dashboardRouter)

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

//
// Database connection
(async () => {
    await dbCreateConnection.initialize()
      .then(() => {
        console.log(`Database connection success. Database: '${dbCreateConnection.options.database}'`);
        createData().then(() => {
            console.log('Seeding completed');
        });
        // }).catch(error => {
        //     if (error.code == 11000) {
        //         console.log('Data already exists, So seeding not needed');
        //     } else {
        //         console.log('Error while seeding the data to mongo', error);
        //     }
        // });
        
      })
      .catch((err: any) => {
        console.error("Error during Data Source initialization:", err)
      });
})();

// /** Server */
// const httpServer = http.createServer(router);
// const PORT: any = process.env.PORT ?? 6060;
// httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

var port = normalizePort(process.env.PORT || '5000');
router.set('port', port);

var server = http.createServer(router);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val: any) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}
  
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any; }) {
if (error.syscall !== 'listen') {
    throw error;
}

var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

// handle specific listen errors with friendly messages
switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + 5000;
    console.debug('Listening on ' + bind);
}
