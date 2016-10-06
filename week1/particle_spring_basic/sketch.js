// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Reference to physics world

// edited by NAHEE KIM
var physics;

var particles = [];
var attractor;

var w = 640;
var h = 360;

function setup() {
  createCanvas(w-40,h-40);

  physics=new VerletPhysics2D();
  physics.setDrag (0.01);


  for (var i = 0; i < w/40; i++){
    for (var j = 0; j < h/40; j++) {
      particles.push(new Particle(new Vec2D(i*40,j*40)));
      particles[particles.length-1].lock();
    }
  }

  var pp= 0;

  for (var x = 0; x < w/40; x++){
    for (var y = 0; y < h/40; y++) {
      particles.push(new Particle(new Vec2D(x*40,y*40)));
      physics.addSpring(new VerletSpring2D(particles[pp], particles[w*h/1600+pp], 0, 0.01));
      pp++;
    }
  }

  attractor = new Particle(new Vec2D(mouseX,mouseY),70,150,-5);


}

function draw() {

  // Update the physics world
  physics.update();

  background(51);

  //attractor.display();

  // 각 파티클 보여주기
  for (var i = w*h/1600; i < w*h/800; i++) {
    particles[i].display();
  }

  //버티컬 만들기?
  /*
  var counter = 0;

  for (var x = 0; x < w/40; x++){
    beginShape();
    for (var y = 0; y < h/40; y++) {
      vertex(particles[w*h/1600+counter].x, particles[w*h/1600+counter].y);
      counter++;
    }
    endShape();
  }
  */
  attractor.set(mouseX,mouseY);

}
