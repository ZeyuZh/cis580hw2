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

var x = 330;
var y = 460;
var enemyX = Math.random() * 719;
var enemyY = 0;
var bullets = [];
var enemies = [];
var gameOver = false;
var timeInterval1 = 0;//time interval for enemies apper
var timeInterval2 = 0;//time interval for bullets
var enemiesBullets = [];
var score = 0;
var alive = 3;

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

function Enemy(x,y){
    this.x = x;
    this.y = y;
}

Bullet.prototype.update = function(deltaT) {
  this.y -= deltaT * 0.4;
}

Enemy.prototype.update = function(deltaT){
  this.y += deltaT * 0.01;
}

//Update Enemies' bullets
Bullet.prototype.enemyUpdate = function (deltaT){
    this.y += deltaT * 0.1;
}


Bullet.prototype.render = function(context) {
  context.beginPath();
  context.fillStyle = 'green';
  context.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  context.fill();
}

Enemy.prototype.render = function (context) {
    context.beginPath();
    context.fillStyle = "#00ffff";
    context.fillRect(this.x, this.y, 20, 20);
}

function render(elapsedTime, ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(x, y, 20, 20);
    bullets.forEach(function (bullet) {
        bullet.render(ctx);
    });
    enemies.forEach(function (enemy){
         enemy.render(ctx);
    });
    enemiesBullets.forEach(function (eBullet) {
        eBullet.render(ctx);
    });
    ctx.fillText("Alive: " + alive, WIDTH - 60, 10);
    ctx.fillText("Score: " + score, WIDTH - 60, 20);
    if(gameOver) ctx.fillText("Game Over!", WIDTH/2-20, HEIGHT/2);
}

function update(elapsedTime) {
    if(alive ==0) gameOver = true;
    if(gameOver) return;
    if (curInput.space && !priorInput.space) {
        bullets.push(new Bullet(x, y-11, 2));
    }
    if (curInput.left) {
        x -= 0.1 * elapsedTime;
    }
    if (curInput.right) {
        x += 0.1 * elapsedTime;
    }
    bullets.forEach(function (bullet, index) {
        bullet.update(elapsedTime);
        // check to see if bullet is off-screen
        if (bullet.y <= 0) {
          bullets.splice(index, 1);
        }
    });
    //maximum 10 enemies on screen and 1 second appear 1 enemies
    if(enemies.length < 10 && (start - timeInterval1) >= 1000) {
      enemies.push(new Enemy (enemyX, enemyY));
      enemyX = Math.random() * 719;
        timeInterval1 = start;
      console.log(enemies.length+ "\n");
    }
    enemyCollision();
    //update enemies
    enemies.forEach(function (enemy,index) {
      enemy.update(elapsedTime);
      var flag = (Math.random() * 5) +1;
      //Enemies randomly shoot bullets
      if((start - timeInterval2) >= flag * 1000) {
          enemiesBullets.push(new Bullet(enemy.x+10, enemy.y+11, 2));
          timeInterval2 = start;
      }
      //check for enemies to the end of screen
      if(enemy.y >= 460) gameOver = true;
    });

    //
    enemiesBullets.forEach(function (bul, index) {
        bul.enemyUpdate(elapsedTime);
        // check to see if bullet is off-screen
        if (bul.y >= 480) {
            enemiesBullets.splice(index, 1);
        }
        //check to see if enemies shoot players
        if(bul.x <= x+10 && bul.x >= x-10 && bul.y > 460) {
            alive -= 1;
            enemiesBullets.splice(index,1);
        }
    });

}


function enemyCollision(){
   bullets.forEach(function (bullet,index1) {
       enemies.forEach(function (enemy,index2) {
           if(bullet.x <= enemy.x+10 && bullet.x >= enemy.x-10 && bullet.y <= enemy.y+10 && bullet.y >= enemy.y-10)
           {
               score += 1;
               bullets.splice(index1,1);
               enemies.splice(index2,1);
           }
       })
   })
}



function loop(timestamp) {
    if(!start) start = timestamp;
    var elapsedTime = timestamp - start;
    start = timestamp;
    update(elapsedTime);
    render(elapsedTime, backBufferCtx);
    screenCtx.drawImage(backBuffer, 0, 0);
    copyInput();
    window.requestAnimationFrame(loop);
}

function copyInput() {
    priorInput = JSON.parse(JSON.stringify(curInput));
}

window.requestAnimationFrame(loop);
