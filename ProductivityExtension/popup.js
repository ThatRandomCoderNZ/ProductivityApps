document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("call-to-action");
    const text = document.getElementById("test-text");
    actionButton.addEventListener('click', () => {
        text.textContent = "Test This!";
        console.log("Hello World!");
    })
})