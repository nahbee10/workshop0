// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker;
var w = 640, h = 480;

// 내가 올릴 이미지들의 변수이름 입니다. 
var kitten;

//눈코입 위에 올릴 이미지를 불러옵니다. 
//img폴더에 원하는 이미지를 넣고 
//png 이미지라면, loadImage("img/이미지이름.png");
//jpg 이미지라면,loadImage("img/이미지이름.jpg");
//로 바꿔주세요!

var rad ;
function preload() {
  
  kitten = loadImage("img/kitten.png");
}

function drawHeart(xpos, ypos){
  noStroke();
  fill('red');
  triangle(xpos, ypos+30-1, xpos+20, ypos-1, xpos-20, ypos-1);
  arc(xpos+10-0.3, ypos, 20, 30, -PI, 0);
  arc(xpos-10+0.3, ypos, 20, 30, -PI, 0);
}

function setup() {

  //웹캠을 불러옵니다.

  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  
  colorMode(HSB);

  //얼굴인식을 위한 모델을 불러옵니다. 
  
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);
  rad = 1;
}

function draw() {

  // 웹캠을 캔버스에 그립니다. 

  imageMode(CORNER);
  image(capture, 0, 0, w, h);

  // 인식된 얼굴의 각 부분 좌표값을 positions에 저장합니다. 
  var positions = tracker.getCurrentPosition();
  imageMode(CENTER);
  if(positions.length>0){
    rad = ((positions[13][0] - positions[62][0])+(positions[62][0] - positions[1][0]))/2;
    
    
    //얼굴
    noStroke();
    fill(39, 78, 89);
    ellipse(positions[62][0], positions[62][1]-40, 3*rad, 3*rad);
    //귀
    ellipse(positions[62][0]-rad, positions[0][1]-rad*0.9, rad, rad);
    ellipse(positions[62][0]+rad, positions[14][1]-rad*0.9, rad, rad);
    
    stroke(0);
    //눈
    fill(0);
    ellipse(positions[27][0]-10, positions[27][1], rad/5, rad/5);
    ellipse(positions[32][0]+10, positions[32][1], rad/5, rad/5);
    //눈썹
    strokeWeight(rad/10);
    line(positions[15][0], positions[15][1], positions[18][0], positions[18][1]);
    line(positions[19][0], positions[19][1], positions[22][0], positions[22][1]);
    strokeWeight(1);
    noStroke();
    //수염..?
    ellipse(positions[62][0]-rad/5, positions[42][1], rad/2, rad/2-2);
    ellipse(positions[62][0]+rad/5, positions[43][1], rad/2, rad/2-2);
    fill(255);
    ellipse(positions[62][0]-rad/5, positions[42][1], rad/2-8, rad/2-10);
    ellipse(positions[62][0]+rad/5, positions[43][1], rad/2-8, rad/2-10);
    //코
    fill(0);
    ellipse(positions[62][0], positions[62][1]-8, rad/4, rad/4+2);
    
    /*
    image(kitten, positions[33][0], positions[21][1]*0.7, 80, 50);
    drawHeart(positions[27][0], positions[27][1]);
    drawHeart(positions[32][0], positions[32][1]);
    */
  }


}
