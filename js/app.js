'use-strict';

/* special thanks/credit:
Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api
MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
W3Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp */

// global variables

var allSounds = []; // stores all object instances
var audioBufferSourceNodes = []; // stores all audioBufferSourceNodes, values generated by startSounds function
var gainNodes = []; // stores all gainsNodes, values generated by startSounds function
var analyserNodes = [];
var bufferLengths = [];
var waveformData = [];
var canvas = document.getElementById('oscilloscope');
var canvasCtx = canvas.getContext('2d');
var sliderValues = []; // array for temporarily storing values for localStorage, allows mixer persistence
var gainValues = []; // array for temporarily storing values for localStorage, allows mixer persistence
var audioContext = new AudioContext();
var slidersEl = document.getElementById('slider-container'); // references div element by ID
var allSlidersEl = document.getElementsByClassName('range-sliders'); // returns a node of sliders
var mainSliderEl = document.getElementById('slider-main'); // references main slider element but ID
var playEl = document.getElementById('audio-button-1'); // references button element by ID

// objects

function Sound(name, extension, sliderDefault, volumeDefault) {
  this.name = name;
  this.extension = extension;
  this.filepath = `./audio/${name}.${extension}`;
  this.buffer = '';
  this.sliderDefault = sliderDefault;
  this.volumeDefault = volumeDefault;
  this.fetchAudio = function() {
    fetch(`https://elijah-dungan.github.io/ogg/${this.name}.${this.extension}`) // TODO: change to this.filepath for final deployment
      .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
      .then(audioBuffer => { // represents audio asset
        this.buffer = audioBuffer;
      });
  };
  allSounds.push(this);
}

// functions NOTE: attempted to refactor renderOscilloscope functions but parameters would not be accepted by audio API

