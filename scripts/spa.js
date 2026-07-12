/** 
 * spa.js
 * SPA = single-page app
 * Author: Titus Ramsarran
 * Purpose: Dynamically load content and some UI functionality
 * 6/19/26
**/


// Get page elements
const contentWrapper = document.getElementById("content_wrapper");
const pageError = document.getElementById("pageError");
const pageErrorExplanation = document.getElementById("pageErrorExplanation");
const navbarLinks = document.querySelectorAll("#topNavList li a")
const hamburgerButton = document.getElementById("hamburgerButton");
const topNavList = document.getElementById("topNavList");
const loadingBar = document.getElementById("loading-bar-inner");
const photoViewerWrapper = document.getElementById("photo-viewer-wrapper");
const photoViewer = document.getElementById("photo-viewer");
const detailsWindowWrapper = document.getElementById("details-window-wrapper");
const detailsWindowContent = document.getElementById("details-window").children[0];

// Store loaded JSON
let content = null;

// Store the JavaScript of the loaded page (i.e. homepage script)
let pageScript = null;

// Load the website JSON content (volunteer opportunities, updates, etc.)
function loadData() {
    fetch('data.json')
        .then(response => {
            if(!response.ok) {
                console.error(response);
                // failure to load json
            }
            return response.json();
        })
        .then(processJSONContent)
        .catch(err => {
            console.error(err);
            // failure to load json
        });
}

// Process the JSON file
function processJSONContent(data) {
    content = data;
    document.getElementById("footer-ending").title = `v${content.version} - ${content.timestamp}`;
    document.getElementById("announcement").innerText = content.news.announcement;
}

// Single-page-app: load the requested page into the current page, between the header & footer
function loadContent(pageURL, theHash) {
    loadingBar.style.display = 'block';
    pageScript = null; // this cleans out page-specific loaded scripts
    fetch(pageURL)
        .then(response => {
            if (!response.ok) {
                // the page failed to load
                contentWrapper.innerHTML = '';
                pageError.style.display = 'block';
                pageError.innerHTML = 'The page you requested failed to load.';
                loadingBar.style.display = 'none';
                console.error(response)
            }
            return response.text();
        })
        .then(data => { // The page file was loaded
            contentWrapper.innerHTML = data;
            pageError.style.display = 'none';
            loadingBar.style.display = 'none';
            executeScriptElements();
            updateNavbar(theHash);
            showNavbarList(true);
            window.scrollTo(0,0);
        })
        .catch(err => {
            console.error(err);
            contentWrapper.innerHTML = '';
            pageError.style.display = 'block';
            pageErrorExplanation.innerHTML = 'The page you requested failed to load. <br /> An internal error occurred.';
            loadingBar.style.display = 'none';
        })
}

// Highlight the current page label in the navigation bar
function updateNavbar(theHash) {
    for(const a of navbarLinks) {
        a.classList.remove("curr");
        if(a.getAttribute('href') == theHash) {
            a.classList.add("curr");
        }
    }
}

// Detect the requested page and load it
function updatePage() {
    const theHash = window.location.hash;
    let theURL = theHash.slice(1) + '.html';
    if(theHash == '' || theHash == '#') {
        theURL = 'homepage.html';
    }
    loadContent(theURL, theHash);
}

window.addEventListener('hashchange', updatePage); // when the URL past the # gets changed
window.addEventListener('load', () => {
    updatePage(); // this loads the homepage
    loadData(); // this loads the JSON data when the page is ready
});

// because <script> tags are not executed in innerHTML insertions, iterate over each tag and clone the <script> locally so it is run
// adopted from Johannes Ewald's solution: https://stackoverflow.com/a/69190644
function executeScriptElements() {
    const scriptElements = contentWrapper.querySelectorAll("script");

    scriptElements.forEach((scriptElement) => {
        const clonedElement = document.createElement("script");
        Array.from(scriptElement.attributes).forEach((attribute) => {
            clonedElement.setAttribute(attribute.name, attribute.value);
        });
        clonedElement.text = scriptElement.text;
        scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
    });
}

// Show-hide functionality for mobile navigation bar
function showNavbarList(forceClose = false) {
    if(topNavList.classList.toggle("shown") == true && forceClose == false) {
        hamburgerButton.innerHTML = "<";
    } else {
        if(forceClose == true) { // when a new page gets loaded, close the dropdown navbar
            topNavList.classList.remove("shown");
        }
        hamburgerButton.innerHTML = "&equiv;"
    }
}

// Hide the announcement banner
function hideBanner() {
    document.getElementById("announcement-banner").style.display = 'none';
}

// Photo viewer - click to show full image functionality
function photoViewerToggle(url) {
    if(!url) { // if no URL, the close button was pressed
        photoViewerWrapper.classList.add('fade');
        setTimeout(() => { // after the fade animation ends, stop displaying it completely
            photoViewerWrapper.classList.remove('fade');
            photoViewerWrapper.style.display = 'none';
        }, 160);
    } else { // there's a URL sent to this function, it's the image being clicked
        photoViewerWrapper.classList.add('fade');
        photoViewerWrapper.style.display = 'block';
        photoViewer.style.backgroundImage = `url('${url}')`;
        setTimeout(() => {
            photoViewerWrapper.classList.remove('fade');
        }, 160);
    }
}

function detailsWindowToggle(openState) {
    if(!openState) {
        detailsWindowWrapper.classList.add('fade');
        setTimeout(() => {
            detailsWindowWrapper.classList.remove('fade');
            detailsWindowWrapper.style.display = 'none';
        }, 160);
    } else {
        detailsWindowWrapper.classList.add('fade');
        detailsWindowWrapper.style.display = 'block';
        setTimeout(() => {
            detailsWindowWrapper.classList.remove('fade');
        }, 160);
    }
}

// encodeURI
