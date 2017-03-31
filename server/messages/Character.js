class Character {
  constructor(hash) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = 200;
    this.y = 0;
    this.prevX = 200;
    this.prevY = 0;
    this.destX = 200;
    this.destY = 0;
    this.alpha = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.falling = true;
    this.jumping = false;
  }
}

module.exports = Character;
