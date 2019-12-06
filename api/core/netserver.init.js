'use strict';

// const streamingMapsApp = require('express')();
// const streamingServer = require('http').Server(streamingMapsApp);

const net = require('net');
const GPS = require('gps');
const log = require('log-to-file');
const mongoose = require('mongoose');

const io = require('socket.io')(process.env.ws);

const config = require('../config');

const HOST = config.HOST;
const PORT_USED = process.env.net;
const watcher = require('./libs/referenceDevice')(PORT_USED);

mongoose.connect(config.db, {
  useCreateIndex: true,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

const gps = new GPS();

gps.state.bearing = 0;
var prev = {
  lat: null,
  lon: null
};

io.on('connection', function (socket) {
  console.log('GPSs Transmitiendo...');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// Manejar conexiones entrantes de clientes
io.sockets.on('connection', function (socket) {
  // Una vez que un cliente se ha conectado, esperamos
  // recibir un ping de él que diga a qué room desea unirse
  socket.on('room', function (room) {
    console.log(room);
    socket.join(room);
  });
});

function streamDevice ({ sentence = false, link = false }) {
  gps.on('data', function (parsed) {
    if (prev.lat !== null && prev.lon !== null) {
      gps.state.bearing = GPS.Heading(prev.lat, prev.lon, gps.state.lat, gps.state.lon);
    }
    prev.lat = gps.state.lat;
    prev.lon = gps.state.lon;
    console.log(sentence)
    if (sentence && link) {
      console.log(link);
      io
        .to(link.meta.belong_to)
        .emit('SOCKET_DEVICE_POSITION', {
          link,
          state: gps.state
        });
      // io.emit('SOCKET_DEVICE_POSITION', { link, state: gps.state });
      // link.sentences.push(sentence);
      // link.save();
    }
  });

  gps.update(sentence);
}

// eslint-disable-next-line no-unexpected-multiline
// Crea el servidor TCP
const server = net
  .createServer()
  .listen({ host: HOST, port: PORT_USED, exclusive: true });

server.maxConnections = config.maxConnectionNetPort;

// Emitido cuando e(l servidor se cierra ...
// no se emite hasta que todas las conexiones se cierran.
server.on('close', () => {
  console.log('server cerrado!');
  // process.send('shutdown');
  // process.kill(process.pid, 'SIGINT');
});

server.on('connection', socket => {
  // eslint-disable-next-line no-unused-expressions
  typeof (socket);

  // Esta propiedad muestra el número de caracteres actualmente almacenados en búfer.
  // El número de caracteres es aproximadamente igual al número de bytes que se escribirán, pero el búfer puede contener cadenas, y las cadenas están codificadas de forma perezosa, por lo que no se conoce el número exacto de bytes).
  // Los usuarios que experimentan bufferSize grande o en crecimiento deben intentar "regular" los flujos de datos en su programa con pause() y resume().
  // console.log('------------------------------------------');
  // console.log('Tamaño del Buffer : ' + socket.bufferSize);

  // console.log('------------- Server detalles ------------');

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  // console.log('Server está escuchando en el puerto: ' + port);
  // console.log('Server IP :' + ipaddr);
  // console.log('Server es IP4/IP6 : ' + family);

  var lport = socket.localPort;
  var laddr = socket.localAddress;
  // console.log('Server está escuchando en el puerto local: ' + lport);
  // console.log('Server LOCAL IP :' + laddr);

  // console.log('------------ Cliente Remoto Info ---------');

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  // console.log('Socket REMOTO está escuchando en el puerto: ' + rport);
  // console.log('Socket REMOTO IP :' + raddr);
  // console.log('Socket REMOTO es IP4/IP6 : ' + rfamily);

  // console.log('------------------------------------------');

  // var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections((_error, count) => {
    console.log('Número de conexiones concurrentes al servidor. : ' + count);
  });

  socket.setEncoding('utf8');

  socket.setTimeout(8000, () => {
    // llamado después del tiempo de espera -> igual que socket.on ('timeout')
    // Simplemente le dice a socket que se agotó el tiempo => es su trabajo para finalizar o destruir el socket.
    // socket.end () vs socket.destroy () => end nos permite enviar datos finales y permite que alguna actividad de i / o termine antes de destruir el socket
    // mientras que destroy destruye el socket inmediatamente, independientemente de si se está ejecutando alguna operación de E / S o no ... se produce la destrucción de fuerza
    console.log('Socket tiempo agotado!');
  });

  socket.on('data', data => {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    // console.log('Bytes leidos(Recibidos) : ' + bread);
    // console.log('Bytes escritos(Enviados) : ' + bwrite);
    // console.log('Dato enviado a Server : ' + data);

    // Echo data
    var isKernelBufferFull = socket.write('Data ::' + data);
    if (isKernelBufferFull) {
      // console.log('Los datos se eliminaron correctamente del búfer del kernel, es decir, se escribieron correctamente.');
      watcher(data)
        .then(streamDevice)
        .catch(error => {
          log(error, 'streamError.log');
        });
    } else {
      socket.pause();
    }
  });

  socket.on('drain', () => {
    console.log('El búfer de escritura está vacío ahora puede reanudar la secuencia de escritura');
    socket.resume();
  });

  socket.on('error', (error) => {
    console.log('Error : ' + error);
  });

  socket.on('timeout', () => {
    console.log('Socket tiempo agotado!');
    socket.end('Timed out!');
    // socket.destroy() destruye el socket.
  });

  socket.on('end', data => {
    console.log('Socket finalizado de otro extremo!');
    // console.log('Dato final : ' + data);
  });

  socket.on('close', error => {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    console.log('Bytes read : ' + bread);
    console.log('Bytes written : ' + bwrite);
    console.log('Socket cerrado!');
    if (error) {
      console.log('Socket fue cerrado por error de transmisión');
    }
  });

  /* setTimeout(function(){
    var isdestroyed = socket.destroyed;
    console.log('Socket destruido:' + isdestroyed);
    socket.destroy();
  }, 1200000); */
});

// Se emite cuando ocurre un error ->
// llama al evento cerrado inmediatamente después de esto.
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Configuracion TCP/IP en uso. ${HOST}: ${PORT_USED}!`);
  }
  // process.send('reboot');
});

// Se emite cuando el servidor está enlazado con server.listen
server.on('listening', () => {
  console.log(`Sub-Process ${process.pid}: (^_^) ¡El servidor NET está escuchando. ${HOST}: ${PORT_USED}!`);
  // process.send(`Hola desde ${process.pid}`);
  // Script Testing
  // const child = spawn('python', ["node.py"], { shell: true });
  // util.log('readingin')
  // child.stdout.on('data', function(chunk){
  //     var textChunk = chunk.toString('utf8'); // buffer to string
  //     util.log(textChunk);
  // });
});

// Es generado por el usuario presionando Ctrl+C y es una interrupcion.
// process.once('SIGINT', function (code) {
//   console.log('SIGINT received...');
//   server.close();
// });
// process.once('SIGKILL', function (code) {
//   console.log('SIGKILL received...');
//   server.close();
// });
// setTimeout(function () {
//   server.close();
// }, 6000);
