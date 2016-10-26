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

	fill(255,255,255);
	rect(0,0,960,70);
	rect(0,530,960,640);

	if(mouseIsPressed){
		fill(255,0,0);
		stroke(0);
		ellipse(mX,mY,10,10);
	}else{
		background(255,255,255);
	}

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
	text("예측된 텍스트: "+deliveredM, w/2-100, 600);
	
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
	if(key >= 1 && key <= 3){
		console.log(key);
		currentClass = key;
	}
}


function receiveOsc(address, value) {

	// 각 output에 원하는 기능/메시지를 넣을 수 있는 부분입니다. 
	if(address == '/output_1'){
		deliveredM = '세모';
		console.log("1");
	}else if(address == '/output_2'){
		deliveredM = '네모';
		console.log("2");
	}else if(address == '/output_3'){
		deliveredM = '동그라미';
		console.log("3");
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



