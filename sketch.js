const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Render=Matter.Render;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
}

function setup() {
  canvas = createCanvas(windowWidth - 200, windowHeight - 150);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(width / 2 - 650, height - 290, 250, 580);
  cannon = new Cannon(width / 2 - 600, height / 2 - 220, 120, 40, angle);

 

  var render = Render.create({
	  element: document.body,
	  engine: engine,
	  options: {
	    width: 1600,
	    height: 700,
	    wireframes: false
	  }
	});

	Render.run(render);
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  showBoats();

  for (var i = 0; i < balls.length; i++) 
  {
    showCannonBalls(balls[i], i);

    for (var j = 0; j < boats.length; j++) 
    {
      if (balls[i] !== undefined && boats[j] !== undefined) 
      {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);

        if (collision.collided) 
        {
          boats[j].remove(j);

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
          
        }
      } 
    }
  }

  cannon.display();
  tower.display();
}



function keyPressed() 
{
  if (keyCode === DOWN_ARROW) 
  {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}


function showCannonBalls(ball, index) 
{
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50)
   {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}



function showBoats() 
{
  if (boats.length > 0) 
  {
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300) 
    {
      var positions = [-130, -100, -120, -80];
      var position = random(positions);
      var boat = new Boat(width,height-100, 200, 200, position);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) 
    {
      Matter.Body.setVelocity(boats[i].body, {x: -1,y: 0});
      boats[i].display();
    }
  } 
  else 
  {
    var boat = new Boat(width, height - 100, 200, 200, -100);
    boats.push(boat);
  }
}



function keyReleased() 
{
  if (keyCode === DOWN_ARROW) 
  {
    balls[balls.length - 1].shoot();
  }
}


