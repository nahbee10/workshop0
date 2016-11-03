var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here
var inData;                            // for incoming serial data
var outByte = 0;                       // for outgoing data
var myVideo;
var w = 640, h = 360; 


function setup() {
 frameRate(10);
 createCanvas(w, h);          // make the canvas
 myVideo = createVideo(['images/rocky.mp4']);
 myVideo.crossOrigin='Anonymous';
 myVideo.loop();
 myVideo.hide();

 serial = new p5.SerialPort();    // make a new instance of the serialport library
 serial.on('data', serialEvent);  // callback for when new data arrives
 serial.on('error', serialError); // callback for errors
 serial.open(portName);           // open a serial port
}

function serialEvent() {
 // read a byte from the serial port:
 var inByte = serial.read();
 // store it in a global variable:
 inData = inByte;
}
 
function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function draw() {
 // black background, white text:
 image(myVideo,0,0); 
 myVideo.loadPixels();

 if(frameCount%5 == 0){
 	// 픽셀 보내기 -> 
 	var r = int(myVideo.pixels[w*h/2*4]);
  	var g = int(myVideo.pixels[w*h/2*4+1]);
  	var b = int(myVideo.pixels[w*h/2*4+2]);

  	serial.write(r+'\n');             // send it out the serial port
 	serial.write(g +'\n'); 
 	serial.write(b +'\n'); 

 }

}
