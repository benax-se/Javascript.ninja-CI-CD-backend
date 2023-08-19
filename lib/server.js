#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const pino = require('pino')();
const app = require('./app');
const config = require('../config');

// Get port from environment and store in Express.
const port = config.get('port');
app.set('port', port);

// Create HTTP server.
let server;

// Listen on provided port, on all network interfaces.
const sock = path.resolve(__dirname, '..', 'tmp', 'pids', 'server.sock');

const createPidsDirectory = () => {
  const pidsDirPath = path.resolve(__dirname, '..', 'tmp', 'pids');

  try {
    fs.accessSync(pidsDirPath);
  } catch (e) {
    try {
      fs.mkdirSync(pidsDirPath, {recursive: true});
      console.log('Pids directory created');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
};

// Listen on provided port, on all network interfaces.
fs.stat(sock, function (err) {
  if (!err) {
    fs.unlinkSync(sock);
  }

  createPidsDirectory();

  server = http.createServer(app);
  server.listen(sock);

  server.on('error', onError);
  server.on('listening', onListening);
});

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = '';

  if (typeof port === 'string') {
    bind = `Pipe ${port}`;
  }

  if (typeof port === 'number') {
    bind = `Port ${port}`;
  }

  // Handle specific listen errors with friendly messages.
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  fs.chmodSync(sock, '777');

  pino.info(`Listening on ${sock}`);
}
