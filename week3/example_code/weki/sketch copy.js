var capture;
var tracker;
var w = 640, h = 480;

var x, y;
var socket;
var isConnected;
var myAddress = '127.0.0.1';
var myPort = 12000;
var yourAddress = '127.0.0.1';
var yourPort = 6448;

var deliveredM = "";


function setup() {

	capture = createCapture(VIDEO);
	createCanvas(w, h);
	capture.size(w, h);
	capture.hide();
	
	setupOsc(myPort, yourPort);
	isConnected = false;

	tracker = new clm.tracker();
	tracker.init(pModel);
	tracker.start(capture.elt);

}

function draw() {

	var positions = tracker.getCurrentPosition();

  	if(positions.length>0){
  		socket.emit('message', ['/wek/inputs',
  			positions[0][0], positions[0][1],
  			positions[3][0], positions[3][1],
  			positions[6][0], positions[6][1],
  			positions[9][0], positions[9][1],
  			positions[12][0], positions[12][1],
  			positions[15][0], positions[15][1],
  			positions[18][0], positions[18][1],
  			positions[21][0], positions[21][1],
  			positions[24][0], positions[24][1],
  			positions[27][0], positions[27][1],
  			positions[30][0], positions[30][1],
  			positions[33][0], positions[33][1]]);
  	}

	colorMode(RGB);
	background(255, 0, 255);

	textSize(24);

	
	colorMode(HSB,100);

	noFill();
	stroke(0);
	beginShape();
	for (var i=0; i<positions.length; i++) {
	vertex(positions[i][0], positions[i][1]);
	}
	endShape();

	fill(0.3*100,100,100);
	textSize(80);
	text(deliveredM, w/2-100, h/2-50);
	
}


function receiveOsc(address, value) {
	//console.log("received OSC: " + address + ", " + value);

	if(address == '/output_1'){
		deliveredM = '묵';
		console.log("1");
	}else if(address == '/output_2'){
		deliveredM = '찌';
		console.log("2");
	}else if(address == 'output_3'){
		deliveredM = '빠';
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



