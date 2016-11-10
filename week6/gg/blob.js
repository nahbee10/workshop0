var htmlElem = document.querySelector('html');
var pElem = document.querySelector('p');
var imgElem = document.querySelector('img');

var yourNumberForm = document.getElementById('yourNumber');

if(!localStorage.getItem('yourNumber')) {
  
} else {
  setStyles();
}

function setStyles() {
  var currentNumber= localStorage.getItem('yourNumber');

  //document.getElementById('yourNumber').value = currentNumber;

  pElem.innerHTML = currentNumber;
}

