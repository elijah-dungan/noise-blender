'use-strict';

/** special thanks goes to Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api, MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API, and W3 Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp **/

// global variables

var noise = [];
var gainNode = [];
var sliderValues = [];
var gainValues = [];
var audioContext = new AudioContext();
var slidersEl = document.getElementById('slide-container'); // references div element by ID
var allSlidersEl = document.getElementsByClassName('range-sliders'); // returns a node of sliders
var mainSliderEl = document.getElementById('main-slider'); // references main slider element but ID
var playEl = document.getElementById('audio-button-1'); // references button element by ID

// objects

var ogg = [
  {
    name: 'beach',
    buffer: ''
  },
  {
    name: 'waterfall',
    buffer: ''
  },
  {
    name: 'stream',
    buffer: ''
  },
  {
    name: 'rain',
    buffer: ''
  },
  {
    name: 'canopy',
    buffer: ''
  },
  {
    name: 'frogs',
    buffer: ''
  }
];

// helper functions

function clearData() {
  localStorage.clear();
  sliderValues = [];
  gainValues = [];
}

function defaultGainValues() { // will need to rewrite default settings if more audio assets are added
  mainSliderEl.value = 50;
  allSlidersEl[0].value = 80;
  gainNode[0].gain.value = 0.4;
  allSlidersEl[1].value = 85;
  gainNode[1].gain.value = 0.425;
  allSlidersEl[2].value = 100;
  gainNode[2].gain.value = 0.5;
  allSlidersEl[3].value = 100;
  gainNode[3].gain.value = 0.5;
  allSlidersEl[4].value = 0;
  gainNode[4].gain.value = 0;
  allSlidersEl[5].value = 0;
  gainNode[5].gain.value = 0;
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
  for(var i = 0; i < ogg.length; i++) {
    mainSliderEl.disabled = false;
    allSlidersEl[i].disabled = false;
    gainNode[i] = audioContext.createGain(); // creates gain node for each audio asset
    noise[i] = audioContext.createBufferSource(); // creates audio players
    noise[i].buffer = ogg[i].buffer; // assigns audio assets to buffers
    noise[i].connect(gainNode[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    noise[i].loop = true; // ensures each audio asset will loop
    noise[i].start();
  }
  if(localStorage.sliderValues) {
    for(var v = 0; v < ogg.length; v++) {
      allSlidersEl[v].value = pulledSliderValues[v];
      mainSliderEl.value = pulledSliderValues[6]; // need to figure out last child
      gainNode[v].gain.value = (pulledGainValues[v]);
      console.log(gainNode[v].gain.value);
    }
  } else {
    defaultGainValues();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', stopSounds);
  playEl.src = './img/playbuttonborderless.png';
}

function stopSounds() { // stops all audio assets
  clearData();
  for(var i = 0; i <ogg.length; i++) {
    noise[i].stop();
    sliderValues.push(allSlidersEl[i].value);
    gainValues.push(gainNode[i].gain.value);
    // allSlidersEl[i].value = 50;
    // mainSliderEl.value = 50;
    allSlidersEl[i].disabled = true;
  }
  mainSliderEl.disabled = true;
  sliderValues.push(mainSliderEl.value);
  var stringifiedSliderValues = JSON.stringify(sliderValues);
  var stringifiedGainValues = JSON.stringify(gainValues);
  localStorage.setItem('sliderValues', stringifiedSliderValues);
  localStorage.setItem('gainValues', stringifiedGainValues);
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
  playEl.src = './img/pausebuttonborderless.png';
  console.log(localStorage);
}

// event handler should store gain values into local memory
function adjustVolume() {
  if(event.target.id === 'beach-slider') {
    gainNode[0].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'waterfall-slider') {
    gainNode[1].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'stream-slider') {
    gainNode[2].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'rain-slider') {
    gainNode[3].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'canopy-slider') {
    gainNode[4].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'frogs-slider') {
    gainNode[5].gain.value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'main-slider') {
    for(var i = 0; i < ogg.length; i ++) {
      gainNode[i].gain.value = (allSlidersEl[i].value / 100) * (mainSliderEl.value / 100);
    }
  }
}

// event listers

window.addEventListener('load', enable);
playEl.addEventListener('click', startSounds);
slidersEl.addEventListener('input', adjustVolume);

// executables

clearData();

/* attempted to create for loop but recieved undefined error with ogg array */
fetch('https://elijah-dungan.github.io/ogg/beach.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // takes completely read audio stream and asynchronously decodes it
  .then(audioBuffer => { // represents audio asset
    ogg[0].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/waterfall.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    ogg[1].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/stream.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    ogg[2].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/rain.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    ogg[3].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/canopy.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    ogg[4].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/frogs.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    ogg[5].buffer = audioBuffer;
  });

