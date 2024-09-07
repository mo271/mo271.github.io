// Function to clean and extract arXiv ID from input
function cleanArxivId(input) {
    input = input.trim(); // Remove leading/trailing whitespaces

    // Case 1: If the input starts with "arXiv:", strip it
    if (input.toLowerCase().startsWith('arxiv:')) {
        input = input.slice(6).trim(); // Remove "arXiv:" and trim
    }

    // Case 2: If it's a full URL like "https://arxiv.org/abs/2312.08472" or "https://arxiv.org/pdf/2312.08472"
    if (input.startsWith('https://arxiv.org/')) {
        // Extract the part after "abs/" or "pdf/"
        const parts = input.split('/');
        input = parts[parts.length - 1]; // Get the last part of the URL (the ID)
    }

    return input;
}

// Function to extract comments from LaTeX source
function extractComments(latexSource) {
    const lines = latexSource.split('\n');
    const comments = lines.filter(line => line.trim().startsWith('%'));
    return comments.join('\n');
}

// Function to display the comments for a LaTeX file
function displayTexFile(fileName, comments) {
    const container = document.getElementById('commentsContainer');

    const fileBox = document.createElement('div');
    fileBox.style.marginBottom = '20px';

    // Display the file name directly without "File: "
    const fileNameHeader = document.createElement('h3');
    fileNameHeader.innerText = fileName;

    const commentsBox = document.createElement('pre');
    commentsBox.innerText = comments || 'No comments found.';
    commentsBox.style.backgroundColor = '#f4f4f4';
    commentsBox.style.padding = '10px';
    commentsBox.style.border = '1px solid #ddd';

    fileBox.appendChild(fileNameHeader);
    fileBox.appendChild(commentsBox);
    container.appendChild(fileBox);
}

// Function to display the abstract and compressed source links in a smaller font
function addHeaderText(arxivId, arxivLink) {
    const extractedLinksContainer = document.getElementById('extractedLinks');
    extractedLinksContainer.innerHTML = ''; // Clear previous results

    // Create a single line with both the abstract and compressed source links
    const infoText = document.createElement('p');
    infoText.style.fontSize = '0.875em'; // Smaller font size

    const absLink = `<a href="https://arxiv.org/abs/${arxivId}" target="_blank">abs/${arxivId}</a>`;
    const sourceLink = `<a href="${arxivLink}" target="_blank">compressed source</a>`;

    infoText.innerHTML = `Extracted comments from ${absLink} (${sourceLink}):`;

    extractedLinksContainer.appendChild(infoText);
}

// Function to parse .tar archive
function parseTar(tarData) {
    const files = {};
    let offset = 0;

    while (offset < tarData.length) {
        const header = tarData.slice(offset, offset + 512);

        // If the header is all zeros, we've reached the end of the archive
        if (header.every(byte => byte === 0)) {
            break;
        }

        const name = new TextDecoder().decode(tarData.slice(offset, offset + 100)).replace(/\0/g, '').trim();
        const sizeField = new TextDecoder().decode(tarData.slice(offset + 124, offset + 136)).replace(/\0/g, '').trim();

        // Parse size as an octal number
        const size = parseInt(sizeField, 8);

        if (name && size > 0) {
            const contentStart = offset + 512;
            const contentEnd = contentStart + size;
            files[name] = tarData.slice(contentStart, contentEnd);
            offset = contentEnd + (512 - (size % 512 || 512)); // Move to the next 512-byte block boundary
        } else {
            // If there's no valid file name or size, move to the next 512-byte block
            offset += 512;
        }
    }
    return files;
}

