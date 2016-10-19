// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Child class constructor
function Particle(position, radius, range, strength) {
  VerletParticle2D.call(this, position);
  this.r = radius;
  physics.addParticle(this);

  this.behavior = new AttractionBehavior(this, range, strength);

  physics.addBehavior(this.behavior);



  // Override the display method
  this.display = function() {
    colorMode(RGB)

    fill(0,0,255);
    stroke(200);
    strokeWeight(0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

// Inherit from the parent class
Particle.prototype = Object.create(VerletParticle2D.prototype);
Particle.prototype.constructor = Particle;