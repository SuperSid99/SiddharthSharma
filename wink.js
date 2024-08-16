document.addEventListener("DOMContentLoaded", function() {
    const textContainer = document.getElementById("text-container");
    const originalText = textContainer.innerHTML;
    const alternateCharacter = (text, fromChar, toChar) => {
        return text.replace(new RegExp(fromChar, 'g'), toChar);
    };
    let isAlternating = false;

    setInterval(() => {
        if (!isAlternating) {
            textContainer.innerHTML = alternateCharacter(originalText, ':', ';');
            isAlternating = true;
            setTimeout(() => {
                textContainer.innerHTML = originalText;
                isAlternating = false;
            }, 500); // Half a second
        }
    }, 2000); // Every 2 seconds
});