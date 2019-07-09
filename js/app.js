'use-strict';

/** special thanks goes to Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api, MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API, and W3 Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp **/

// global variables

var noise = [];
var gainNode = [];
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

// event handlers

function appear() { // makes button visible after 1 second timer, allows executables to finish buffering before user plays audio
  if(event.target) {
    setTimeout(function(){playEl.style.visibility = 'visible';}, 1000);
  }
}

function startSounds() { // starts all audio assets
  for(var i = 0; i < ogg.length; i++) {
    mainSliderEl.disabled = false;
    allSlidersEl[i].disabled = false;
    allSlidersEl[i].value = 50;
    gainNode[i] = audioContext.createGain(); // creates gain node for each audio asset
    // TODO - need check for local memory and grab user gain values, then for loop the values into the gainNode array
    gainNode[i].gain.value = 0.5; // sets default volume
    noise[i] = audioContext.createBufferSource(); // creates audio players
    noise[i].buffer = ogg[i].buffer; // assigns audio assets to buffers
    noise[i].connect(gainNode[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    noise[i].loop = true; // ensures each audio asset will loop
    noise[i].start();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', stopSounds);
  console.log(gainNode, noise);
}

function stopSounds() { // stops all audio assets
  for(var i = 0; i <ogg.length; i++) {
    noise[i].stop();
    allSlidersEl[i].value = 50;
    mainSliderEl.disabled = true;
    allSlidersEl[i].disabled = true;
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
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

//TODO need to add gain control event listener
window.addEventListener('load', appear);
playEl.addEventListener('click', startSounds);
slidersEl.addEventListener('input', adjustVolume);


// executables

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

