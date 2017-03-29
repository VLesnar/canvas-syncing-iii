const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha + b1;
};

const redraw = (time) => {
  updatePosition();
  
  ctx.clearRect(0, 0, 500, 500);
  
  const keys = Object.keys(characters);
  
  for(let i = 0; i < keys.length; i++) {
    const character = characters[keys[i]];
    
    if(square.alpha < 1) {
      square.alpha += 0.05;
    }
    
    if(square.hash === hash) {
      ctx.filter = "none";
    } else {
      ctx.filter = "hue-rotate(40deg)";
    }
    
    character.x = lerp(character.prevX, square.destX, character.alpha);
    character.y = lerp(character.prevY, character.destY, character.alpha);
    
    ctx.drawImage(avatar, character.x, character.y);
  }
  
  requestAnimationFrame(redraw);
};