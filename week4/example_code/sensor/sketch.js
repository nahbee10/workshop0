var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test analog read
var p = b.pin(0, 'ANALOG', 'INPUT');
var val_bg = 0;
p.read(function(val){console.log(val);val_bg=val;});

var bulb_img, bulb_img_mask;

function preload(){
	bulb_img = loadImage("img/bulb.png");
	bulb_img_mask = loadImage("img/bulb_m.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  imageMode(CENTER);
}

function draw(){
	//console.log(val_bg);
	//센서값(0-1024)을 이미지 투명도 범위(0-255)에 맞도록 값 조정하기
	var new_val_bg = map(val_bg, 200, 800, 30, 225);

	background(255);

	//전구_빛 이미지의 투명도 조정해서 빛이 점멸하는 효과 내기
	tint(255, new_val_bg);
	image(bulb_img_mask, width/2,height/2);

	tint(255, 255);
	image(bulb_img, width/2,height/2);
}