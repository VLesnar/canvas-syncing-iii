const xxh = require('xxhashjs');
const child = require('child_process');
const Character = require('./messages/Character.js');
const Message = require('./messages/Message.js');

const charList = {};

let io;

const physics = child.fork('./server/physics.js');

physics.on('message', (m) => {
  switch (m.type) {
    case 'falling': {
      io.sockets.in('room1').emit('falling', m.data);
      break;
    }
    case 'jumping': {
      io.sockets.in('room1').emit('jumping', m.data);
      break;
    }
    default: {
      console.log('Received unclear type from physics');
      break;
    }
  }
});

physics.on('error', (error) => {
  console.dir(error);
});

physics.on('close', (code, signal) => {
  console.log(`Child closed with ${code} ${signal}`);
});

physics.on('exit', (code, signal) => {
  console.log(`Child exited with ${code} ${signal}`);
});

physics.send(new Message('charList', charList));

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    charList[hash] = new Character(hash);

    socket.hash = hash;

    socket.emit('joined', charList[hash]);

    socket.on('movementUpdate', (data) => {
      charList[socket.hash] = data;
      charList[socket.hash].lastUpdate = new Date().getTime();

      physics.send(new Message('charList', charList));

      io.sockets.in('room1').emit('updatedMovement', charList[socket.hash]);
    });

    socket.on('falling', (data) => {
      physics.send(new Message('falling', data));
    });

    socket.on('jump', (data) => {
      const jump = data;
      physics.send(new Message('jump', jump));
    });

    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('disconnect', charList[socket.hash]);
      delete charList[socket.hash];
      physics.send(new Message('charList', charList));
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
