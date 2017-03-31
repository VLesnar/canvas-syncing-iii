const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

const redraw = (time) => {
  updatePosition();
  
  ctx.clearRect(0, 0, 500, 500);
  
  const keys = Object.keys(characters);
  
  for(let i = 0; i < keys.length; i++) {
    const character = characters[keys[i]];
    
    if(character.alpha < 1) {
      character.alpha += 0.05;
    }
    
    if(character.hash === hash) {
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