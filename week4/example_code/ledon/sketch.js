var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Blink LED 
var led;

var check, check_b;

function setup() {
  led = b.pin(9, 'LED');
  createCanvas(640, 480);
  check = false;
  check_b = false;
}

function draw(){

  background(255);

  textSize(18);

  var text1 = "on";
  var text2 = "off";
  var text3 = "blink";
  var text4 = "stop";

  var t1_w = textWidth(text1);
  var t2_w = textWidth(text2);
  var t3_w = textWidth(text3);
  var t4_w = textWidth(text4);
  
  if(check){
    fill(255,0,0);
    led.on();
  }else{
    fill(140);
    led.off();
  }

  ellipse(width/2, height/2-80, 50, 50);

  if(check_b){
    fill(255,0,0);
    led.on();
    led.blink();
  }else{
    fill(140);
    led.noBlink();
  }

  ellipse(width/2, height/2+80, 50, 50);

  fill(255);

  if(check){
    text(text1, width/2 - t1_w/2, height/2-75);
  }else{
    text(text2, width/2 - t2_w/2, height/2-75);
  }

  if(check_b){
    text(text3, width/2 - t3_w/2, height/2+85);
  }else{
    text(text4, width/2 - t4_w/2, height/2+85);
  }
  
}

function mousePressed(){
  if(dist(mouseX,mouseY,width/2,height/2-80)<50){
    check = !check;
  }else if(dist(mouseX,mouseY,width/2,height/2+80)<50){
    check_b = !check_b;
  }
}