// Function to extract the original file name from GZIP header
function getOriginalGzipFileName(buffer) {
    const GZIP_FLG_FNAME = 0x08;
    let offset = 10; // GZIP header length before optional fields

    // Check the flags to see if the FNAME (original file name) field is present
    const flg = buffer[3];
    if (flg & GZIP_FLG_FNAME) {
        // The original filename starts right after the 10-byte header (or longer if extra fields are present)
        let fileName = '';
        while (buffer[offset] !== 0) {
            fileName += String.fromCharCode(buffer[offset]);
            offset++;
        }
        return fileName;
    }
    return null;
}
// Fetch the file from the arXiv link
async function fetchPaper(arxivId) {
    const arxivLink = `https://arxiv.org/e-print/${arxivId}`;
    try {
        console.log(`Fetching paper: ${arxivLink}`);
        const response = await fetch(arxivLink);

        // Handle cases where the fetch response is not OK (e.g., 404)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Error: The arXiv paper with ID "${arxivId}" could not be found (404).`);
            } else if (response.status === 403) {
                throw new Error(`Error: Access to arXiv paper with ID "${arxivId}" is forbidden (403).`);
            } else {
                throw new Error(`Error fetching the paper: ${response.statusText} (${response.status}).`);
            }
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('Content-Type');

        console.log(`Content-Type: ${contentType}`);

        // Clear the commentsContainer before processing all .tex files
        const container = document.getElementById('commentsContainer');
        container.innerHTML = ''; // Clear previous results

        // Add the abstract and source links in a single line
        addHeaderText(arxivId, arxivLink);

        // Check if the file is a PDF
        // TODO: handle more filetypes!
        if (contentType === 'application/pdf') {
            console.log('Detected PDF file');
            container.innerText = 'Error: The download is a PDF document. The LaTeX source is not available for this paper.';
            return;
        }

        if (contentType.includes('application/gzip')) {
            console.log('Detected gzipped file');
            const buffer = new Uint8Array(arrayBuffer);

            // Extract the original file name from GZIP header
            const originalFileName = getOriginalGzipFileName(buffer) || `${arxivId}.tex`;

            // Decompress GZIP to get the raw content
            const decompressed = fflate.gunzipSync(buffer);

            // Check if decompressed data is a .tar file (indicated by the "ustar" format in its header)
            const isTarFile = new TextDecoder().decode(decompressed.slice(257, 262)) === 'ustar';

            if (isTarFile) {
                console.log('Detected tar archive inside gzip');
                const tarData = parseTar(decompressed);

                // Iterate through the .tar files and display each .tex file
                for (let fileName in tarData) {
                    if (fileName.endsWith('.tex')) {
                        console.log(`Found .tex file: ${fileName}`);
                        const latexSource = new TextDecoder().decode(tarData[fileName]);
                        const comments = extractComments(latexSource);
                        displayTexFile(fileName, comments);
                    }
                }
            } else {
                // Handle a direct LaTeX file (.tex)
                console.log('Detected plain LaTeX file inside gzip');
                const latexSource = new TextDecoder().decode(decompressed);
                const comments = extractComments(latexSource);
                displayTexFile(originalFileName, comments);
            }
        } else if (contentType.includes('application/zip')) {
            console.log('Detected zip file');
            const zipData = fflate.unzipSync(new Uint8Array(arrayBuffer)); // Decompress the zip

            // Iterate through the .zip files and display each .tex file
            for (let fileName in zipData) {
                if (fileName.endsWith('.tex')) {
                    console.log(`Found .tex file: ${fileName}`);
                    const latexSource = new TextDecoder().decode(zipData[fileName]);
                    const comments = extractComments(latexSource);
                    displayTexFile(fileName, comments);
                }
            }
        } else {
            console.log('Detected plain .tex file');
            const text = new TextDecoder().decode(arrayBuffer);
            displayTexFile('Main LaTeX File', extractComments(text));
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);

        // Clear the extracted links container in case of an error
        document.getElementById('extractedLinks').innerHTML = '';

        const errorMessage = (error.message.includes("Failed to fetch"))
            ? `Error: Failed to fetch. This may be due to a CORS issue or an invalid arXiv ID ("${arxivId}").`
            : error.message;

        document.getElementById('commentsContainer').innerText = errorMessage;
    }
}
// Get query parameter value by key
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Event listener for the "Get Comments" button
document.getElementById('fetchComments').addEventListener('click', () => {
    let input = document.getElementById('arxivLink').value.trim();

    const arxivId = cleanArxivId(input);
    console.log(`Clean arxiv id: ${arxivId}`);

    const newUrl = `${window.location.pathname}?id=${arxivId}`;
    history.pushState(null, '', newUrl);

    fetchPaper(arxivId);
});

// Trigger button click on "Enter" keypress
document.getElementById('arxivLink').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('fetchComments').click();
    }
});

// Load the paper if a paper ID is in the query parameter
window.onload = function () {
    const rawArxivId = getQueryParam('id');
    if (rawArxivId) {
        document.getElementById('arxivLink').value = rawArxivId;
        const arxivId = cleanArxivId(rawArxivId);
        console.log(`Clean arxiv id from URL: ${arxivId}`);

        const newUrl = `${window.location.pathname}?id=${arxivId}`;
        history.replaceState(null, '', newUrl);

        fetchPaper(arxivId);
    }
};