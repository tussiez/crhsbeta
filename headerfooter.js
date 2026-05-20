async function loadIncludes() {
    try {
        const headerResponse = await fetch('header.html');
        const footerResponse = await fetch('footer.html');

        if (headerResponse.ok) {
            document.getElementById('header').innerHTML = await headerResponse.text();
        }
        if (footerResponse.ok) {
            document.getElementById('footer').innerHTML = await footerResponse.text();
        }
    } catch (error) {
        console.error("Error loading includes:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadIncludes);