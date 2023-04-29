// Import the WebMidi and VexFlow libraries
const WebMidi = window.WebMidi;
const Vex = window.Vex;

// Set up VexFlow rendering
const staffContainer = document.getElementById('staff-container');
const renderer = new Vex.Flow.Renderer(staffContainer, Vex.Flow.Renderer.Backends.SVG);
renderer.resize(staffContainer.clientWidth, staffContainer.clientHeight);
const context = renderer.getContext();

// key selection handling
const keyOptions = [
  { value: 'Cb', text: 'C♭ Major / a♭ minor' },
  { value: 'Gb', text: 'G♭ Major / e♭ minor' },
  { value: 'Db', text: 'D♭ Major / b♭ minor' },
  { value: 'Ab', text: 'A♭ Major / f minor' },
  { value: 'Eb', text: 'E♭ Major / c minor' },
  { value: 'Bb', text: 'B♭ Major / g minor' },
  { value: 'F', text: 'F Major / d minor' },
  { value: 'C', text: 'C Major / a minor' },
  { value: 'G', text: 'G Major / e minor' },
  { value: 'D', text: 'D Major / b minor' },
  { value: 'A', text: 'A Major / f♯ minor' },
  { value: 'E', text: 'E Major / c♯ minor' },
  { value: 'B', text: 'B Major / g♯ minor' },
  { value: 'F#', text: 'F♯ Major / d♯ minor' },
  { value: 'C#', text: 'C♯ Major / a♯ minor' },
];
function getKeySignatures() {
  return keyOptions.map(option => option.value);
}
const keySignatures = getKeySignatures();

let pressedKeys = [];
let notes = [];
let currentKeyIndex = 7;
let keySignature = keyOptions[currentKeyIndex]['value'];

function updateSelectedKey() {
  const selectedKey = keyOptions[currentKeyIndex];
  keySignature = selectedKey['value'];
  renderNotes(notes, keySignature);
  //document.getElementById('selected-key').innerText = selectedKey.text;

  // Enable or disable arrows based on the current key
  document.getElementById('prev-key').style.opacity = currentKeyIndex <= 0 ? 0.5 : 1;
  document.getElementById('prev-key').style.pointerEvents = currentKeyIndex <= 0 ? 'none' : 'auto';

  document.getElementById('next-key').style.opacity = currentKeyIndex >= keyOptions.length - 1 ? 0.5 : 1;
  document.getElementById('next-key').style.pointerEvents = currentKeyIndex >= keyOptions.length - 1 ? 'none' : 'auto';
}

document.getElementById('prev-key').addEventListener('click', () => {
  if (currentKeyIndex > 0) {
    currentKeyIndex = (currentKeyIndex - 1 + keyOptions.length) % keyOptions.length;
    updateSelectedKey();
  }
});

document.getElementById('next-key').addEventListener('click', () => {
  if (currentKeyIndex < keyOptions.length - 1) {
    currentKeyIndex = (currentKeyIndex + 1) % keyOptions.length;
    updateSelectedKey();
  }
});

// Initialize the arrows to the correct state
updateSelectedKey();

// MIDI handling
function midiReady(midiAccess) {
  // Log connected MIDI devices
  console.log("Connected MIDI devices:");
  midiAccess.inputs.forEach((input) => {
    console.log("ID:", input.id, "Name:", input.name, "Manufacturer:", input.manufacturer);
  });

  // Start listening to MIDI messages
  for (const input of midiAccess.inputs.values()) {
    input.onmidimessage = midiMessageReceived;
  }
}



