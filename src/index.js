const http = require('http');
const path = require('path');

const express = require ('express');
const socketio = require ('socket.io');

const mongoose = require ("mongoose");
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// db connection
mongoose.connect(process.env.MongoDBURL)
  .then(db => console.log('db is connected'))
  .catch(err => console.log(err));

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
server.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});
