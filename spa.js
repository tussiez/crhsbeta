/** 
 * spa.js
 * SPA = single-page app
 * Author: Titus Ramsarran
 * Purpose: Dynamically load content and some UI functionality
 * 6/4/26
**/

const contentWrapper = document.getElementById("content_wrapper");
const pageError = document.getElementById("pageError");
const pageErrorExplanation = document.getElementById("pageErrorExplanation");
const navbarLinks = document.querySelectorAll("#topNavList li a")
const hamburgerButton = document.getElementById("hamburgerButton");
const topNavList = document.getElementById("topNavList");

function loadContent(pageURL, theHash) {
    fetch(pageURL)
        .then(response => {
            if (!response.ok) {
                // the page failed to load
                contentWrapper.innerHTML = '';
                pageError.style.display = 'block';
                pageError.innerHTML = 'The page you requested failed to load.'
                console.error(response)
            }
            return response.text();
        })
        .then(data => {
            contentWrapper.innerHTML = data;
            pageError.style.display = 'none'
            updateNavbar(theHash)
            showNavbarList(true)
        })
        .catch(err => {
            console.error(err)
            contentWrapper.innerHTML = ''
            pageError.style.display = 'block'
            pageErrorExplanation.innerHTML = 'The page you requested failed to load. <br /> An internal error occurred.'
        })
}

function updateNavbar(theHash) {
    for(const a of navbarLinks) {
        a.classList.remove("curr")
        if(a.getAttribute('href') == theHash) {
            a.classList.add("curr")
        }
    }
}

function updatePage() {
    const theHash = window.location.hash;
    let theURL = theHash.slice(1) + '.html'
    if(theHash == '' || theHash == '#') {
        theURL = 'homepage.html'
    }
    loadContent(theURL, theHash)
}

window.addEventListener('hashchange', updatePage)
window.addEventListener('load', updatePage)


function showNavbarList(forceClose = false) {
    if(topNavList.classList.toggle("shown") == true && forceClose == false) {
        hamburgerButton.innerHTML = "<"
    } else {
        if(forceClose == true) {
            topNavList.classList.remove("shown");
        }
        hamburgerButton.innerHTML = "&equiv;"
    }
}