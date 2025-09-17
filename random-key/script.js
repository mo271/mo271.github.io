const Vex = window.Vex;

const staffContainer = document.getElementById('staff-container');
const keyNameDisplay = document.getElementById('key-name');
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const majorKeysContainer = document.getElementById('major-keys-container');
const minorKeysContainer = document.getElementById('minor-keys-container');

const keyOptions = [
  // Major Keys
  { keySig: 'Cb', name: 'C♭', type: 'major' }, { keySig: 'Gb', name: 'G♭', type: 'major' }, { keySig: 'Db', name: 'D♭', type: 'major' },
  { keySig: 'Ab', name: 'A♭', type: 'major' }, { keySig: 'Eb', name: 'E♭', type: 'major' }, { keySig: 'Bb', name: 'B♭', type: 'major' },
  { keySig: 'F', name: 'F', type: 'major' }, { keySig: 'C', name: 'C', type: 'major' }, { keySig: 'G', name: 'G', type: 'major' },
  { keySig: 'D', name: 'D', type: 'major' }, { keySig: 'A', name: 'A', type: 'major' }, { keySig: 'E', name: 'E', type: 'major' },
  { keySig: 'B', name: 'B', type: 'major' }, { keySig: 'F#', name: 'F♯', type: 'major' }, { keySig: 'C#', name: 'C♯', type: 'major' },
  // Minor Keys
  { keySig: 'Cb', name: 'a♭', type: 'minor' }, { keySig: 'Gb', name: 'e♭', type: 'minor' }, { keySig: 'Db', name: 'b♭', type: 'minor' },
  { keySig: 'Ab', name: 'f', type: 'minor' }, { keySig: 'Eb', name: 'c', type: 'minor' }, { keySig: 'Bb', name: 'g', type: 'minor' },
  { keySig: 'F', name: 'd', type: 'minor' }, { keySig: 'C', name: 'a', type: 'minor' }, { keySig: 'G', name: 'e', type: 'minor' },
  { keySig: 'D', name: 'b', type: 'minor' }, { keySig: 'A', name: 'f♯', type: 'minor' }, { keySig: 'E', name: 'c♯', type: 'minor' },
  { keySig: 'B', name: 'g♯', type: 'minor' }, { keySig: 'F#', name: 'd♯', type: 'minor' }, { keySig: 'C#', name: 'a♯', type: 'minor' },
];

let allowedKeys = [...keyOptions]; // By default, all keys are allowed

function populateSidebar() {
    majorKeysContainer.innerHTML = '';
    minorKeysContainer.innerHTML = '';

    keyOptions.forEach(key => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = key.name;
        checkbox.checked = allowedKeys.some(ak => ak.name === key.name);
        checkbox.addEventListener('change', updateAllowedKeys);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(key.name));

        if (key.type === 'major') {
            majorKeysContainer.appendChild(label);
        } else {
            minorKeysContainer.appendChild(label);
        }
    });
}

function updateAllowedKeys() {
    const checkboxes = sidebar.querySelectorAll('input[type="checkbox"]');
    allowedKeys = keyOptions.filter(key => {
        return Array.from(checkboxes).find(cb => cb.value === key.name && cb.checked);
    });
    if (allowedKeys.length === 0) {
        // Prevent a state where no keys are selected, re-enable all
        checkboxes.forEach(cb => cb.checked = true);
        allowedKeys = [...keyOptions];
        alert("At least one key must be selected.");
    }
    // TODO: Save to localStorage
    displayRandomKey(); // Update display with new set of keys
}

function displayRandomKey() {
    if (allowedKeys.length === 0) {
        keyNameDisplay.textContent = "No keys selected";
        staffContainer.innerHTML = '';
        return;
    }
    staffContainer.innerHTML = ''; // Clear previous staff

    const containerWidth = staffContainer.clientWidth;
    const containerHeight = staffContainer.clientHeight;

    const renderer = new Vex.Flow.Renderer(staffContainer, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(containerWidth, containerHeight);
    const context = renderer.getContext();

    const baseWidth = containerWidth * 0.8;
    const staveWidth = Math.max(250, Math.min(baseWidth, 575)); // Min 250px, Max 575px
    const staveX = (containerWidth - staveWidth) / 2;
    const staveY = containerHeight * 0.1; // Adjust vertical position

    const scale = containerHeight / 150; 
    context.scale(scale, scale);

    const randomIndex = Math.floor(Math.random() * allowedKeys.length);
    const selectedKey = allowedKeys[randomIndex];

    const stave = new Vex.Flow.Stave(staveX / scale, staveY / scale, staveWidth / scale);
    stave.addClef('treble').addKeySignature(selectedKey.keySig);
    stave.setContext(context).draw();

    keyNameDisplay.textContent = getLocalizedKeyName(selectedKey.name);
}

function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en';
}

function getLocalizedKeyName(keyName) {
    const lang = getBrowserLanguage();
    if (lang.startsWith('de')) {
        if (keyName === 'B') return 'H';
        if (keyName === 'B♭') return 'B';
        if (keyName === 'b') return 'h'; // minor
        if (keyName === 'b♭') return 'b'; // minor
    }
    return keyName;
}

// Sidebar toggle
menuBtn.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

// Select All/None buttons
document.querySelectorAll('.select-all').forEach(button => {
    button.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const container = type === 'major' ? majorKeysContainer : minorKeysContainer;
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        updateAllowedKeys();
    });
});

document.querySelectorAll('.select-none').forEach(button => {
    button.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const container = type === 'major' ? majorKeysContainer : minorKeysContainer;
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        updateAllowedKeys();
    });
});

// Screen Wake Lock
let wakeLock = null;

const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released');
      });
      console.log('Screen Wake Lock is active');
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
};

const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    requestWakeLock();
  } else {
    releaseWakeLock();
  }
});

window.addEventListener('beforeunload', releaseWakeLock);

// Initial setup
populateSidebar();
displayRandomKey();
requestWakeLock(); // Request wake lock on load

// Update on click or resize
staffContainer.addEventListener('click', displayRandomKey);
keyNameDisplay.addEventListener('click', displayRandomKey);
window.addEventListener('resize', displayRandomKey);
