const Vex = window.Vex;

const staffContainer = document.getElementById('staff-container');
const keyNameDisplay = document.getElementById('key-name');

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

function displayRandomKey() {
    staffContainer.innerHTML = ''; // Clear previous staff

    const renderer = new Vex.Flow.Renderer(staffContainer, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(300, 120);
    const context = renderer.getContext();
    context.scale(0.9, 0.9);

    const randomIndex = Math.floor(Math.random() * keyOptions.length);
    const selectedKey = keyOptions[randomIndex];

    const stave = new Vex.Flow.Stave(10, 0, 280);
    stave.addClef('treble').addKeySignature(selectedKey.value);
    stave.setContext(context).draw();

    keyNameDisplay.textContent = selectedKey.text;
}

// Initial display
displayRandomKey();

// Update on click
document.body.addEventListener('click', displayRandomKey);
