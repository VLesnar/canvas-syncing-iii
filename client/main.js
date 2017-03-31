let canvas;
let ctx;
let avatar;
let socket;
let hash;

let characters = {};

const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const character = characters[hash];
  
  // A or LEFT
  if(keyPressed === 65 || keyPressed === 37) {
    character.moveLeft = true;
  }
  // D or RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    character.moveRight = true;
  }  
};

const keyUpHandler = (e) => {
  var keyPressed = e.which;
  const character = characters[hash];
  
  // A or LEFT
  if(keyPressed === 65 || keyPressed === 37) {
    character.moveLeft = false;
  }
  // D or RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    character.moveRight = false;
  }
  // SPACEBAR
  if(keyPressed === 32) {
    character.jumping = true;
    sendJump();
  }
};

// Handle character movement with mouse
const mouseMoveHandler = (e) => {
  var x = e.pageX - canvas.offsetLeft;  // Get mouse x position
  const character = characters[hash];
  
  // If the mouse is to the left of the character
  if(x < character.x + 50) {
    character.moveLeft = true;
    character.moveRight = false;
  }
  // If the mouse is to the right of the character
  else if (x > character.x + 50){
    character.moveRight = true;
    character.moveLeft = false;
  }
};

const mouseLeaveHandler = (e) => {
  const character = characters[hash];
  
  character.moveLeft = false;
  character.moveRight = false;
};

const init = () => {
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