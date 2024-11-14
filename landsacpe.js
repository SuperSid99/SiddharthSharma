function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        document.querySelector(".rotate-message").style.display = "block";
        document.querySelector(".container").style.display = "none";
    } else {
        document.querySelector(".rotate-message").style.display = "none";
        document.querySelector(".container").style.display = "flex";
    }
}

// Run the function on load and on orientation change
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);