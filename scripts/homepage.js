
function homepageApp() {
    this.opportunityDiv = document.querySelector(".opportunities-wrapper");
    this.opportunitySelectors = document.getElementById("opportunity-selector");
    this.newsTitle = document.querySelector(".news-title");
    this.newsDate = document.querySelector(".news-date");
    this.newsBody = document.querySelector(".news-body");
    this.newsImage = document.querySelector(".news-image");
    this.seg2Title = document.querySelector(".news-title.seg2");
    this.seg2Date = document.querySelector(".news-date.seg2");
    this.seg2Body = document.querySelector(".news-body.seg2");
    this.seg2Image = document.querySelector(".news-image.seg2");
    this.datesToKnow = document.querySelector(".dates-wrapper-scroll");
    this.numOpportunities = 0;
    this.timestamp = 0;
    this.currentOpportunity = 0;
    this.runnning = false;
    this.scrollSpeed = 10000; // milliseconds
    let scope = this;

    this.slideshowOpportunities = function() {
        let nowTime = performance.now();

        if(scope.opportunityDiv.matches(':hover')) scope.timestamp = nowTime;

        if (nowTime - scope.timestamp > scope.scrollSpeed) {
            if (scope.currentOpportunity < scope.numOpportunities - 1) {
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
        for(let i = 0; i < scope.numOpportunities; i++) {
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

    this.processJSON = function(obj) {
        obj.opportunities.forEach(scope.generateOpportunity);
        scope.generateNewsletter(obj.news.newsletter);
        scope.generateSegment2(obj.news.seg2)
        obj.datesToKnow.forEach(scope.generateDateToKnow);
    }

    this.generateDateToKnow = function(dtn) {
        let outer = document.createElement("div");
        scope.datesToKnow.appendChild(outer);
        outer.classList.add("important-date");
        let calPart = document.createElement("div");
        outer.appendChild(calPart);
        calPart.classList.add("important-date-cal");
        let calIcon = document.createElement("img");
        calIcon.setAttribute("src", "resources/images/calendar.svg");
        calIcon.setAttribute("height", 52);
        calIcon.setAttribute("width", 52);
        calPart.appendChild(calIcon);
        let calDate = document.createElement("span");
        calDate.innerText = dtn.date;
        calPart.appendChild(calDate);
        let calTime = document.createElement("span");
        calTime.classList.add("important-date-time");
        calTime.innerText = dtn.time;
        calPart.appendChild(calTime);
        let dateInfo = document.createElement("div");
        dateInfo.classList.add("important-date-info");
        outer.appendChild(dateInfo);
        let dateTitle = document.createElement("span");
        dateTitle.innerText = dtn.title;
        dateInfo.appendChild(dateTitle);
        let dateButton = document.createElement("button");
        dateButton.innerText = "More Info";
        dateButton.onclick = () => {
            scope.displayDateDetails(dtn);
        }
        dateInfo.appendChild(dateButton);
    }

    this.displayDateDetails = function(dtn) {
        let header = document.createElement("h1");
        header.innerText = dtn.title;
        let dateDetail = document.createElement("span");
        dateDetail.classList.add("details-date");
        dateDetail.innerText = `${dtn.date} @ ${dtn.time}`;
        let locationDetail = document.createElement("span");
        locationDetail.innerText = dtn.location;
        locationDetail.classList.add("details-location");
        let detailDesc = document.createElement("p");
        detailDesc.innerHTML = dtn.description;
        detailsWindowContent.replaceChildren(header, dateDetail, document.createElement("br"), locationDetail, document.createElement("br"), detailDesc);
        detailsWindowToggle(true);
    }

    this.generateNewsletter = function(nsl) {
        scope.newsImage.style.backgroundImage = `url('${nsl.image}')`;
        scope.newsDate.innerHTML = `${nsl.author} &nbsp;&bull;&nbsp; ${nsl.date}`
        scope.newsTitle.innerText = nsl.title;
        scope.newsBody.innerHTML = nsl.body;
    }

    this.generateSegment2 = function(seg) {
        scope.seg2Image.style.backgroundImage = `url('${seg.image}')`;
        scope.seg2Date.innerHTML = `${seg.author} &nbsp;&bull;&nbsp; ${seg.date}`
        scope.seg2Title.innerText = seg.title;
        scope.seg2Body.innerHTML = seg.body;
    }

    this.generateOpportunity = function(opr) {
        let outer = document.createElement("div");
        scope.opportunityDiv.appendChild(outer);
        outer.classList.add("opportunity");
        if(scope.numOpportunities == 0) {
            outer.classList.add("fadeIn");
        } else {
            outer.classList.add("fade");
        }
        outer.setAttribute("idxValue", scope.numOpportunities);
        scope.numOpportunities++;

        let innerContent = document.createElement("div");
        innerContent.classList.add("opportunity-content");
        outer.appendChild(innerContent);

        let innerContentInner = document.createElement("div");
        innerContent.appendChild(innerContentInner);

        let opportunityTitle = document.createElement("span");
        opportunityTitle.classList.add("opportunity-title");
        opportunityTitle.innerText = opr.title;
        innerContentInner.appendChild(opportunityTitle);
        innerContentInner.appendChild(document.createElement('br'));

        let opportunityDetails = document.createElement("span");
        opportunityDetails.classList.add("opportunity-details");
        opportunityDetails.innerHTML = `${opr.date}${opr.time != "" ? ' &nbsp;&bull;&nbsp; ' + opr.time : ''} &nbsp;&bull;&nbsp; `
        if (opr.isStreetAddress) {
            let opportunityAddress = document.createElement("a");
            opportunityAddress.innerText = opr.location;
            opportunityAddress.href = `https://www.google.com/maps/search/?api=1&query=${encodeURI(opr.location)}`;
            opportunityAddress.target = '_blank';
            opportunityDetails.appendChild(opportunityAddress);
        } else {
            opportunityDetails.innerText += opr.location;
        }
        innerContentInner.appendChild(opportunityDetails);
        innerContentInner.appendChild(document.createElement('br'));
        
        let opportunityDescription = document.createElement("span");
        opportunityDescription.classList.add("opportunity-description");
        opportunityDescription.innerText = opr.description; // innerHTML
        innerContentInner.appendChild(opportunityDescription);

        let opportunityBottom = document.createElement("div");
        opportunityBottom.classList.add("opportunity-bottom");
        innerContent.appendChild(opportunityBottom);

        let opportunityBottomButton = document.createElement("button");
        opportunityBottomButton.setAttribute('onclick', `window.open('${opr.innerview}')`); // IF NO INNERVIEW LINK: display instructions to submit opportunity
        opportunityBottomButton.classList.add("opportunity-button");
        opportunityBottomButton.innerText = "Sign Up";
        opportunityBottom.appendChild(opportunityBottomButton);

        let opportunityBottomHours = document.createElement("span");
        opportunityBottomHours.classList.add("opportunity-hours");
        opportunityBottomHours.innerText = ' ' + opr.hours;
        opportunityBottom.appendChild(opportunityBottomHours);

        let opportunityBottomHoursIcon = document.createElement("img")
        opportunityBottomHoursIcon.src = "resources/images/clock.svg";
        opportunityBottomHoursIcon.height = 16;
        opportunityBottomHoursIcon.width = 16;
        opportunityBottomHours.prepend(opportunityBottomHoursIcon);

        let opportunityImage = document.createElement("div");
        opportunityImage.classList.add("opportunity-image");
        opportunityImage.style.backgroundImage = `url(${opr.image})`;
        opportunityImage.setAttribute('onclick', `photoViewerToggle('${opr.image}')`);

        outer.appendChild(opportunityImage);
    }

    this.run = function() {
        scope.timestamp = performance.now();
        scope.running = true;
        scope.processJSON(content);
        scope.generateJumpTo();
        scope.opportunitySelectors.style.gridTemplateColumns = `repeat(${scope.numOpportunities}, 1fr)`;

        requestAnimationFrame(scope.slideshowOpportunities);
    }

}

pageScript = new homepageApp();

pageScript.run();