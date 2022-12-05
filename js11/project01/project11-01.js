"use strict";
/*    JavaScript 7th Edition
      Chapter 11
      Project 11-01

      Project to retrieve the Astronomy Picture of the Day from NASA
      Author:     Isabelle Samaniego
      Date:       December 4, 2022

      Filename: project11-01.js
*/

let imageBox = document.getElementById("nasaImage");
let dateBox = document.getElementById("dateBox");

dateBox.onchange = function() {   

    // 3.a.
    let dateStr = document.getElementById("dateBox").value;

    // 3.b.
    fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&&date=${dateStr}`)
    
    // 3.c.
    .then(response => response.json())

    // 3.d.
    .then(data => showPicture(data))
    
    // 3.e.
    .catch((error) => {
        console.debug(error)
    })
}

// 4.
function showPicture(json) {

    // 4.a.
    if (json.media_type === "video") {

        imageBox.innerHTML = `<iframe src="${json.url}">
                            </iframe><h1>${json.title}</h1>
                            <p>${json.explanation}</p>`;

    } else if (json.media_type === "image") {

        imageBox.innerHTML = `<img src="${json.url}"/>
                            <h1>${json.title}</h1>
                            <p>${json.explanation}</p>`;

    } else {
        imageBox.innerHTML = "Image Not Available";
    }
    
}



