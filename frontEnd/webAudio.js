var audioArray;
var context = new(window.AudioContext || window.webkitAudioContext)();
var audioFileBuffer;
var audioFileBuffer2;
var gainNode;
var source

function Play() {

  var request = new XMLHttpRequest();

  request.open('GET', 'http://localhost:8080/cosine_110hz.wav', true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioArray = request.response.slice(0);
    context.decodeAudioData(request.response, function(buffer) {
      audioFileBuffer = buffer;
      context.decodeAudioData(audioArray, function(buffer2) {
        audioFileBuffer2 = buffer;
        FileLoaded();
      })
    }, function() { console.log("error") });


  };
  request.send();

  function FileLoaded() {
    console.log("Play");

    gainNode = context.createGain();
    source = context.createBufferSource();
    source.buffer = audioFileBuffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);

    let track1Start = context.currentTime;
    let fadeDuration = .2599999;
    let PlayDuration = 2;
    let fadeOutStart = track1Start + PlayDuration;

    timeOfStart = track1Start;
    source.start(track1Start);
    gainNode.gain.setValueAtTime(0, track1Start);
    console.log("start Time: " + context.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, track1Start + fadeDuration);

    setTimeout(Crossfade, 1000);
  }
}

var timeOfStart;


function Crossfade() {
  console.log('crossfade function');
  var request = new XMLHttpRequest();

  request.open('GET', 'http://localhost:8080/cosine_110hz.wav', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {

      console.log("track received.");
      let track1Start = context.currentTime + 1 + .10;
      let fadeDuration = .25;
      let fadeOutStart = track1Start;
      var gainNode2 = context.createGain();
      var source2 = context.createBufferSource();

      source2.buffer = buffer;
      source2.connect(gainNode2);
      gainNode2.connect(context.destination);


      gainNode.gain.setValueAtTime(1, track1Start);
      gainNode.gain.linearRampToValueAtTime(0, track1Start + fadeDuration);
      source.stop(track1Start + fadeDuration);


      gainNode2.gain.setValueAtTime(0, track1Start);
      gainNode2.gain.linearRampToValueAtTime(1, track1Start + fadeDuration);
      source2.start(track1Start, 0);

      timeOfStart = track1Start;
      gainNode = gainNode2;
      source = source2;
      setTimeout(Crossfade, 1000);
    })
  }
  request.send();
}