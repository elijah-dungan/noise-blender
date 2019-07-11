'use-strict';

/** special thanks goes to Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api, MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API, and W3 Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp **/

// global variables

var allSounds = [];
var noise = [];
var gainNode = [];
var sliderValues = [];
var gainValues = [];
var audioContext = new AudioContext();
var slidersEl = document.getElementById('slider-container'); // references div element by ID
var allSlidersEl = document.getElementsByClassName('range-sliders'); // returns a node of sliders
var mainSliderEl = document.getElementById('main-slider'); // references main slider element but ID
var playEl = document.getElementById('audio-button-1'); // references button element by ID

// objects

function Sound(name, extension, sliderDefault, volumeDefault) {
  this.name = name;
  this.extension = extension;
  this.filepath = `./ogg/${name}.${extension}`;
  this.buffer = '';
  this.sliderDefault = sliderDefault;
  this.volumeDefault = volumeDefault;
  allSounds.push(this);
}

new Sound('thunder', 'ogg', '100', '0.5');
new Sound('rain', 'ogg', '100', '0.5');
new Sound('beach', 'ogg', '0', '0');
new Sound('waterfall', 'ogg', '85', '0.425');
new Sound('stream', 'ogg', '100', '0.5');
new Sound('canopy', 'ogg', '0', '0');
new Sound('frogs', 'ogg', '0', '0');

// helper functions

function clearData() {
  localStorage.clear();
  sliderValues = [];
  gainValues = [];
}

function defaultGainValues() { // will need to rewrite default settings if more audio assets are added
  mainSliderEl.value = 50;
  for(var i = 0; i < allSounds.length; i ++) {
    allSlidersEl[i].value = allSounds[i].sliderDefault;
    gainNode[i].gain.value = allSounds[i].volumeDefault;
  }
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

function startSounds() { // starts all audio assets
  if(localStorage.sliderValues) {
    var unstringifiedSliderValues = localStorage.getItem('sliderValues');
    var pulledSliderValues = JSON.parse(unstringifiedSliderValues);
    var unstringifiedGainValues = localStorage.getItem('gainValues');
    var pulledGainValues = JSON.parse(unstringifiedGainValues);
  }
  for(var i = 0; i < allSounds.length; i++) {
    gainNode[i] = audioContext.createGain(); // creates gain node for each audio asset
    noise[i] = audioContext.createBufferSource(); // creates audio players
    noise[i].buffer = allSounds[i].buffer; // assigns audio assets to buffers
    noise[i].connect(gainNode[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    noise[i].loop = true; // ensures each audio asset will loop
    noise[i].start();
  }
  if(localStorage.sliderValues) {
    for(var v = 0; v < allSounds.length; v++) {
      allSlidersEl[v].value = pulledSliderValues[v];
      mainSliderEl.value = pulledSliderValues[7]; // need to figure out last child
      gainNode[v].gain.value = (pulledGainValues[v]);
    }
  } else {
    defaultGainValues();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', stopSounds);
  playEl.src = './img/playbuttonborderless.png';
}

function stopSounds() { // stops all audio assets
  for(var i = 0; i <allSounds.length; i++) {
    noise[i].stop();
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
  playEl.src = './img/pausebuttonborderless.png';
}

function adjustVolume() {
  clearData();
  if(event.target.id === 'thunder-slider') {
    allSounds[0].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'rain-slider') {
    allSounds[1].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'beach-slider') {
    allSounds[2].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'waterfall-slider') {
    allSounds[3].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'stream-slider') {
    allSounds[4].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'canopy-slider') {
    allSounds[5].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'frogs-slider') {
    allSounds[6].volumeDefault = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'main-slider') {
    for(var i = 0; i < allSounds.length; i ++) {
      allSounds[i].volumeDefault = (allSlidersEl[i].value / 100) * (mainSliderEl.value / 100);
    }
  }
  if(gainNode.length > 0) {
    for(var q = 0; q < allSounds.length; q++) {
      gainNode[q].gain.value = allSounds[q].volumeDefault;
    }
  }
  for(var v = 0; v < allSounds.length; v++) {
    sliderValues.push(allSlidersEl[v].value);
    gainValues.push(allSounds[v].volumeDefault);
  }
  sliderValues.push(mainSliderEl.value);
  var stringifiedSliderValues = JSON.stringify(sliderValues);
  var stringifiedGainValues = JSON.stringify(gainValues);
  localStorage.setItem('sliderValues', stringifiedSliderValues);
  localStorage.setItem('gainValues', stringifiedGainValues);
}

// event listers

window.addEventListener('load', enable);
playEl.addEventListener('click', startSounds);
slidersEl.addEventListener('input', adjustVolume);

// executables

clearData();
console.log(allSounds);
fetch('https://elijah-dungan.github.io/ogg/thunder.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[0].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/rain.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[1].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/beach.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // takes completely read audio stream and asynchronously decodes it
  .then(audioBuffer => { // represents audio asset
    allSounds[2].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/waterfall.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[3].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/stream.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[4].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/canopy.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[5].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/frogs.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    allSounds[6].buffer = audioBuffer;
  });
