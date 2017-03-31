const Message = require('./messages/Message.js');

let charList = {};
const jumps = [];

const checkJumps = () => {
  if (jumps.length > 0) {
    const keys = Object.keys(charList);
    const characters = charList;

    for (let i = 0; i < jumps.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        const char1 = characters[keys[j]];

        const jump = char1.jumping;

        if (char1.y > 75) {
          char1.jumping = false;
          char1.falling = true;
        }
        if (jump) {
          char1.y += 5;
          process.send(new Message('jumping', char1));
        }
      }

      jumps.splice(i);
      i--;
    }
  }
};

const checkFalling = () => {
  const keys = Object.keys(charList);
  const characters = charList;

  for (let i = 0; i < keys.length; i++) {
    const char1 = characters[keys[i]];

    if (char1.falling) {
      char1.destY += 5;
    }

    process.send(new Message('falling', char1));
  }
};

setInterval(() => {
  checkJumps();
  checkFalling();
}, 20);

process.on('message', (messageObject) => {
  switch (messageObject.type) {
    case 'charList': {
      charList = messageObject.data;
      break;
    }
    case 'char': {
      const character = messageObject.data;
      charList[character.hash] = character;
      break;
    }
    case 'jump': {
      jumps.push(messageObject.data);
      break;
    }
    case 'falling': {
      break;
    }
    default: {
      console.log('Type not recognized');
    }
  }
});