function renderOscilloscope1() {
  requestAnimationFrame(renderOscilloscope1);
  analyserNodes[0].getByteTimeDomainData(waveformData[0]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[0];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[0]; i++) {
    var v = (waveformData[0][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope2() {
  requestAnimationFrame(renderOscilloscope2);
  analyserNodes[1].getByteTimeDomainData(waveformData[1]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[1];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[1]; i++) {
    var v = (waveformData[1][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope3() {
  requestAnimationFrame(renderOscilloscope3);
  analyserNodes[2].getByteTimeDomainData(waveformData[2]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[2];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[2]; i++) {
    var v = (waveformData[2][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope4() {
  requestAnimationFrame(renderOscilloscope4);
  analyserNodes[3].getByteTimeDomainData(waveformData[3]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[3];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[3]; i++) {
    var v = (waveformData[3][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope5() {
  requestAnimationFrame(renderOscilloscope5);
  analyserNodes[4].getByteTimeDomainData(waveformData[4]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[4];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[4]; i++) {
    var v = (waveformData[4][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope6() {
  requestAnimationFrame(renderOscilloscope6);
  analyserNodes[5].getByteTimeDomainData(waveformData[5]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[5];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[5]; i++) {
    var v = (waveformData[5][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderOscilloscope7() {
  requestAnimationFrame(renderOscilloscope7);
  analyserNodes[6].getByteTimeDomainData(waveformData[6]);
  canvasCtx.clearRect(0, 0, 300, 150);
  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
  canvasCtx.beginPath();
  var sliceWidth = 300 * 1.0 / bufferLengths[6];
  var x = 0.29296875;
  for(var i = 0; i < bufferLengths[6]; i++) {
    var v = (waveformData[6][i] / 128.0);
    var y = v * 75;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}

function renderDefaultSounds() { // creates object instances of default sounds, then renders the audio for playback
  var thunder = new Sound('thunder', 'ogg', '100', '0.5');
  var rain = new Sound('rain', 'ogg', '100', '0.5');
  var beach = new Sound('beach', 'ogg', '0', '0');
  var waterfall = new Sound('waterfall', 'ogg', '85', '0.425');
  var stream = new Sound('stream', 'ogg', '100', '0.5');
  var canopy = new Sound('canopy', 'ogg', '0', '0');
  var frogs = new Sound('frogs', 'ogg', '0', '0');
  thunder.fetchAudio();
  rain.fetchAudio();
  beach.fetchAudio();
  waterfall.fetchAudio();
  stream.fetchAudio();
  canopy.fetchAudio();
  frogs.fetchAudio();
}

// helper functions

function clearData() { // facilitates data overwriting by clearing localStorage, sliderValues, and gainValues
  localStorage.clear();
  sliderValues = [];
  gainValues = [];
}

function defaultGainValues() { // sets the sliders and gain to default values specified in instances of Sound constructor function
  mainSliderEl.value = 50;
  for(var i = 0; i < allSounds.length; i ++) {
    allSlidersEl[i].value = allSounds[i].sliderDefault;
    gainNodes[i].gain.value = allSounds[i].volumeDefault;
  }
}

function canvasSettings() {
  
}

// event handlers

function enable() { // makes button visible after 1 second timer, allows executables to finish buffering before user can play audio
  if(event.target) {
    setTimeout(function() {
      playEl.src = './img/pausebuttonborderless.png';
      playEl.disabled = false;
    }, 1000);
  }
}

// TODO: create new event handler/listener that upon selection from a dropdown menu, it (1) stops current sounds, (2) clears the allSounds, audioBufferSourceNodes, and gainNodes arrays; (3) renders new sounds based on scene selection, (4) changes the background video to a new video based on scene selection, (5) calls a loading function that disables the play/pause button until the rendering is complete, and (6) manipulates the DOm by overwriting slider labels with new labels from the selected scene

//TODO: consider removing the enable event handler once a loading function is created

function startSounds() { // starts all audio assets
  if(localStorage.sliderValues) { // checks to see if sliderValues are in localStorage
    var unstringifiedSliderValues = localStorage.getItem('sliderValues'); // gets sliderValues from localStorage
    var unstringifiedGainValues = localStorage.getItem('gainValues'); // gets gainValues from localStorage
    var pulledSliderValues = JSON.parse(unstringifiedSliderValues); // parses sliderValues from localStorage
    var pulledGainValues = JSON.parse(unstringifiedGainValues); // parses gainValues from localStorage
  }
  for(var i = 0; i < allSounds.length; i++) {
    analyserNodes[i] = audioContext.createAnalyser(); // creates analyzer for each audio asset
    analyserNodes[i].fftSize = 2048;
    bufferLengths[i] = analyserNodes[i].frequencyBinCount;
    waveformData[i] = new Uint8Array(bufferLengths[i]);
    // analyserNodes[i].getByteTimeDomainData(waveformData[i]);
    gainNodes[i] = audioContext.createGain(); // creates gain node for each audio asset
    audioBufferSourceNodes[i] = audioContext.createBufferSource(); // creates audio players
    audioBufferSourceNodes[i].buffer = allSounds[i].buffer; // assigns audio assets to buffers
    audioBufferSourceNodes[i].connect(gainNodes[i]).connect(analyserNodes[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    audioBufferSourceNodes[i].loop = true; // ensures each audio asset will loop
    audioBufferSourceNodes[i].start(); // starts all audio assets
  }
  if(localStorage.sliderValues) { // checks to see if sliderValues are in localStorage
    for(var v = 0; v < allSounds.length; v++) {
      allSlidersEl[v].value = pulledSliderValues[v]; // assigns sliders sliderValues from localStorage
      mainSliderEl.value = pulledSliderValues[allSounds.length]; // assigns main slider sliderValue from localStorage
      gainNodes[v].gain.value = (pulledGainValues[v]); // assigns gainNodes gainValues from localStorage
    }
  } else {
    defaultGainValues();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', stopSounds);
  playEl.src = './img/playbuttonborderless.png';
  renderOscilloscope1();
}

function stopSounds() { // stops all audio assets
  for(var i = 0; i <allSounds.length; i++) {
    audioBufferSourceNodes[i].stop();
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
  playEl.src = './img/pausebuttonborderless.png';
}

//TODO: consider rewriting adjustVolume code so that localStorage is handled more efficiently and specifically (local storage data is pulled and overwritten without using the clear() function and the associated for loops. This will produce more written code, but the browser will run less code

function adjustVolume() { // adjusts volume according to movement of the sliders
  clearData(); // clears current volume data to facilitate overwrite
  if(event.target.id === 'slider-1') { // stores new values for volumeDefault
    allSounds[0].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-2') {
    allSounds[1].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-3') {
    allSounds[2].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-4') {
    allSounds[3].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-5') {
    allSounds[4].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-6') {
    allSounds[5].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-7') {
    allSounds[6].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'slider-main') {
    for(var i = 0; i < allSounds.length; i ++) {
      allSounds[i].volumeDefault = (allSlidersEl[i].value / 100) * (mainSliderEl.value / 100);
    }
  }
  if(gainNodes.length > 0) { // checks to see if gainNodes have been generated
    for(var q = 0; q < allSounds.length; q++) { 
      gainNodes[q].gain.value = allSounds[q].volumeDefault; // takes values from volumeDefault and updates actual volume levels
    }
  }
  for(var v = 0; v < allSounds.length; v++) {
    sliderValues.push(allSlidersEl[v].value); // pushes to array that temporarily stores values for localStorage
    gainValues.push(allSounds[v].volumeDefault); // pushes to array that temporarily stores values for localStorage
  }
  sliderValues.push(mainSliderEl.value); // pushes to array that temporarily stores values for localStorage
  var stringifiedSliderValues = JSON.stringify(sliderValues); // stringifies sliderValues for localStorage
  var stringifiedGainValues = JSON.stringify(gainValues); // stringifies gainValues for localStorage
  localStorage.setItem('sliderValues', stringifiedSliderValues); // stores sliderValues into localStorage
  localStorage.setItem('gainValues', stringifiedGainValues); // stores gainValues into localStorage
}

function changeOscilloscope() { // changes oscilloscope on mouseover
  if(event.target.id === 'slider-1') {
    renderOscilloscope1();
  } else if(event.target.id === 'slider-2') {
    renderOscilloscope2();
  } else if(event.target.id === 'slider-3') {
    renderOscilloscope3();
  } else if(event.target.id === 'slider-4') {
    renderOscilloscope4();
  } else if(event.target.id === 'slider-5') {
    renderOscilloscope5();
  } else if(event.target.id === 'slider-6') {
    renderOscilloscope6();
  } else if(event.target.id === 'slider-7') {
    renderOscilloscope7();
  }
}

// event listers

window.addEventListener('load', enable);
playEl.addEventListener('click', startSounds);
slidersEl.addEventListener('input', adjustVolume);
slidersEl.addEventListener('mousedown', changeOscilloscope);

// executables

clearData();
canvasCtx.clearRect(0, 0, 300, 150);
renderDefaultSounds();

