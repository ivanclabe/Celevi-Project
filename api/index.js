/**
 * Gestiona el inicio de la APP.
 * @version 0.1
 * @author Ivanclabe
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */

// require Node
const cluster = require('cluster');
// const config = require('./config');

// require Projects
// const redisClient = require('./core/connect/redisdb');

// Constantes locales
const numCPUs = require('os').cpus().length;

(async function index () {
  console.log('(+_+) ¡Master!');
  // Starting time
  const start = Date.now();

  /**
   * Bloque Head Process: Inicia las acciones standalone de la app.
   */
  // cluster.setupMaster({ exec: 'core/backwork.init.js' });
  // var worker = cluster.fork();
  // worker.send({
  //   msgFromMaster: `Mensaje desde el master ${process.pid} al worker ${worker.process.pid}`
  // });

  /**
   * Bloque Net Process: Inicia los servidores Net's, cantidad equivalentes
   * al numero nucleos (numCPUs) del host del projecto .
   */
  const connParams = [
    { net: 8007, ws: 3001},
    { net: 8006, ws: 3002},
    { net: 8005, ws: 3003}
  ];
  // config.netPorts.split(',') || process.env.NETPORTS.split(',');
  cluster.setupMaster({ exec: 'core/netserver.init.js' });
  for (var i = 0; i < 2; i++) {
    // eslint-disable-next-line no-redeclare
    var worker = cluster.fork({
      net: connParams[i].net,
      ws: connParams[i].ws
    });
    worker.send({
      msgFromMaster: `Mensaje desde el master ${process.pid} al worker ${worker.process.pid}`
    });
  }

  /**
   * Bloque Net Process: Inicia los servidores Net's, cantidad equivalentes
   * al numero nucleos (numCPUs) del host del projecto .
   */
  cluster.setupMaster({ exec: 'core/express.init.js' });
  for (var k = 0; k < 1; k++) {
    // eslint-disable-next-line no-redeclare
    var worker = cluster.fork();
    worker.send({
      msgFromMaster: `Mensaje desde el master ${process.pid} al worker ${worker.process.pid}`
    });
  };

  // Eventso configurados para todos los Workers (NET's y APPS)
  cluster.on('online', worker => console.log(`Worker ${worker.process.pid} esta online`));
  // Receive messages from this worker and handle them in the master process.
  cluster.on('message', (worker, msg) => {
    console.log(`Master ${process.pid} recibiendo mensaje desde worker ${worker.process.pid}`, msg);
  });
  cluster.on('disconnect', worker => console.log(`Worker ${worker.process.pid} ha sido desconectado`));
  cluster.on('exit', (worker, code, signal) => {
    console.log('worker %d muere (%s)...', worker.process.pid, signal || code);
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
    // Cuando el master no tiene más worker vivos.
    // imprime el tiempo transcurrido y luego muere
    if (Object.keys(cluster.workers).length === 0) {
      console.log('Cada worker ha terminado su trabajo.');
      console.log('Tiempo transcurrido: ' + (Date.now() - start) + 'ms');
      process.exit(0);
    }
  });
})();
