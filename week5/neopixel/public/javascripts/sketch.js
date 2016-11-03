var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here
var inData;                            // for incoming serial data
var outByte = 0;                       // for outgoing data
var capture;
var w = 320, h = 240; 


function setup() {
 frameRate(10);
 capture = createCapture(VIDEO);
 createCanvas(w, h);
 capture.size(w, h);
 capture.hide();

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
 
 capture.loadPixels();
 imageMode(CORNER);
 image(capture, 0, 0, w, h);
 if(frameCount%5 == 0){
 	var r = int(capture.pixels[320*240/2*4]);
  	var g = int(capture.pixels[320*240/2*4+1]);
  	var b = int(capture.pixels[320*240/2*4+2]);

  	serial.write(r+'\n');             // send it out the serial port
 	serial.write(g +'\n'); 
 	serial.write(b +'\n'); 
 }

}


function keyPressed() {
 if (key ==='H' || key ==='L') { // if the user presses H or L
 serial.write(key);              // send it out the serial port
 }
}

