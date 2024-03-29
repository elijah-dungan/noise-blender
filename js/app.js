'use-strict';

/* special thanks/credit for Web Audio API material:
Johan Karisson https://codepen.io/DonKarlssonSan/post/drum-loops-and-effects-with-web-audio-api
MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
W3Schools https://www.w3schools.com/howto/howto_js_rangeslider.asp */

// TODO: audio queu should disconnect and reconnect audio assets, then stop?, this may cause user to re-initialize play list?
// NOTE: possible way to create queue with workaround for the user gesture requirement is to create a function that populates the queue array with random songs, generates another array that stores times which tells start() when to playback. Multiple starts() are generated by this function. The songs will playback one by one, in sequential order and in the random order that the list was generated.

/* -----global variables-----*/

var allSounds = []; // stores all object instances
var audioQueue = []; // stores playlist of music in randomized order like an A/B CD deck NOTE: function grabs from index 0, current song index 0, next song index 1
var classicalPianoPlayList = []; // stores list of all classical music
var audioBufferSourceNodes = []; // stores all audioBufferSourceNodes, values generated by startSounds function
var gainNodes = []; // stores all gainsNodes, values generated by startSounds function
var analyserNodes = []; // stores all analyzer nodes used for oscilloscope
var bufferLengths = []; // stores all specified bufferlengths for analyzer nodes
var waveformData = []; // stores all waveform data points to be drawn on canvas
var sliderValues = []; // array for temporarily storing values for localStorage, allows mixer persistence
var gainValues = []; // array for temporarily storing values for localStorage, allows mixer persistence
var audioContext = new AudioContext();
var musicPlayerEl = document.getElementById('music-player');
var canvas = document.getElementById('oscilloscope');
var canvasCtx = canvas.getContext('2d');
var slidersEl = document.getElementById('slider-container'); // references div element by ID
var allSlidersEl = document.getElementsByClassName('range-sliders'); // returns a node of sliders
var mainSliderEl = document.getElementById('slider-main'); // references main slider element but ID
var playEl = document.getElementById('audio-button-1'); // references button element by ID

/* -----objects----- */

