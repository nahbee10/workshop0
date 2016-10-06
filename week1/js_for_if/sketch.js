// p5.js for if example

// by NAHEE KIM

var w = 1000;
var h = 640;

var cir_num = 50;
var min_r = 40;
var max_r = 100;

var x_arr = [];
var y_arr = [];
var r_arr = [];
var c_arr = [];

function setup() {
  createCanvas(w, h);

  for (var i = 0; i < cir_num ; i++) {
    var x = random(max_r,w-max_r);
    var y = random(max_r,h-max_r);
    var r = random(min_r,max_r);
    var c = random();

    x_arr.push(x);
    y_arr.push(y);
    r_arr.push(r);
    c_arr.push(c);

    colorMode(HSB,100);
    fill(c*100,100,100);
    ellipse(x,y,r,r);
  };


}

function draw() {

  colorMode(RGB);

  background(255,255,255);

  for (var i = 0; i < cir_num; i++) {
    if(dist(mouseX,mouseY,x_arr[i],y_arr[i])<r_arr[i]){
      background(0,0,0);
    }
  }

  colorMode(HSB,100);

  for (var i = 0; i < cir_num; i++) {

    fill(c_arr[i]*100,100,100);
    ellipse(x_arr[i],y_arr[i],r_arr[i],r_arr[i]);
  }

}
