const WIDTH = 740
const HEIGHT = 480

// Create the screen canvas and context
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

//Create the back buffer and context
var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

var start = null;
var curInput = {
  space: false,
  left: false,
  right: false
}
var priorInput = {
  space: false,
  left: false,
  right: false
}

var x = 0;
var y = 0;
var bullets = [];
var enemies =10;

function handleKeydown(event){
  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
      curInput.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      curInput.right = true;
      break;
    case ' ':
      curInput.space = true;
      break;
    }
}

window.addEventListener('keydown', handleKeydown);

function handleKeyup(event){
  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
      curInput.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      curInput.right = false;
      break;
    case ' ':
      curInput.space = false;
      break;
    }
}

window.addEventListener('keyup', handleKeyup);

function Bullet(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}

Bullet.prototype.update = function(deltaT) {
  this.y -= deltaT * 0.5;
}

Bullet.prototype.render = function(context) {
  context.beginPath();
  context.fillStyle = 'yellow';
  context.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  context.fill();
}

function Enemy(){

}
