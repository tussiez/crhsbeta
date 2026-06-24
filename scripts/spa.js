/** 
 * spa.js
 * SPA = single-page app
 * Author: Titus Ramsarran
 * Purpose: Dynamically load content and some UI functionality
 * 6/19/26
**/

const contentWrapper = document.getElementById("content_wrapper");
const pageError = document.getElementById("pageError");
const pageErrorExplanation = document.getElementById("pageErrorExplanation");
const navbarLinks = document.querySelectorAll("#topNavList li a")
const hamburgerButton = document.getElementById("hamburgerButton");
const topNavList = document.getElementById("topNavList");
const loadingBar = document.getElementById("loading-bar-inner");
const photoViewerWrapper = document.getElementById("photo-viewer-wrapper");
const photoViewer = document.getElementById("photo-viewer");

let pageScript = null;
let content = undefined;

function loadData() {
    fetch('data.json')
        .then(response => {
            if(!response.ok) {
                console.error(response);
                // failure to load json
            }
            return response.json();
        })
        .then(data => {
            // got the json output?
            content = data;
            console.log(data);
        })
        .catch(err => {
            console.error(err);
            // failure to load json
        });
}

function loadContent(pageURL, theHash) {
    loadingBar.style.display = 'block';
    pageScript = null; // clean out page-specific loaded scripts
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
        .then(data => {
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

function updateNavbar(theHash) {
    for(const a of navbarLinks) {
        a.classList.remove("curr");
        if(a.getAttribute('href') == theHash) {
            a.classList.add("curr");
        }
    }
}

function updatePage() {
    const theHash = window.location.hash;
    let theURL = theHash.slice(1) + '.html';
    if(theHash == '' || theHash == '#') {
        theURL = 'homepage.html';
    }
    loadContent(theURL, theHash);
}

window.addEventListener('hashchange', updatePage);
window.addEventListener('load', () => {
    updatePage();
    loadData();
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


function showNavbarList(forceClose = false) {
    if(topNavList.classList.toggle("shown") == true && forceClose == false) {
        hamburgerButton.innerHTML = "<";
    } else {
        if(forceClose == true) {
            topNavList.classList.remove("shown");
        }
        hamburgerButton.innerHTML = "&equiv;"
    }
}

function hideBanner() {
    document.getElementById("announcement-banner").style.display = 'none';
}

function photoViewerToggle(url) {
    if(!url) {
        photoViewerWrapper.classList.add('fade');
        setTimeout(() => {
            photoViewerWrapper.classList.remove('fade');
            photoViewerWrapper.style.display = 'none';
        }, 160);
    } else {
        photoViewerWrapper.classList.add('fade');
        photoViewerWrapper.style.display = 'block';
        photoViewer.style.backgroundImage = url;
        setTimeout(() => {
            photoViewerWrapper.classList.remove('fade');
        }, 160);
    }
}

// encodeURI
