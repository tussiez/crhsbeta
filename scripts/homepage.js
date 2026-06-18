const opportunityDiv = document.querySelector(".opportunities-wrapper");

function autoscrollOpportunities() {
    console.log("hola");
    opportunityDiv.scrollTop = opportunityDiv.scrollHeight;
}

setInterval(autoscrollOpportunities, 5000);