"use strict";
/*
   JavaScript 7th Edition
   Chapter 11
   Chapter Case

   Author:   Isabelle Samaniego
   Date:     December 4, 2022

   Filename: js11.js


*/

window.addEventListener("load", init);

function init() {
   // Page Objects
   let stories = document.getElementById("stories");
   let news = document.getElementById("news");
   let sInput = document.getElementById("sInput");
   let sButton = document.getElementById("sButton"); 
   let suggestBox = document.getElementById("suggestBox");    

   // Create a request object
    const xhr = new XMLHttpRequest();

    // Handle the changing request state
    xhr.onreadystatechange = function() {

        // first tests whether the response is complete and then tests whether the response is successful
        if (xhr.readyState === 4) {

            if (xhr.status >= 200 && xhr.status < 300) {

                // Manage the response
                stories.innerHTML = xhr.responseText;

            } else {
                console.log("Request failed: " + xhr.statusText);
            }
        }
    }

    // Open the request and send it
    xhr.open("get", "commentary.html");
    xhr.send(null);

    // Retrieve archived articles from the web server
    sButton.onclick = () => {

        // fetch() method to access the archive using the value of the  
        // sInput element as the keyword
        fetch("archives.pl?skey=" + encodeURIComponent(sInput.value))

        // then() method to return the value of the promised response
        .then ( response => {

            if (response.ok) {
                return response.text();
            } else {
                return "Unable to retrieve commentary";
            }

        })

        // then() method to insert text of the commentary within the stories element
        .then ( comtext => stories.innerHTML = comtext )

        // then() method that runs the getGIF() using the value of the sInput element
        .then (() => {
            let topic = sInput.value.toLowerCase();
            getGIF(topic);
        })
        
        // catch any network errors
        .catch (stories.innerHTML = "Network Failure");

    };

    // Fetch current headlines from the web server
    fetch("headlines.xml")

    // to parse the text string from the response object once the promise is resolved
    .then (response => response.text())

    // to receive the parsed text string and convert it into a DOM
    .then (str => new DOMParser().parseFromString(str, "text/xml"))

    // Write the XML content to HTML
    .then (dom => {

        // creating a node list of all item elements in the XML DOM
        let items = dom.querySelectorAll("item");

        // Loop through each story item in the items node list
        for (let story of items) {

            // Write the story content and append it to the page
            let headline = story.children[0].textContent;
            let link = story.children[1].textContent;
            let summary = story.children[2].textContent;

            // statement that uses a template literal to write the story content into an HTML fragment
            let htmlCode = `<article><h2><a href="${link}">${headline}</a></h2> 
                            <p>${summary}</p></article>`;

            // inserting the HTML code into the news sidebar
            news.insertAdjacentHTML("beforeend", htmlCode);
        }
    });

    // Suggest keywords as text is entered in the search box
    sInput.onkeyup = () => {

        // testing whether printable characters have been typed into the search box
        if (sInput.vaue === "") {

            suggestBox.style.display = "none";

        } else {

            // Retrieve a list of matching keywords
            fetch("keywords.pl?suggest=" + encodeURIComponent(sInput.value))
            .then (response => response.json())

            // Build the suggestion box
            .then(keywords => {
                suggestBox.innerHTML = "";

                // tests whether there are any keyword matches
                if (keywords.matches.length === 0) {
                    
                    // No suggestions to display
                    suggestBox.style.display = "none";

                } else {
                    
                    // Display suggestions
                    suggestBox.style.display = "block";

                    // for loop writing a div element for every item in the matches array
                    // Create a list of suggestions
                    for (let word of keywords.matches) {
                        let suggestion = document.createElement("div");
                        suggestion.textContent = word;
                        suggestBox.appendChild(suggestion);

                        // Add suggestion to search box when clicked
                        suggestion.onclick = () => {
                            sInput.value = word;
                            suggestBox.style.display = "none";
                            sButton.click();
                        }
                    }
                }
            })
        }
    };

}

// Fetch a GIF for a given topic from Giphy.com
function getGIF(topic) {
    const url = "https://api.giphy.com/v1/gifs/random";
    const key = "uISoFTobgb12JN7UblKFli8wfi4ZMavt";
    fetch(`${url}?api_key=${key}&tag=${topic}&limit=1&rating=pg`)
    .then(response => response.json())

    // to get the getGif()
    .then(obj => {
        let newImg = document.createElement("img");
        newImg.src = obj.data.images.fixed_height.url;
        stories.appendChild(newImg)
    })
}