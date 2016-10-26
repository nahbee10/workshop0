var x, y;
var socket;
var isConnected;
//자기 IP주소와 포트 번호를 적어주세요.
var myAddress = '192.168.0.24';
var myPort = 12000;
//상대방의 IP주소와 포트 번호를 적어주세요.
var yourAddress = '192.168.0.114';
var yourPort = 3334;

var x_arr = [];
var y_arr = [];
var r_arr = [];
var c_arr = [];

function setup() {
	createCanvas(1000, 500);
	setupOsc(myPort, yourPort);
	isConnected = false;
}

function draw() {
	colorMode(RGB);
	background(255, 255, 255);

	if(x_arr.length>0){
		colorMode(HSB,100);
		for (var i = 0; i < x_arr.length; i++) {
			fill(c_arr[i]*100,100,100);
			ellipse(x_arr[i],y_arr[i],r_arr[i],r_arr[i]);
		};
	}
	
}

function mousePressed(){

	var new_x = mouseX;
	var new_y = mouseY;
	var new_r = random(40,100);
	var new_c = random();

	x_arr.push(mouseX);
	y_arr.push(mouseY);
	r_arr.push(new_r);
	c_arr.push(new_c);

	colorMode(HSB,100);
	fill(new_c*100,100,100);
	ellipse(new_x,new_y,new_r,new_r);

	if(isConnected){
		socket.emit('message', ['/signal', mouseX,mouseY]);
	}

}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);
	
	if (address == '/signal') {
		x_arr.push(value[0]);
		y_arr.push(value[1]);
		r_arr.push(value[2]);
		c_arr.push(value[3]);

		colorMode(HSB,100);
		fill(value[3]*100,100,100);
		ellipse(value[0],value[1],value[2],value[2]);
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



