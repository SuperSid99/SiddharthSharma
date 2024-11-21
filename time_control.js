// // Show the popup on page load

// // Get references to elements
// let popup;
// let shuffleButton;

// document.addEventListener("DOMContentLoaded", function () {
//     popup = document.getElementById("popup");
//     shuffleButton = document.getElementById("shuffleButton");
    
//     console.log(popup)
//     window.addEventListener("load", showPopup);
// });


// // Function to show the popup
// function showPopup() {
//     popup.classList.remove("hidden");
//     popup.classList.add("showflex");
// }

// function hidePopup() {
//     popup.classList.add("hidden");
//     popup.classList.remove("showflex");
// }

// // Event listener to show popup when shuffle button is clicked
// shuffleButton.addEventListener("click", showPopup);

// // Function to submit the start time
// function submitStartTime() {
//     const startTime = document.getElementById("startTime").value;
//     console.log(startTime)
    
//     if (startTime) {
//         console.log("Start time set to:", startTime); // Or perform your countdown setup
//         hidePopup(); // Hide the popup after setting the time
//         console.log("Start time set to:", startTime); // Or perform your countdown setup
//         return startTime
//     } else {
//         alert("Please enter a start time!");
//     }
// }
