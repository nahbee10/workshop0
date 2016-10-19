// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker;
var w = 640, h = 480;

// 내가 올릴 이미지들의 변수이름 입니다. 


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
}

function draw() {

  // 웹캠을 캔버스에 그립니다. 
  imageMode(CORNER);
  image(capture, 0, 0, w, h);
  filter(GRAY);
  // 인식된 얼굴의 각 부분 좌표값을 positions에 저장합니다. 
  var positions = tracker.getCurrentPosition();

  imageMode(CENTER);
  if(positions.length>0){
    for(var i=0;i<positions.length;i++){
      fill(255-i,100-i,150-i,i*0.01);
      curve(mouseY,mouseX,positions[i][0],positions[i][1],positions[62][0],positions[62][1],mouseX,mouseY);
      ellipse(positions[i][0],positions[i][1],10,10);
      
      ellipse(positions[i][0],w-positions[i][0],20,10);
      ellipse(positions[70-i][1],positions[70-i][1],10,20);

    }      
    for(var x=15;x<23;x++){
      quad(positions[x][0],positions[x][1]-30,positions[x][0]-5,positions[x][1]-20,positions[x][0],positions[x][1]-10,positions[x][0]+5,positions[x][1]-20);
    }
  } 
  textSize(15);
  text("MOVE_YOUR_MOUSE", 10, 20);
  fill(0, 102, 153); 

}
