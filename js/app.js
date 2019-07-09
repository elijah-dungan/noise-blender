'use-strict';

/** special thanks goes to Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api, MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API, and W3 Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp **/

// global variables

var noise = [];
var gainNode = [];
var audioContext = new AudioContext();
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
  }
  playEl.removeEventListener('click', stopSounds);
  playEl.addEventListener('click', startSounds);
}

//TODO need to add gain control event handler, event handler should store gain values into local memory

// event listers

//TODO need to add gain control event listener
window.addEventListener('load', appear);
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

