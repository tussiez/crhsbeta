
function homepageApp() {
    this.opportunityDiv = document.querySelector(".opportunities-wrapper");
    this.opportunitySelectors = document.getElementById("opportunity-selector");
    this.numOpportunities = this.opportunityDiv.childElementCount;
    this.timestamp = 0;
    this.currentOpportunity = 0;
    this.runnning = false;
    this.scrollSpeed = 10000; // milliseconds
    let scope = this;

    this.slideshowOpportunities = function() {
        let nowTime = performance.now();

        if(scope.opportunityDiv.matches(':hover')) scope.timestamp = nowTime;

        if (nowTime - scope.timestamp > scope.scrollSpeed) {
            if (scope.currentOpportunity < scope.numOpportunities - 2) {
                scope.currentOpportunity++;
            } else {
                scope.currentOpportunity = 0;
            }
            scope.presentOpportunity(scope.currentOpportunity);
        }

        if(scope.running) requestAnimationFrame(scope.slideshowOpportunities);
    }

    this.presentOpportunity = function(numOpp) {
        for(const ele of scope.opportunitySelectors.children) {
            if (ele.idxValue == numOpp) {
                ele.classList.add('current');
            } else {
                ele.classList.remove('current');
            }
        }
        for(const opp of scope.opportunityDiv.children) {
            const idxValue = opp.getAttribute('idxValue');
            if(idxValue != '-1') {
                if(idxValue == numOpp.toString()) {
                    opp.classList.add('fadeIn');
                    opp.classList.remove('fade');
                    opp.style.zIndex = '10';
                } else {
                    opp.classList.remove('fadeIn');
                    opp.classList.add('fade');
                    opp.style.zIndex = '1';
                }
            }
        }
        scope.timestamp = performance.now();
        scope.currentOpportunity = numOpp;
    }
    
    this.generateJumpTo = function() {
        for(let i = 0; i < scope.numOpportunities - 1; i++) { // subtracting 1 to remove dummy opp.
            let theButton = document.createElement('div');
            theButton.classList.add('opportunity-jumpto');
            theButton.onclick = () => {
                scope.presentOpportunity(i);
            }
            if(i == 0) {
                theButton.classList.add('current');
            }
            theButton.idxValue = i;
            scope.opportunitySelectors.appendChild(theButton);
        }
    }

    this.run = function() {
        scope.timestamp = performance.now();
        scope.running = true;
        scope.opportunitySelectors.style.gridTemplateColumns = `repeat(${scope.numOpportunities - 1}, 1fr)`;
        scope.generateJumpTo();
        requestAnimationFrame(scope.slideshowOpportunities);
    }

}

pageScript = new homepageApp();

pageScript.run();