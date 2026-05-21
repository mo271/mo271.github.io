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

// URL-safe key ID: keySig for major, keySig + 'm' for minor (e.g. "C", "Abm")
function keyToId(key) {
    return key.type === 'minor' ? key.keySig + 'm' : key.keySig;
}

function idToKey(id) {
    const isMinor = id.endsWith('m') && id.length > 1;
    const sig = isMinor ? id.slice(0, -1) : id;
    const type = isMinor ? 'minor' : 'major';
    return keyOptions.find(k => k.keySig === sig && k.type === type) || null;
}

let allowedKeys = [...keyOptions]; // By default, all keys are allowed

// --- URL parameter handling ---

function readStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    // Read keys
    const keysParam = params.get('keys');
    if (keysParam !== null) {
        const ids = keysParam.split(',').map(s => s.trim()).filter(Boolean);
        const parsed = ids.map(idToKey).filter(k => k !== null);
        if (parsed.length > 0) {
            allowedKeys = parsed;
        }
    }

    // Read auto-change
    const autoParam = params.get('auto');
    const intervalParam = params.get('interval');

    return { autoParam, intervalParam };
}

function updateURL() {
    const params = new URLSearchParams();

    // Only store keys if not all selected
    const allSelected = allowedKeys.length === keyOptions.length &&
        keyOptions.every(k => allowedKeys.some(ak => ak.name === k.name));
    if (!allSelected) {
        params.set('keys', allowedKeys.map(keyToId).join(','));
    }

    // Auto-change
    if (autoChangeToggle.checked) {
        params.set('auto', '1');
        const seconds = parseFloat(intervalInput.value) || 1;
        if (seconds !== 1) {
            params.set('interval', seconds.toString());
        }
    }

    const qs = params.toString();
    const newURL = window.location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', newURL);
}

// --- End URL parameter handling ---

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
        label.appendChild(document.createTextNode(getLocalizedKeyName(key.name)));

        if (key.type === 'major') {
            majorKeysContainer.appendChild(label);
        } else {
            minorKeysContainer.appendChild(label);
        }
    });
}

function updateAllowedKeys() {
    const checkboxes = sidebar.querySelectorAll('.key-group input[type="checkbox"]');
    allowedKeys = keyOptions.filter(key => {
        return Array.from(checkboxes).find(cb => cb.value === key.name && cb.checked);
    });
    if (allowedKeys.length === 0) {
        // Prevent a state where no keys are selected, re-enable all
        checkboxes.forEach(cb => cb.checked = true);
        allowedKeys = [...keyOptions];
        alert("At least one key must be selected.");
    }
    updateURL();
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

// Auto-change timer
const autoChangeToggle = document.getElementById('auto-change-toggle');
const intervalRange = document.getElementById('interval-range');
const intervalInput = document.getElementById('interval-input');
const intervalControl = document.getElementById('interval-control');

let autoChangeTimer = null;

function startAutoChange() {
    stopAutoChange();
    const seconds = parseFloat(intervalInput.value) || 1;
    autoChangeTimer = setInterval(displayRandomKey, seconds * 1000);
}

function stopAutoChange() {
    if (autoChangeTimer !== null) {
        clearInterval(autoChangeTimer);
        autoChangeTimer = null;
    }
}

function setAutoChangeUI(enabled) {
    autoChangeToggle.checked = enabled;
    if (enabled) {
        intervalControl.classList.add('active');
        startAutoChange();
    } else {
        intervalControl.classList.remove('active');
        stopAutoChange();
    }
}

autoChangeToggle.addEventListener('change', () => {
    setAutoChangeUI(autoChangeToggle.checked);
    updateURL();
});

// Keep range and number inputs in sync, restart timer on change
intervalRange.addEventListener('input', () => {
    intervalInput.value = intervalRange.value;
    if (autoChangeToggle.checked) startAutoChange();
    updateURL();
});

intervalInput.addEventListener('input', () => {
    const val = parseFloat(intervalInput.value);
    if (val >= 0.5 && val <= 60) {
        intervalRange.value = Math.min(val, 10); // clamp range slider
        if (autoChangeToggle.checked) startAutoChange();
        updateURL();
    }
});

// Copy link button
const copyLinkBtn = document.getElementById('copy-link-btn');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        updateURL();
        navigator.clipboard.writeText(window.location.href).then(() => {
            const orig = copyLinkBtn.textContent;
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(() => copyLinkBtn.textContent = orig, 1500);
        });
    });
}

// --- Initialization ---

// Read URL params before populating UI
const { autoParam, intervalParam } = readStateFromURL();

populateSidebar();
displayRandomKey();
requestWakeLock();

// Apply auto-change settings from URL
if (intervalParam !== null) {
    const val = parseFloat(intervalParam);
    if (val >= 0.5 && val <= 60) {
        intervalInput.value = val;
        intervalRange.value = Math.min(val, 10);
    }
}
if (autoParam === '1') {
    setAutoChangeUI(true);
}

// Update on click or resize
staffContainer.addEventListener('click', displayRandomKey);
keyNameDisplay.addEventListener('click', displayRandomKey);
window.addEventListener('resize', displayRandomKey);