function renderNotes(notes, keySignature) {
  const keySignatureIndex = keySignatures.indexOf(keySignature);
  const keyDeviation = keySignatureIndex - 7;
  const sharps = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
  const flats = sharps.slice().reverse();
  console.log(keyDeviation);
  accidentals = keyDeviation >= 0 ? sharps.slice(0, keyDeviation) : flats.splice(0, -keyDeviation);
  // Clear the canvas and create a new renderer
  console.log(keySignature);
  const ctx = renderer.getContext();
  ctx.clear();

   // Update staveWidth and staveIndent based on the staffContainer width
  const staveWidth = staffContainer.clientWidth * 0.6; // Adjust the multiplier as needed
  const staveIndent = (staffContainer.clientWidth - staveWidth) / 2;

  // Calculate the vertical positions of the staves
  const containerHeight = staffContainer.clientHeight;
  const stavesHeight = containerHeight * 0.9;
  const spaceBetweenStaves = stavesHeight * 0.1;
  const trebleStaveY = (containerHeight - stavesHeight);
  const bassStaveY = trebleStaveY + stavesHeight * 0.25 + spaceBetweenStaves;

  // Calculate scale based on the staffContainer height
  const defaultStaffHeight = 120; // The default height of a staff in VexFlow
  const targetStaffHeight = stavesHeight * 0.5;
  const scale = targetStaffHeight / defaultStaffHeight;

  const trebleStave = new Vex.Flow.Stave(staveIndent / scale, trebleStaveY / scale, staveWidth / scale);
  trebleStave.addClef('treble').addKeySignature(keySignature).setContext(ctx).draw();
  const bassStave = new Vex.Flow.Stave(staveIndent / scale, bassStaveY / scale, staveWidth / scale);
  bassStave.addClef('bass').addKeySignature(keySignature).setContext(ctx).draw();

  // Reset the context scale
  ctx.scale(scale, scale);

  // If notes is empty, exit early without doing any rendering
  if (notes.length === 0) {
    return;
  }


  // Separate notes into treble and bass clef notes
  const trebleNotes = notes.filter(note => parseInt(note.split('/')[1]) > 3);
  const bassNotes = notes.filter(note => parseInt(note.split('/')[1]) <= 3);

  function createChordWithAccidentals(noteNames, clef) {
    // Create a new StaveNote for the chord
    const ghostNote = new Vex.Flow.GhostNote({
      duration: 'q',
      width: 15,
    });
    console.log("noteNames:", noteNames);
    const chord = new Vex.Flow.StaveNote({
      keys: noteNames,
      duration: 'q',
      clef: clef,
    });

    //chord.setExtraLeftPx(100);
    console.log("accidentals", accidentals);
    // Add accidentals to the chord
    for (const [index, noteName] of noteNames.entries()) {
      if (noteName.includes('#') && (keyDeviation <= 0 | !accidentals.includes(noteName[0]))) {
        chord.addAccidental(index, new Vex.Flow.Accidental('#'));
      }
      if (noteName.includes('b') && (keyDeviation >= 0 | !accidentals.includes(noteName[0]))) {
        chord.addAccidental(index, new Vex.Flow.Accidental('b'));
      }
      if (noteName.includes('n')) {
        chord.addAccidental(index, new Vex.Flow.Accidental('n'));
      }
      if (noteName.includes('##')) {
        chord.addAccidental(index, new Vex.Flow.Accidental('##'));
      }
      if (noteName.includes('bb')) {
        chord.addAccidental(index, new Vex.Flow.Accidental('bb'));
      }
    }
    // Create a voice and add the chord

    const voice = new Vex.Flow.Voice({ num_beats: 2, beat_value: 4 });
    voice.addTickables([ghostNote, chord]);
    return voice
  }


  if (trebleNotes.length > 0) {
    const formatter = new Vex.Flow.Formatter();
    trebleVoice = createChordWithAccidentals(trebleNotes, "treble")
    formatter.joinVoices([trebleVoice]);
    formatter.formatToStave([trebleVoice], trebleStave);
    trebleVoice.draw(ctx, trebleStave);
  }
  if (bassNotes.length > 0) {
    const formatter = new Vex.Flow.Formatter();
    bassVoice = createChordWithAccidentals(bassNotes, "bass")
    formatter.joinVoices([bassVoice]);
    formatter.formatToStave([bassVoice], bassStave);
    bassVoice.draw(ctx, bassStave);
  }
}
function toEnharmonic(noteIndex, useSharps, keySignatureIndex) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  if (notes[noteIndex] === 'E' && keySignatureIndex === 0) {
    return 'Fb';
  }
  if (notes[noteIndex] === 'B' && keySignatureIndex <= 1) {
    return 'Cb';
  }
  if (notes[noteIndex] === 'F' && keySignatureIndex >= 13) {
    return 'E#';
  }
  if (notes[noteIndex] === 'C' && keySignatureIndex === 14) {
    return 'B#';
  }
  return useSharps ? notes[noteIndex] : flats[noteIndex];
}