function Sound(name, extension, sliderDefault, volumeDefault) { // utilizes decodeAudioData for audio assets that are responsive and interative (for looping seemlessly)
  this.name = name;
  this.extension = extension;
  this.filepath = `./audio/sounds/${name}.${extension}`;
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

// TODO: need to create a method for playing music with the sounds, either via fetching audio or using HTML5 audio
// NOTE: I think I will use the same fetch method while allowing the user to change to another music playlist using a dropdown-menu, this will require an event listener that will require all audio assets to be stopped unless if the UI features a separate play button for music, due to browser protocols requiring user

function Music(name, extension, title, artist, genre, mainInstrument, duration, sliderDefault, volumeDefault) { // utilizes HTML5
  this.name = name;
  this.extension = extension;
  this.title = title;
  this.artist = artist;
  this.header = `${this.title} by ${this.artist}`;
  this.genre = genre;
  this.duration = duration;
  this.instruments = mainInstrument;
  this.filepath = `.audio/music/${name}.${extension}`;
  this.sliderDefault = sliderDefault;
  this.volumeDefault = volumeDefault;
  // TODO: push into array based on genre of music and instruments, using if conditions, instrument check uses for loop
}

/* -----functions----- */

// var clairDeLune = new Music('clairDeLune', 'mp3', '100', '0.5');

function renderDefaultSounds() { // creates default instances and renders the audio assets for playback
  var thunder = new Sound('thunder', 'ogg', '100', '0.25');
  var rain = new Sound('rain', 'ogg', '100', '0.25');
  var beach = new Sound('beach', 'ogg', '0', '0');
  var waterfall = new Sound('waterfall', 'ogg', '85', '0.2125');
  var stream = new Sound('stream', 'ogg', '100', '0.25');
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

// TODO: Create render function for music NOTE: Do I let the queu render music and possibly get an error, or do I create a function like renderDefaultSounds that loads all audio assets asynchroniously?

function renderOscilloscope(index) {
  function draw() {
    requestAnimationFrame(draw);
    analyserNodes[index].getByteTimeDomainData(waveformData[index]);
    canvasCtx.clearRect(0, 0, 300, 150);
    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
    canvasCtx.beginPath();
    var sliceWidth = 300 * 1.0 / bufferLengths[index];
    var x = 0;
    for(var i = 0; i < bufferLengths[index]; i++) {
      var v = (waveformData[index][i] / 128.0);
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
  draw();
}

/* -----helper functions----- */

function clearData() { // facilitates data overwriting by clearing localStorage, sliderValues, and gainValues
  localStorage.clear();
  sliderValues = [];
  gainValues = [];
}

function defaultGainValues() { // sets the sliders and gain to default values specified in instances of Sound constructor function
  for(var i = 0; i < allSounds.length; i ++) {
    allSlidersEl[i].value = allSounds[i].sliderDefault;
    gainNodes[i].gain.value = allSounds[i].volumeDefault;
  }
  mainSliderEl.value = 25;
}

function findIndexOfHighestGain() { // this function is used to pass an index of the loudest sound. It is useful for displaying a default oscilloscope
  var highest = 0;
  var index = '';
  for(var i = 0; i < allSounds.length; i++) {
    if(allSounds[i].volumeDefault > highest) {
      highest = allSounds[i].volumeDefault;
      index = [i];
    }
  }
  return index;
}

/* -----event handlers----- */

function enable() { // makes button visible after 1 second timer, allows executables to finish buffering before user can play audio
  if(event.target) {
    setTimeout(function() {
      playEl.src = './img/playbuttonborderless.png';
      playEl.disabled = false;
    }, 1250);
    playEl.addEventListener('click', startSounds);
    window.removeEventListener('load', enable);
  }
}

// TODO: create new event handler/listener that upon selection from a dropdown menu, it (1) stops current sounds, (2) clears the allSounds, audioBufferSourceNodes, and gainNodes arrays; (3) calls AudioContext.close(), (4) renders new sounds based on scene selection, (5) changes event listener and reinitializes sounds on click of the play/pause buttone, (6) changes the background video to a new video based on scene selection, (7) calls a loading function that disables the play/pause button until the rendering is complete, and (8) manipulates the DOm by overwriting slider labels with new labels from the selected scene
// TODO: consider removing the enable event handler once a loading function is created

function startSounds() { // initializes all audio assets
  for(var i = 0; i < allSounds.length; i++) {
    analyserNodes[i] = audioContext.createAnalyser(); // creates analyzer for each audio asset
    analyserNodes[i].fftSize = 2048;
    bufferLengths[i] = analyserNodes[i].frequencyBinCount;
    waveformData[i] = new Uint8Array(bufferLengths[i]);
    gainNodes[i] = audioContext.createGain(); // creates gain node for each audio asset
    audioBufferSourceNodes[i] = audioContext.createBufferSource(); // creates audio players
    audioBufferSourceNodes[i].buffer = allSounds[i].buffer; // assigns audio assets to buffers IMPORTANT: This is what binds the audio assets to every audio API node
    audioBufferSourceNodes[i].connect(gainNodes[i]).connect(analyserNodes[i]).connect(audioContext.destination); // connects audio assets to volume controls and speakers
    audioBufferSourceNodes[i].loop = true; // ensures each audio asset will loop
    audioBufferSourceNodes[i].start(); // starts all audio assets
    // musicPlayerEl.play(); beginning stages of music player
  }
  if(localStorage.sliderValues) { // checks to see if sliderValues are in localStorage
    var unstringifiedSliderValues = localStorage.getItem('sliderValues'); // gets sliderValues from localStorage
    var unstringifiedGainValues = localStorage.getItem('gainValues'); // gets gainValues from localStorage
    var pulledSliderValues = JSON.parse(unstringifiedSliderValues); // parses sliderValues from localStorage
    var pulledGainValues = JSON.parse(unstringifiedGainValues); // parses gainValues from localStorage
    for(var v = 0; v < allSounds.length; v++) {
      allSlidersEl[v].value = pulledSliderValues[v]; // assigns sliders sliderValues from localStorage
      mainSliderEl.value = pulledSliderValues[allSounds.length]; // assigns main slider sliderValue from localStorage, TODO: change to +1 when music implemented
      gainNodes[v].gain.value = (pulledGainValues[v]); // assigns gainNodes gainValues from localStorage
    }
  } else {
    defaultGainValues();
  }
  playEl.removeEventListener('click', startSounds);
  playEl.addEventListener('click', playPauseSounds);
  playEl.src = './img/pausebuttonborderless.png';
  renderOscilloscope(findIndexOfHighestGain()); // runs oscilloscope with highest gain
}

function playPauseSounds() { // stops all audio assets TODO: attempt to use a resume() function instead of stop()
  if(audioContext.state === 'running') {
    for(var i = 0; i <allSounds.length; i++) {
      audioContext.suspend();
    }
    playEl.src = './img/playbuttonborderless.png';
  } else if (audioContext.state === 'suspended') { // checks to see if audio has been paused by user
    for(var s = 0; s <allSounds.length; s++) {
      audioContext.resume();
    }
    playEl.src = './img/pausebuttonborderless.png';
  }
}

//TODO: consider rewriting adjustVolume code so that localStorage is handled more efficiently and specifically (local storage data is pulled and overwritten without using the clear() function and the associated for loops. This will produce more written code, but the browser will run less code

function adjustVolume() { // adjusts volume according to movement of the sliders, this function features the code that binds the sliders to the gainNodes gain values
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
  if(gainNodes.length !== 0) { // checks to see if gainNodes have been generated
    for(var q = 0; q < allSounds.length; q++) {
      gainNodes[q].gain.value = allSounds[q].volumeDefault; // takes values from volumeDefault and updates actual volume levels
    } // TODO: need to figure out where to store and pull volume information from music arrays
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
  if(analyserNodes.length !== 0) { // checks to see if analyserNodes have been generated
    if(event.target.id === 'slider-1') {
      renderOscilloscope(0);
    } else if(event.target.id === 'slider-2') {
      renderOscilloscope(1);
    } else if(event.target.id === 'slider-3') {
      renderOscilloscope(2);
    } else if(event.target.id === 'slider-4') {
      renderOscilloscope(3);
    } else if(event.target.id === 'slider-5') {
      renderOscilloscope(4);
    } else if(event.target.id === 'slider-6') {
      renderOscilloscope(5);
    } else if(event.target.id === 'slider-7') {
      renderOscilloscope(6);
    }
  }
}

/* -----event listers-----*/

window.addEventListener('load', enable);
slidersEl.addEventListener('input', adjustVolume);
slidersEl.addEventListener('mousedown', changeOscilloscope);

/* -----executables----- */

clearData();
renderDefaultSounds(); // preloads the default sounds on page load
