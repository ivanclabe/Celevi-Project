// Modules Watch
const watchTime = require('./helpers/time.watch');
console.log(`Iniciando proceso BackWork con ID: ${process.pid}`);
// Revisor de datos automatizados
watchTime.once('online', time => console.log(`WatchTime Online. ${time}`));