function adjustAccidental(note, adjustment) {
  const noteWithoutAccidental = note.replace(/#|b|n/g, '');
  const accidentalCount = (note.match(/#/g) || []).length - (note.match(/b/g) || []).length + adjustment;
  if (accidentalCount === 0) return noteWithoutAccidental + 'n';
  if (accidentalCount > 0) return noteWithoutAccidental + '#'.repeat(accidentalCount);
  if (accidentalCount < 0) return noteWithoutAccidental + 'b'.repeat(-accidentalCount);
}
function getNoteIndex(note) {
  const notes = ['C', '_', 'D', '_', 'E', 'F', '_', 'G', '_', 'A', '_', 'B'];
  const accidentals = {
    'bb': -2,
    'b': -1,
    'n': 0,
    '#': 1,
    '##': 2
  };

  let baseNote = note[0].toUpperCase();
  let accidental = note.slice(1).toLowerCase();
  let index = notes.indexOf(baseNote);
  let adjustment = accidentals[accidental] || 0;

  return (index + adjustment + 12) % 12;
}

function generateChromaticScale(scale, adjustment, keySignatureIndex) {
  const chromaticScale = [];
  for (let i = 0; i < scale.length; i++) {
    const note = scale[i];
    chromaticScale.push(note);

    if (i < scale.length - 1) {
      const nextNote = scale[i + 1];
      const useSharps = adjustment > 0;

      if (adjustment > 0) {
        const adjustedNote = adjustAccidental(note, adjustment);
        const nextNoteIndex = getNoteIndex(nextNote);
        const adjustedNoteIndex = getNoteIndex(adjustedNote);
        if (nextNoteIndex != adjustedNoteIndex) {
          chromaticScale.push(adjustedNote);
        }
      } else if (adjustment < 0) {
        const adjustedNextNote = adjustAccidental(nextNote, adjustment);
        const noteIndex = getNoteIndex(note);
        const adjustedNextNoteIndex = getNoteIndex(adjustedNextNote);
        if (noteIndex != adjustedNextNoteIndex) {
          chromaticScale.push(adjustedNextNote);
        }
      }
    }
  }

  return chromaticScale;
}


function twoScales(keySignature) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const scale = [];
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  const keySignatureIndex = keySignatures.indexOf(keySignature);
  let useSharps = keySignatureIndex >= 7;

  let noteIndex = keySignature === 'Cb' ? 11 : (useSharps ? notes : flats).indexOf(keySignature);
  console.log(keySignature);
  console.log(noteIndex);
  for (let i = 0; i < intervals.length; i++) {
    // const note = (useSharps ? notes : flats)[noteIndex];
    scale.push(toEnharmonic(noteIndex, useSharps, keySignatureIndex));
    noteIndex = (noteIndex + intervals[i]) % 12;
  }
  return {
    flatScale: generateChromaticScale(scale, -1, keySignatureIndex),
    sharpScale: generateChromaticScale(scale, 1, keySignatureIndex)
  };
}

function midiNoteNumberToName(noteNumbers, keySignature) {
  const { flatScale: flatNoteNames, sharpScale: sharpNoteNames } = twoScales(keySignature);
  const keySignatureIndex = keySignatures.indexOf(keySignature);

  const transposition = ((keySignatureIndex - 7) * 7) % 12;
  console.log(flatNoteNames);
  console.log(sharpNoteNames);
  console.log(transposition);

  function scoreNotes(transposedNotes, sharp) {
    const sharpScores = [-5, 2, -3, 4, -1, -6, 1, -4, 3, -2, 5, 0];
    const flatScores = [-1, 4, -3, 2, -5, 0, 5, -2, 3, -4, 1, -6];

    let score = 0;
    for (let note of transposedNotes) {
      const noteMod12 = note % 12;

      if (sharp) {
        score += Math.abs(sharpScores[noteMod12]);
      } else {
        score += Math.abs(flatScores[noteMod12]);
      }
    }

    return score;
  }
  let sharpNamesList = [];
  let flatNamesList = [];
  let noteNumberList = [];
  console.log(noteNumbers);
  const transposedNoteNumbers = noteNumbers.map((noteNumber) => noteNumber - transposition);
  console.log(transposedNoteNumbers);
  transposedNoteNumbers.sort();
  for (let transposedNoteNumber of transposedNoteNumbers) {
    const octave = Math.floor((transposedNoteNumber + transposition) / 12) - 1;
    const sharpNoteName = sharpNoteNames[transposedNoteNumber % 12];
    const flatNoteName = flatNoteNames[transposedNoteNumber % 12];
    noteNumberList.push(transposedNoteNumber % 12);
    console.log("s", sharpNoteName);
    sharpNamesList.push(sharpNoteName + '/' +
        (octave - ('B#' == sharpNoteName && (keySignatureIndex != 14) ? 1 : 0)));
    flatNamesList.push(flatNoteName + '/' +
        (octave + ('Cb' == flatNoteName && (keySignatureIndex != 0) ? 1 : 0)));
  }
  console.log("noteNumberList", noteNumberList);
  const sharpScore = scoreNotes(noteNumberList, true);
  const flatScore = scoreNotes(noteNumberList, false);
  console.log("flat:", flatScore, "sharp:", sharpScore);
  if (sharpScore < flatScore) {
    return sharpNamesList;
  } else if (sharpScore > flatScore) {
    return flatNamesList;
  } else {
    // Choose randomly between sharp and flat lists in case of a tie
    return Math.random() < 0.5 ? sharpNamesList : flatNamesList;
  }
}

function midiMessageReceived(event) {
  const NOTE_ON = 0x90;
  const NOTE_OFF = 0x80;

  const cmd = event.data[0] & 0xF0;
  const noteNumber = event.data[1];
  const velocity = event.data[2];

  const vexMusic = new Vex.Flow.Music();

  if (cmd === NOTE_ON && velocity > 0) {
    if (!pressedKeys.includes(noteNumber)) {
      pressedKeys.push(noteNumber);
    }
  } else if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
    pressedKeys = pressedKeys.filter((note) => note !== noteNumber);
  }
  // sorting keys here, because when adding the accidentals this order is assumed
  pressedKeys.sort();
  notes = midiNoteNumberToName(pressedKeys, keySignature);
  console.log("notes", notes);
  renderNotes(notes, keySignature);
}

function onMIDIFailure() {
  console.error('Could not access your MIDI devices.');
}

// Initialize MIDI handling and keep track of currently pressed notes

navigator.requestMIDIAccess().then(midiReady, onMIDIFailure);
