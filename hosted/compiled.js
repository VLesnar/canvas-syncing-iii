"use strict";

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

var redraw = function redraw(time) {
  updatePosition();

  ctx.clearRect(0, 0, 500, 500);

  var keys = Object.keys(characters);

  for (var i = 0; i < keys.length; i++) {
    var character = characters[keys[i]];

    if (character.alpha < 1) {
      character.alpha += 0.05;
    }

    if (character.hash === hash) {
      ctx.filter = "none";
    } else {
      ctx.filter = "hue-rotate(40deg)";
    }

    character.x = lerp(character.prevX, character.destX, character.alpha);
    character.y = lerp(character.prevY, character.destY, character.alpha);

    ctx.drawImage(avatar, character.x, character.y);
  }

  requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var avatar = void 0;
var socket = void 0;
var hash = void 0;

var characters = {};

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var character = characters[hash];

  // A or LEFT
  if (keyPressed === 65 || keyPressed === 37) {
    character.moveLeft = true;
  }
  // D or RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      character.moveRight = true;
    }
};

var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
  var character = characters[hash];

  // A or LEFT
  if (keyPressed === 65 || keyPressed === 37) {
    character.moveLeft = false;
  }
  // D or RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      character.moveRight = false;
    }
  // SPACEBAR
  if (keyPressed === 32) {
    character.jumping = true;
    sendJump();
  }
};

// Handle character movement with mouse
var mouseMoveHandler = function mouseMoveHandler(e) {
  var x = e.pageX - canvas.offsetLeft; // Get mouse x position
  var character = characters[hash];

  // If the mouse is to the left of the character
  if (x < character.x + 50) {
    character.moveLeft = true;
    character.moveRight = false;
  }
  // If the mouse is to the right of the character
  else if (x > character.x + 50) {
      character.moveRight = true;
      character.moveLeft = false;
    }
};

var mouseLeaveHandler = function mouseLeaveHandler(e) {
  var character = characters[hash];

  character.moveLeft = false;
  character.moveRight = false;
};

var init = function init() {
  avatar = document.querySelector('#avatar');

  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('jumping', update);
  socket.on('falling', update);
  socket.on('disconnect', removeUser);

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  canvas.addEventListener('mouseleave', mouseLeaveHandler);
};

window.onload = init;
'use strict';

var update = function update(data) {
  if (!characters[data.hash]) {
    characters[data.hash] = data;
    return;
  }

  if (data.hash === hash) {
    return;
  }

  if (characters[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  var character = characters[data.hash];
  character.prevX = data.prevX;
  character.prevY = data.prevY;
  character.destX = data.destX;
  character.destY = data.destY;
  character.moveLeft = data.moveLeft;
  character.moveRight = data.moveRight;
  character.falling = data.falling;
  character.alpha = 0.05;
};

var removeUser = function removeUser(data) {
  if (characters[data.hash]) {
    delete characters[data.hash];
  }
};

var setUser = function setUser(data) {
  hash = data.hash;
  characters[hash] = data;
  requestAnimationFrame(redraw);
};

var sendJump = function sendJump() {
  var character = characters[hash];

  var jump = {
    hash: hash,
    x: character.x,
    y: character.y,
    jumping: character.jumping
  };

  socket.emit('jump', jump);
};

var updatePosition = function updatePosition() {
  var character = characters[hash];

  character.prevX = character.x;
  character.prevY = character.y;

  if (character.moveLeft && character.destX > 0) {
    character.destX -= 5;
  }
  if (character.moveRight && character.destX < 400) {
    character.destX += 5;
  }

  character.alpha = 0.05;

  socket.emit('movementUpdate', character);
};
