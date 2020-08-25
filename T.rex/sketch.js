var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;

var obstacle, obstacle1, obstacle2,obstacle3, obstacle4, obstacle5, obstacle6;

var newImage;

var score = 0, gameOver,gameOverImg, restart, restartImg;
var previousScore = 0;

var obstacleGroup, cloudGroup;

var PLAY = 1;
var END = 0;
var gameState = PLAY;


var jumpSound, checkPoint, trexDead;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadAnimation("gameOver.png");
  
  restartImg = loadAnimation("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  
  checkPoint = loadSound("checkPoint.mp3");
  
  trexDead = loadSound("die.mp3");
 
}

function setup() {
  createCanvas(600, 200);
  
  obstacleGroup = createGroup();
  cloudGroup = createGroup();

  trex = createSprite(50,160,20,50);
  // trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle", -5,0,45);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collided);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  console.log("Hello"+ 5)
  
  gameOver = createSprite(300,100,10,10);
  gameOver.addAnimation("gameOver", gameOverImg);
  gameOver.visible = false;
  
  restart = createSprite(300,150,10,10);
  restart.scale = 0.6;
  restart.addAnimation("restart", restartImg);
  restart.visible = false;
  
}

function draw() {
  background(180);
  text("Score: " + score, 500, 20);
  
  if (previousScore>= score){
    text("High Score: " +previousScore, 400, 20);
  }
  
  if (score === previousScore && previousScore>0){
   checkPoint.play(); 
  }
  
  trex.debug = true;
  console.log(gameState);
  
  if (gameState === PLAY){
    
     ground.velocityX = -(4+score*1.5/100);
    
    //spawn the clouds
    spawnClouds();
    
    obstacles();
    
    score = score + Math.round(getFrameRate()/60);

    if(keyDown("space")&&trex.y >= 150) {
      trex.velocityY = -13; 
       jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (obstacleGroup.isTouching(trex)){
      trexDead.play();
      gameState = END;
    
    }
    
      
    if (score%100 === 0 && score>0) {
       checkPoint.play();
    }
  }
  
  else if (gameState === END){
    ground.velocityX = 0;
    
    trex.velocityY = 0; 
    trex.scale = 0.5;
    trex.changeAnimation("collide",trex_collided);
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
    
    if (mousePressedOver(restart)){
      reset();
    }
  }
  
  
  trex.collide(invisibleGround);

  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,320,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    
    //assigning lifetime to the variable
    cloud.lifetime = 220;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud);
  }
}
  
  
function obstacles(){

  if (frameCount % 120 === 0) {
    var randomNum = round(random(1,6));
    obstacle = createSprite(600,158,20,20); 
    obstacle.velocityX = -(4+score*1.5/100);
    obstacle.scale = 0.6;
    switch(randomNum){ 
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    obstacle.lifetime = 220;
    obstacleGroup.add(obstacle);
    
  }

}

  function reset(){
    gameState = PLAY;
    cloudGroup.destroyEach();
    obstacleGroup.destroyEach();
    
    gameOver.visible = false;
    restart.visible = false;
    
    previousScore = score;
    
    score = 0;
    
    trex.changeAnimation("running", trex_running);
    
  }
  
  


