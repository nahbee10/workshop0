// The Nature of Code
// http://natureofcode.com

// Blob Example
// Example 5.13 adapted by Zach Lieberman

//edited by NAHEE KIM

var physics;
var blobs =[];
var repeler;
var w = 1200;
var h = 640;
var ctx2;




function setup() {
  createCanvas(w, h);
  var canvas = document.getElementById("canvas");
  //console.log(canvas);
  ctx2 = canvas.getContext("2d");

  // Initialize the physics
  physics = new VerletPhysics2D();
  physics.setDrag(0.03);

  //마우스에 반응하도록 마우스 위치에 repulsion 설정
  repeler = new Particle(new Vec2D(mouseX, mouseY), 100, 50, -4);

  //blob이 캔버스 외부로 나가지 않도록 bounds 설정
  physics.setWorldBounds(new Rect(0,0,w,h));

  //blob 추가하기
  //blobs.push(new Blob(반지름, 중심 x좌표, 중심 y좌표));
  //자바스크립트가 물리엔진을 계산하기에 충분히 빠르지가 않아서 3개 이상 추가하시면 움직임이 느려져요... 흑흑
  blobs.push(new Blob(180,w/2, 150));

  //blobs.push(new Blob(50,w/2+200,h/2));
  //blobs.push(new Blob(50,w/2-200,h/2));


}

function draw() {

  physics.update();

  repeler.set(mouseX,mouseY);

  //배경색 바꾸기
  background('rgba(100%,100%,100%,1)');

  //console.log(this.drawingContext);
  //blob 그리기
  //선 색 바꾸기 - stroke(red,green,blue,alpha);
  stroke(50,0,255,0);
  //blob 내부 색 바꾸기 - stroke(red,green,blue,alpha);
  fill(50,0,255,20);

  // seconds로 시간마다 살아있는 것처럼 움직이는 blob 만들기 - 스프링을 주기적으로(sin함수 사용) 늘이고 줄이고 해서
  seconds = millis() / 1000;
  text('nahee',100,100);
        for (var i = 0; i <blobs.length; i++) {
    blobs[i].drawblob(seconds);

    //particle들을 실제로 보고 싶다면 하단 주석 해제
    //blobs[i].showParticles();

    //spring을 실제로 보고 싶다면 하단 주석 해제
    //blobs[i].showSpring();
  };
  



}


//////////////////////////
//Blob 클래스 정의
//////////////////////////

function Blob(r,coX,coY){
  this.particles = [];

  this.particles_first_x = [];
  this.particles_first_y = [];

  this.springs = [];

  for (var i = 0; i < 50; i++) {

    //waterdrop 형태로 blob 을 둘러싸고 있는 점(particle) 배치하기
    //http://math.stackexchange.com/questions/51539/a-math-function-that-draws-water-droplet-shape
    //상단 주소의 공식을 사용했습니다.
    var x = 100*(1-Math.sin( Math.PI*2/50*i ))* Math.cos( Math.PI*2/50*i )+w/2;
    var y = -120*(Math.sin( Math.PI*2/50*i )-1)+150;

    //거리계산을 위해서 초기x,y좌표 particles_first_x와 particles_first_y저장해두기
    this.particles_first_x.push(x);
    this.particles_first_y.push(y);

    //Particle(particle의 초기 좌표, 반지름, 영향 범위, attraction 정도);
    this.particles.push(new Particle(new Vec2D(x, y), 4, 80, -0.1));
    
  }

  //blob을 한 점에 고정하기 위한 attractor배치
  this.attractor = new Particle(new Vec2D(w/2, 150), r, r, 0.01);
  //하단 주석을 해제하시면 blob이 고정되게 할 수 있습니다.
  //this.attractor.lock();

  //blob의 shape을 유지하기 위해 3단계의 spring배치
  //VerletSpring2D(spring 의 한 쪽 끝, spring의 다른 쪽 끝, spring의 초기 길이, spring의 탄성);
  for (var i = 0; i < 50; i++) {
    //스프링 정의하기
    //(x1,y1),(x2,y2) 거리계산 함수 'Math.hypot(x2-x1,y2-y1)'
    //바로 옆에 있는 particle끼리 거리 계산해서 스프링 만들기
    var spring1 = new VerletSpring2D(this.particles[i], this.particles[(i + 1) % this.particles.length], Math.hypot(this.particles_first_x[i]-this.particles_first_x[(i + 1) % this.particles.length],this.particles_first_y[i]-this.particles_first_y[(i + 1) % this.particles.length]), 0.4);
    this.springs.push(spring1);
    //물리세계(physics)에 넣기
    physics.addSpring(spring1);
    if (i % 2 == 0) {
      //마주보고 있는 particle끼리 거리 계산해서 스프링 만들기
      var spring2 = new VerletSpring2D(this.particles[i], this.particles[(i + 25) % this.particles.length], Math.hypot(this.particles_first_x[i]-this.particles_first_x[(i + 25) % this.particles.length],this.particles_first_y[i]-this.particles_first_y[(i + 25) % this.particles.length]), 0.0001);
      this.springs.push(spring2);
      physics.addSpring(spring2);
    }
  if (i % 1 == 0) {
    //attractor(끌어당기는 점)과 거리 계산해서 스프링 만들기
    var spring2 = new VerletSpring2D(this.particles[i], this.attractor, Math.hypot(this.particles_first_x[i]-w/2,this.particles_first_y[i]-200), 0.001);
    this.springs.push(spring2);
    physics.addSpring(spring2);
  }

  }

}

