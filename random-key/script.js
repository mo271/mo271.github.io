const Vex = window.Vex;

const staffContainer = document.getElementById('staff-container');
const keyNameDisplay = document.getElementById('key-name');

const keyOptions = [
  // Major Keys
  { keySig: 'Cb', name: 'C♭' }, { keySig: 'Gb', name: 'G♭' }, { keySig: 'Db', name: 'D♭' },
  { keySig: 'Ab', name: 'A♭' }, { keySig: 'Eb', name: 'E♭' }, { keySig: 'Bb', name: 'B♭' },
  { keySig: 'F', name: 'F' }, { keySig: 'C', name: 'C' }, { keySig: 'G', name: 'G' },
  { keySig: 'D', name: 'D' }, { keySig: 'A', name: 'A' }, { keySig: 'E', name: 'E' },
  { keySig: 'B', name: 'B' }, { keySig: 'F#', name: 'F♯' }, { keySig: 'C#', name: 'C♯' },
  // Minor Keys
  { keySig: 'Cb', name: 'a♭' }, { keySig: 'Gb', name: 'e♭' }, { keySig: 'Db', name: 'b♭' },
  { keySig: 'Ab', name: 'f' }, { keySig: 'Eb', name: 'c' }, { keySig: 'Bb', name: 'g' },
  { keySig: 'F', name: 'd' }, { keySig: 'C', name: 'a' }, { keySig: 'G', name: 'e' },
  { keySig: 'D', name: 'b' }, { keySig: 'A', name: 'f♯' }, { keySig: 'E', name: 'c♯' },
  { keySig: 'B', name: 'g♯' }, { keySig: 'F#', name: 'd♯' }, { keySig: 'C#', name: 'a♯' },
];

function displayRandomKey() {
    staffContainer.innerHTML = ''; // Clear previous staff

    const containerWidth = staffContainer.clientWidth;
    const containerHeight = staffContainer.clientHeight;

    const renderer = new Vex.Flow.Renderer(staffContainer, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(containerWidth, containerHeight);
    const context = renderer.getContext();

    const staveWidth = containerWidth * 0.35; // Further reduced width
    const staveX = (containerWidth - staveWidth) / 2;
    const staveY = containerHeight * 0.1; // Adjust vertical position

    // Scale to fit the staff nicely within the container height
    const scale = containerHeight / 150; // Adjust 150 based on visual needs
    context.scale(scale, scale);

    const randomIndex = Math.floor(Math.random() * keyOptions.length);
    const selectedKey = keyOptions[randomIndex];

    const stave = new Vex.Flow.Stave(staveX / scale, staveY / scale, staveWidth / scale);
    stave.addClef('treble').addKeySignature(selectedKey.keySig);
    stave.setContext(context).draw();

    keyNameDisplay.textContent = selectedKey.name;
}

// Initial display
displayRandomKey();

// Update on click or resize
document.body.addEventListener('click', displayRandomKey);
window.addEventListener('resize', displayRandomKey);
