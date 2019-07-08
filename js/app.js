'use-strict';
/** credit goes to Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api, and MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API for example Web Audio API code **/

// global variables

var source = [];
var audioContext = new AudioContext();
var gainNode = audioContext.createGain();
var playEl = document.querySelector('button'); // stores DOM element reference by ID

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

// event handlers

function startSounds() { // starts all audio assets
  for(var i = 0; i < ogg.length; i++) {
    source[i] = audioContext.createBufferSource(); // mp3 player
    source[i].buffer = ogg[i].buffer; // ogg files
    source[i].connect(gainNode).connect(audioContext.destination); // wire and speakers with volume control
    source[i].loop = true;
    source[i].start();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', stopSounds);
}

function stopSounds() { // stops all audio assets
  for(var i = 0; i <ogg.length; i++) {
    source[i].stop();
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
}

// event listers

playEl.addEventListener('click', startSounds);

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

