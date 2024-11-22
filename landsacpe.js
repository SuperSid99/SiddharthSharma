function checkOrientation() {
    rotateMessage=document.querySelector(".rotate-box")
    if (window.innerHeight > window.innerWidth) {
        rotateMessage.classList.add('showBlock');
        rotateMessage.classList.remove('hidden');

        document.querySelector(".container").style.display = "none";
    } else {
        rotateMessage.classList.remove('showBlock');
        rotateMessage.classList.add('hidden');
        document.querySelector(".container").style.display = "flex";
    }
}

// Run the function on load and on orientation change
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);

const leftbox = document.querySelector('.left-box .counter');
            leftbox.classList.add('active');