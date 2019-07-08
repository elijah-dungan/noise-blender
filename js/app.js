'use-strict';

// var rainEl = document.getElementById('rain'); // stores reference
// rainEl.src='https://elijah-dungan.github.io/120/rain.mp3';

// select our play button
var playButton = document.querySelector('button');

// event handlers
function handleClick() {
  var audioContext = new AudioContext(); // creates new AudioContext
  var rainTrack = audioContext.createMediaElementSource(rainEl); // passes audio element to the API
  rainTrack.connect(audioContext.destination); // connects other nodes to BaseAudioContext.destination

}


// event listers
playButton.addEventListener('click', start);





var audioContext = new AudioContext();
var streamOgg;
var source;
var gainNode = audioContext.createGain();
// var isPlaying = false;

fetch('https://elijah-dungan.github.io/ogg/stream.ogg') // credit Johan Karisson
  .then(response => response.arrayBuffer()) // takes response stream and reads it to completion
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // asynchronously decodes completely read audio stream
  .then(audioBuffer => { // represents audio asset?
    streamOgg = audioBuffer;
  });

function start() { // credit Johan Karisson
  source = audioContext.createBufferSource(); // mp3 player
  source.buffer = streamOgg; // ogg file
  source.connect(gainNode).connect(audioContext.destination); // wire and speakers with volume control
  source.loop = true;
  source.start();
}

function stop() { // credit Johan Karisson
  source.stop();
}

