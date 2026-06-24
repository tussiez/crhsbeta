
function homepageApp() {
    this.opportunityDiv = document.querySelector(".opportunities-wrapper");
    this.opportunityProgress = document.getElementById("opportunity-progress");
    this.numOpportunities = this.opportunityDiv.childElementCount;
    this.timestamp = 0;
    this.currentOpportunity = 0;
    this.runnning = false;
    this.scrollSpeed = 10000; // milliseconds
    let scope = this;

    this.autoscrollOpportunities = function() {
        let nowTime = performance.now();

        if (nowTime - scope.timestamp > scope.scrollSpeed) {
            if (scope.currentOpportunity < scope.numOpportunities - 1) {
                scope.currentOpportunity++;
            } else {
                scope.currentOpportunity = 0;
            }
            scope.scrollToOpportunity(scope.currentOpportunity);
        }

        if(scope.running) requestAnimationFrame(scope.autoscrollOpportunities);
    }

    this.scrollToOpportunity = function(numOpp, resizeMode = false) {
        scope.opportunityDiv.scrollTo({
            left: scope.opportunityDiv.offsetWidth * numOpp,
            top: 0,
            behavior: resizeMode == false ? 'smooth' : 'instant'
        });
        for(const ele of scope.opportunityProgress.children) {
            if (ele.idxValue == numOpp) {
                ele.classList.add('current');
            } else {
                ele.classList.remove('current');
            }
        }
        scope.timestamp = performance.now();
        scope.currentOpportunity = numOpp;
    }
    
    this.generateJumpTo = function() {
        for(let i = 0; i < scope.numOpportunities; i++) {
            let theButton = document.createElement('div');
            theButton.classList.add('opportunity-jumpto');
            theButton.onclick = () => {
                scope.scrollToOpportunity(i);
            }
            if(i == 0) {
                theButton.classList.add('current');
            }
            theButton.idxValue = i;
            scope.opportunityProgress.appendChild(theButton);
        }
    }

    this.run = function() {
        scope.timestamp = performance.now();
        scope.running = true;
        scope.opportunityProgress.style.gridTemplateColumns = `repeat(${scope.numOpportunities}, 1fr)`;
        scope.generateJumpTo();
        window.addEventListener('resize', () => {
            scope.scrollToOpportunity(scope.currentOpportunity, true);
        });
        requestAnimationFrame(scope.autoscrollOpportunities);
    }
}

pageScript = new homepageApp();

pageScript.run();