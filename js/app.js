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

var source = [
  {
    name: 'thunder',
    buffer: '',
    value: '0.5'
  },
  {
    name: 'rain',
    buffer: '',
    value: '0.5'
  },
  {
    name: 'beach',
    buffer: '',
    value: '0'
  },
  {
    name: 'waterfall',
    buffer: '',
    value: '0.425'
  },
  {
    name: 'stream',
    buffer: '',
    value: '0.5'
  },
  {
    name: 'canopy',
    buffer: '',
    value: '0'
  },
  {
    name: 'frogs',
    buffer: '',
    value: '0'
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
  allSlidersEl[0].value = 100; // thunder
  gainNode[0].gain.value = 0.5;
  allSlidersEl[1].value = 100; //rain
  gainNode[1].gain.value = 0.5;
  allSlidersEl[2].value = 0; // beach
  gainNode[2].gain.value = 0;
  allSlidersEl[3].value = 85; // waterfall
  gainNode[3].gain.value = 0.425;
  allSlidersEl[4].value = 100; // stream
  gainNode[4].gain.value = 0.5;
  allSlidersEl[5].value = 0; // canopy
  gainNode[5].gain.value = 0;
  allSlidersEl[6].value = 0; // frogs
  gainNode[6].gain.value = 0;
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
  for(var i = 0; i < source.length; i++) {
    gainNode[i] = audioContext.createGain(); // creates gain node for each audio asset
    noise[i] = audioContext.createBufferSource(); // creates audio players
    noise[i].buffer = source[i].buffer; // assigns audio assets to buffers
    noise[i].connect(gainNode[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    noise[i].loop = true; // ensures each audio asset will loop
    noise[i].start();
  }
  if(localStorage.sliderValues) {
    for(var v = 0; v < source.length; v++) {
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
  for(var i = 0; i <source.length; i++) {
    noise[i].stop();
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
  playEl.src = './img/pausebuttonborderless.png';
}

// event handler should store gain values into local memory
function adjustVolume() {
  clearData();
  if(event.target.id === 'thunder-slider') {
    source[0].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'rain-slider') {
    source[1].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'beach-slider') {
    source[2].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'waterfall-slider') {
    source[3].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'stream-slider') {
    source[4].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'canopy-slider') {
    source[5].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'frogs-slider') {
    source[6].value = (event.target.value / 100) * (mainSliderEl.value / 100);
  } else if(event.target.id === 'main-slider') {
    for(var i = 0; i < source.length; i ++) {
      source[i].value = (allSlidersEl[i].value / 100) * (mainSliderEl.value / 100);
    }
  }
  if(gainNode.length > 0) {
    for(var q = 0; q < source.length; q++) {
      gainNode[q].gain.value = source[q].value;
    }
  }
  for(var v = 0; v < source.length; v++) {
    sliderValues.push(allSlidersEl[v].value);
    gainValues.push(source[v].value);
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

/* attempted to create for loop but recieved undefined error with ogg array */
fetch('https://elijah-dungan.github.io/ogg/thunder.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[0].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/rain.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[1].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/beach.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // takes completely read audio stream and asynchronously decodes it
  .then(audioBuffer => { // represents audio asset
    source[2].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/waterfall.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[3].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/stream.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[4].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/canopy.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[5].buffer = audioBuffer;
  });
fetch('https://elijah-dungan.github.io/ogg/frogs.ogg')
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset
    source[6].buffer = audioBuffer;
  });

