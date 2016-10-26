//wekinator X p5.js - mouse example 입니다.
//마우스로 드래그해서 그린 형체를 컴퓨터에게 학습시킵니다.

//mouse x,y좌표가 들어가므로 
//초기 wekinator 프로젝트 설정에서 input 갯수를 2개로 해주셔야 합니다.
//또한 그림을 그리는 동안 시간축이 관여하게 되므로
//outputs - Type 에서 "All Dynamic Time Warping" 옵션을 선택해 주셔야 합니다.
//"All Dynamic Time Warping"을 선택했을 때 하단에 뜨게되는
//"with 빈칸 gesture types"
//에서 '빈칸'에는 내가 원하는 서로 다른 형체의 갯수
//예) 나는 세모 네모 동그라미를 학습시킬래 -> 3
//예) 나는 'ㄱ','ㄴ','ㄷ','ㄹ'을 학습시킬래 -> 4
//를 넣어주셔야 합니다. (최대 9개까지 가능합니다.)

//숫자키를 눌러보시면 상단 왼쪽 텍스트의 숫자가 바뀌는 것을 보실 수 있습니다.
//다른 모양을 그리실 때는 다른 숫자키를 누르고(키보드로!) 캔버스에 드래그해서 그려주세요.
//섞이면 나중에 예측결과가 잘 나오지 않습니다.
//예) 세모-1 , 네모-2 , 동그라미-3

//각 모양에 대한 데이터 입력이 끝났으면 's'키를 누르고 예측을 시작하시면 됩니다.
//예측을 시작하면, 상단 왼쪽 텍스트가 예측에 대한 내용으로 바뀌고, 
//하단에 예측된 결과에 매핑된 텍스트가 뜨게됩니다. 

var w = 960, h = 640;

var x, y;
var socket;
var isConnected;
var myAddress = '127.0.0.1';
var myPort = 12000;
var yourAddress = '127.0.0.1';
var yourPort = 6448;

var deliveredM = "";
var insertedCoor_x = [];
var insertedCoor_y = [];

var isRecording = true;
var isRecordingNow = true;

var currentClass = 1;


function setup() {

	createCanvas(w, h);
	
	setupOsc(myPort, yourPort);
	isConnected = false;

}

function draw() {

	colorMode(RGB);

	var mX = intToFloat(mouseX,3);
	var mY = intToFloat(mouseY,3);

	//make a control panel
	fill(255,255,255);
	rect(0,0,960,70);
	rect(0,530,960,640);

	//마우스 흔적 그리기
	if(mouseIsPressed){
		fill(255,0,0);
		stroke(0);
		ellipse(mX,mY,10,10);
	}else{
		background(255,255,255);
	}

	//텍스트 그리기
	fill(0,0,0);
	noStroke();
	textSize(24);
	if(isRecording){
		text("지금 "+currentClass+"번째 output을 기록하는 중입니다.",40,40);
	}else{
		text("지금은 예측하는 중입니다.",40,40);
	}

	text("r 를 누르면 기록이 시작됩니다.",40,560);
	text("s 를 누르면 예측이 시작됩니다.",40,600);
	
	textSize(36);
	text("예측된 결과: "+deliveredM, w/2-100, 600);
	
	//wekinator로 메시지 보내기
	if(mouseIsPressed && frameCount%2 == 0){
		if(isConnected){
			socket.emit('message', ['/wek/inputs', mX*1, mY*1]);
		}
	}
}

function mousePressed(){
	if(isRecording){
		isRecordingNow = true;
		if(isConnected){
			socket.emit('message', ['/wekinator/control/startDtwRecording', currentClass*1]);
		}
	}else{
		if(isConnected){
			socket.emit('message', ['/wekinator/control/startRunning']);
		}
	}
}

function mouseReleased(){
	if(isRecordingNow){
		isRecordingNow = false;
		if(isConnected){
			socket.emit('message', ['/wekinator/control/stopDtwRecording']);
		}
	}
}


function intToFloat(num, decPlaces) { 
	return num + '.' + '0001' ; 
}

function keyTyped(){
	if(key=='s'){
		if(isConnected){
			isRecording = false;
			socket.emit('message', ['/wekinator/control/startRunning']);
		}
	}else if(key=='r'){
		isRecording = true;
	}
	if(key >= 1 && key <= 9){
		console.log(key);
		currentClass = key;
	}
}


function receiveOsc(address, value) {

	// 각 output에 원하는 기능/메시지를 넣을 수 있는 부분입니다. 
	switch(address){
		case '/output_1':
			deliveredM = '세모';
			break;
		case '/output_2':
			deliveredM = '네모';
			break;
		case '/output_3':
			deliveredM = '동그라미';
			break;
		case '/output_4':
			deliveredM = '';
			break;
		case '/output_5':
			deliveredM = '';
			break;
		case '/output_6':
			deliveredM = '';
			break;
		case '/output_7':
			deliveredM = '';
			break;
		case '/output_8':
			deliveredM = '';
			break;
		case '/output_9':
			deliveredM = '';
			break;
	}
	
}

function sendOsc(address, value) {
	socket.emit('message', [address, value]);
}

function setupOsc(oscPortIn, oscPortOut) {
	socket = io.connect('http://'+ myAddress, { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: myAddress},
			client: { port: oscPortOut, host: yourAddress}
		});
	});
	socket.on('connect', function() {
		//console.log("first connect");
		isConnected = true;
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}