Blob.prototype = {
  drawblob: function(s){

      /*beginShape();
      for (var i = 0; i < this.particles.length; i++) {
        vertex(this.particles[i].x, this.particles[i].y);
        this.particles[i].behavior.radius = 130 + 40 * sin(s + i / 30.0);
        this.particles[i].behavior.radiusSquared = this.particles[i].behavior.radius * this.particles[i].behavior.radius;
      }
      endShape(CLOSE);*/



   ctx2.beginPath();
   /*ctx2.moveTo(10, 100);
   ctx2.bezierCurveTo(130, 100, 130, 150, 230, 150);
    ctx2.bezierCurveTo(250, 180, 320, 180, 340, 150);
    ctx2.bezierCurveTo(420, 150, 420, 120, 390, 100);*/
   for (var i = 0; i < this.particles.length; i++) {

        ctx2.lineTo((this.particles[i].x)*2-500, (this.particles[i].y)+100);
        //console.log(this.particles[i].x);
      }


        ctx2.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx2.stroke();
        ctx2.clip();



        var img = new Image();
        img.src = "http://www.gcc.edu/_layouts/GCC/Backgrounds/1024.jpg";
        //img.onload = function () {
            ctx2.drawImage(img, 0, 0, 1000, 1000);

        //}
        ctx2.restore();

           ctx2.beginPath();
   /*ctx2.moveTo(10, 100);
   ctx2.bezierCurveTo(130, 100, 130, 150, 230, 150);
    ctx2.bezierCurveTo(250, 180, 320, 180, 340, 150);
    ctx2.bezierCurveTo(420, 150, 420, 120, 390, 100);*/
   for (var i = 0; i < this.particles.length; i++) {

        ctx2.lineTo((this.particles[i].x)*2-500, (this.particles[i].y)+100);
        //console.log(this.particles[i].x);
      }


        ctx2.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx2.stroke();
        ctx2.clip();



        var img2 = new Image();
        img2.src = "http://www.gcc.edu/_layouts/GCC/Backgrounds/1024.jpg";
        //img.onload = function () {

            ctx2.drawImage(img2, 400, 0, 1000, 1000);
        //}
        ctx2.restore();



  },

  showSpring: function(){
    for (var i = 0; i < this.springs.length; i++) {
      stroke(0,255,0);
      strokeWeight(1);
      line(this.springs[i].a.x, this.springs[i].a.y, this.springs[i].b.x, this.springs[i].b.y);
    }
  },

  showParticles: function(){
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }
}

