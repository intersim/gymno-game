// creating options object to pass to our sampler
function pianoNotes () {
  var notes = arguments;
  var notesObj = {};
  for (var i = 0; i < notes.length; i++) {
    notesObj[notes[i].toLowerCase()] = "./piano/piano." + notes[i].toUpperCase() + ".ogg";
  }
  // console.log(notesObj);
  return notesObj;
}

// create instrument
var piano = new Tone.PolySynth(8, Tone.Sampler, 
  pianoNotes('d2', 'g2', 'a3', 'b3', 'cs4', 'd4', 'fs4', 'a4', 'b4', 'cs5', 'd5', 'fs5', 'g5', 'a5')
  ).toMaster();

// change time signature - default is 4/4, we want 3/4; the denominator is always 4)
Tone.Transport.timeSignature = 3;

// change Tone.Transport's tempo from the default 120 bpm to "lent" (slow)
Tone.Transport.bpm.rampTo(70);

// left hand, repeating pattern
  // 1st measure
Tone.Transport.scheduleRepeat(function () {
  piano.triggerAttack('g2');
}, "2m", "0:0:0");

Tone.Transport.scheduleRepeat(function () {
  piano.triggerAttack(['b3','d4','fs4']);
}, "2m", "0:1:0");

// left hand, repeating pattern
  // 2nd measure
Tone.Transport.scheduleRepeat(function () {
  piano.triggerAttack('d2');
}, "2m", "1:0:0");

Tone.Transport.scheduleRepeat(function () {
  piano.triggerAttack(['a3','cs4','fs4']);
}, "2m", "1:1:0");

// right hand, melody
var melody = new Tone.Sequence(function(time, note) {
  piano.triggerAttack(note);
  if (note === 'a4') {
    Tone.Transport.stop();
    melody.stop();
  }
}, ['fs5', 'a5', 'g5', 'fs5', 'cs5', 'b4', 'cs5', 'd5', 'a4'], '4n');

// game starts here
$('#music').hide();

var myNotes = [];

var buttons = {
  1: 'fs5',
  2: 'a5',
  3: 'g5',
  4: 'cs5',
  5: 'b4',
  6: 'd5',
  7: 'a4'
};

function checkArr (arr) {
  var condition = arr.toString().substr(-17, 17) == [ 1, 2, 3, 1, 4, 5, 4, 6, 7 ].toString();
  if (condition) {
    Tone.Transport.start();
  }
}

function clickHandler (key) {
  return function () {
    piano.triggerAttack(buttons[key]);
    myNotes.push(key);
    checkArr(myNotes);
  };
}

for (var i = 1; i < 8; i++) {
  $('#' + i).click(clickHandler(i));
}

// start Transport
$('#play').click(function () {
  Tone.Transport.start();
  melody.start('4:1:0');
});

$('#stop').click(function () {
  Tone.Transport.stop();
});
