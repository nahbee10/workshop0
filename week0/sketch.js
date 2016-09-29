// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker;
var w = 640, h = 480;

// 내가 올릴 이미지들의 변수이름 입니다. 
var img1, img2, img3;

//눈코입 위에 올릴 이미지를 불러옵니다. 
//img폴더에 원하는 이미지를 넣고 
//png 이미지라면, loadImage("img/이미지이름.png");
//jpg 이미지라면,loadImage("img/이미지이름.jpg");
//로 바꿔주세요!

function preload() {
  img1 = loadImage("img/eye.png");
  img2 = loadImage("img/nose.png");
  img3 = loadImage("img/mouse.png");
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
}

function draw() {

  // 웹캠을 캔버스에 그립니다. 

  imageMode(CORNER);
  image(capture, 0, 0, w, h);

  // 인식된 얼굴의 각 부분 좌표값을 positions에 저장합니다. 
  var positions = tracker.getCurrentPosition();

  imageMode(CENTER);
  if(positions.length>0){

    // 슬라이드를 참고하셔서 원하는 얼굴부위 의 번호를 파악한 다음
    // image(이미지변수이름, positions[얼굴부위번호][0], positions[얼굴부위번호][1], 이미지가로길이, 이미지세로길이);
    // 이미지변수이름에서는 상단 function preload()에서 지정해줬던 이미지변수 중(img1, img2, img3) 원하는 것을
    // 얼굴부위번호에는 수업 슬라이드를 참고하셔서 원하는 얼굴부위의 번호를 
    // 이미지가로길이, 이미지세로길이에는 원하는 이미지 가로, 세로 사이즈를 수치로 각각 올려주시면 됩니다. 
    
    // 여기서는 눈, 코, 입 중앙 기준으로 작성되어 있습니다. 
    // 눈(27번) 위에 눈에 해당하는 이미지를 올립니다.
    image(img1, positions[27][0], positions[27][1], 70, 70);
    image(img1, positions[32][0], positions[32][1], 70, 70);

    // 코(62번) 위에 눈에 해당하는 이미지를 올립니다.
    image(img2, positions[62][0], positions[62][1], 70, 70);

    // 입(57번) 위에 눈에 해당하는 이미지를 올립니다.
    image(img3, positions[57][0], positions[57][1], 70, 70);

  }

}
