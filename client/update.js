const update = (data) => {
  if(!characters[data.hash]) {
    characters[data.hash] = data;
    return;
  }
  
  if(data.hash === hash) {
    return;
  }
  
  if(characters[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  const character = characters[data.hash];
  character.prevX = data.prevX;
  character.prevY = data.prevY;
  character.destX = data.destX;
  character.destY = data.destY;
  character.moveLeft = data.moveLeft;
  character.moveRight = data.moveRight;
  character.falling = data.falling;
  character.alpha = 0.05;
};

const removeUser = (data) => {
  if(characters[data.hash]) {
    delete characters[data.hash];
  }
};

const setUser = (data) => {
  hash = data.hash;
  characters[hash] = data;
  requestAnimationFrame(redraw);
};

const sendJump = () => {
  const character = characters[hash];
  
  const jump = {
    hash: hash,
    x: character.x,
    y: character.y,
    jumping: character.jumping,
  };
  
  socket.emit('jump', jump);
}

const updatePosition = () => {
  const character = characters[hash];
  
  character.prevX = character.x;
  character.prevY = character.y;
  
  if(character.moveLeft && character.destX > 0) {
    character.destX -= 5;
  }
  if(character.moveRight && character.destX < 400) {
    character.destX += 5;
  }

  character.alpha = 0.05;
  
  socket.emit('movementUpdate', character);
};
